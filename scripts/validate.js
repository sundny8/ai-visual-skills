#!/usr/bin/env node
/**
 * 技能包校验脚本
 *
 * 检查每个技能是否符合 Agent Skills 规范：
 *   - 存在 SKILL.md，且 YAML frontmatter 含 name 与 description
 *   - frontmatter 的 name 与目录名一致
 *   - description 长度合理，且说明了「做什么」与「何时用」
 *   - SKILL.md 中引用的 references/ 文件真实存在
 *   - 目录内没有混入 _test / __pycache__ / node_modules 等垃圾
 *
 * 用法：node scripts/validate.js
 * 退出码：0 = 全部通过，1 = 有问题
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const SKILLS_DIR = path.join(ROOT, "skills");

const JUNK = ["_test", "__pycache__", "node_modules", ".git", ".DS_Store"];
const MIN_DESC = 20;
const MAX_DESC = 1024;

const errors = [];
const warnings = [];

function err(skill, msg) {
  errors.push(`${skill}: ${msg}`);
}
function warn(skill, msg) {
  warnings.push(`${skill}: ${msg}`);
}

/** 极简 YAML frontmatter 解析（只取顶层 key: value，够用且零依赖） */
function parseFrontmatter(text) {
  const m = text.match(/^---\s*\r?\n([\s\S]*?)\r?\n\s*---/);
  if (!m) return null;
  const out = {};
  for (const line of m[1].split(/\r?\n/)) {
    if (!line.trim() || line.trim().startsWith("#")) continue;
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    let value = line.slice(idx + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (key && value) out[key] = value;
  }
  return out;
}

function walk(dir, acc = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, acc);
    else acc.push(full);
  }
  return acc;
}

function validateSkill(name) {
  const dir = path.join(SKILLS_DIR, name);
  const skillMd = path.join(dir, "SKILL.md");

  if (!fs.existsSync(skillMd)) {
    err(name, "缺少 SKILL.md");
    return;
  }

  const text = fs.readFileSync(skillMd, "utf8");
  const fm = parseFrontmatter(text);

  if (!fm) {
    err(name, "SKILL.md 缺少 YAML frontmatter（需以 --- 包裹）");
    return;
  }
  if (!fm.name) err(name, "frontmatter 缺少必填字段 name");
  if (!fm.description) err(name, "frontmatter 缺少必填字段 description");

  if (fm.name && fm.name !== name) {
    err(name, `frontmatter 的 name 是 "${fm.name}"，与目录名 "${name}" 不一致`);
  }
  if (fm.name && !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(fm.name)) {
    warn(name, `name "${fm.name}" 建议只用小写字母、数字和连字符`);
  }

  const desc = fm.description || "";
  if (desc && desc.length < MIN_DESC) {
    err(name, `description 过短（${desc.length} 字符），至少 ${MIN_DESC} 字符`);
  }
  if (desc.length > MAX_DESC) {
    warn(name, `description 过长（${desc.length} 字符），建议不超过 ${MAX_DESC}`);
  }
  // 触发词检查：description 里应包含「何时使用」的信号
  const hasTrigger = /当|提到|使用|when|use|trigger|要求/i.test(desc);
  if (desc && !hasTrigger) {
    warn(name, "description 未说明「何时使用」，模型可能不会触发该技能");
  }

  // 正文中引用的 references/ 文件必须存在
  const refs = [...text.matchAll(/references\/([A-Za-z0-9._-]+\.md)/g)].map((m) => m[1]);
  for (const ref of new Set(refs)) {
    if (!fs.existsSync(path.join(dir, "references", ref))) {
      err(name, `SKILL.md 引用了不存在的文件 references/${ref}`);
    }
  }

  // 反向检查：references/ 里的文件是否都被引用（未引用只警告）
  const refDir = path.join(dir, "references");
  if (fs.existsSync(refDir)) {
    for (const f of fs.readdirSync(refDir)) {
      if (!refs.includes(f)) warn(name, `references/${f} 未被 SKILL.md 引用`);
    }
  }

  // 垃圾文件检查
  for (const file of walk(dir)) {
    const rel = path.relative(dir, file);
    if (rel.split(path.sep).some((part) => JUNK.includes(part))) {
      err(name, `目录内混入了不该提交的内容：${rel}`);
    }
  }

  // 体积检查
  const files = walk(dir);
  const size = files.reduce((sum, f) => sum + fs.statSync(f).size, 0);
  if (size > 500 * 1024) {
    warn(name, `技能体积 ${(size / 1024).toFixed(0)} KB 偏大，建议控制在 500 KB 内`);
  }
  if (!fs.existsSync(path.join(dir, "README.md"))) {
    warn(name, "建议提供 README.md 便于在 GitHub 上阅读");
  }
}

function main() {
  if (!fs.existsSync(SKILLS_DIR)) {
    console.error(`找不到 skills/ 目录：${SKILLS_DIR}`);
    process.exit(1);
  }

  const skills = fs
    .readdirSync(SKILLS_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort();

  if (skills.length === 0) {
    console.error("skills/ 下没有任何技能目录");
    process.exit(1);
  }

  for (const name of skills) validateSkill(name);

  console.log(`\n校验了 ${skills.length} 个技能：${skills.join(", ")}\n`);

  if (warnings.length) {
    console.log(`警告（${warnings.length}）`);
    for (const w of warnings) console.log(`  ! ${w}`);
    console.log();
  }

  if (errors.length) {
    console.log(`错误（${errors.length}）`);
    for (const e of errors) console.log(`  x ${e}`);
    console.log("\n校验未通过。\n");
    process.exit(1);
  }

  console.log("校验通过。\n");
}

main();
