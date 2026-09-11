#!/usr/bin/env node
/**
 * ai-visual-skills CLI
 *
 * 把本包内置的 Agent Skills 安装到各家 AI 智能体的 Skills 目录。
 * 自包含、无需联网，装完即用。
 *
 * 用法：
 *   npx ai-visual-skills list
 *   npx ai-visual-skills install --all
 *   npx ai-visual-skills install -a claude-code -a cursor
 *   npx ai-visual-skills install -p --to ./my-project
 *   npx ai-visual-skills uninstall --all
 */

import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PKG_ROOT = path.resolve(__dirname, "..");
const SKILLS_DIR = path.join(PKG_ROOT, "skills");

// ─────────────────────────────────────────────────────────────
// Agent 注册表
// key 与 skills CLI 的 --agent 取值保持一致，便于用户迁移
// ─────────────────────────────────────────────────────────────
const AGENTS = {
  "claude-code": {
    label: "Claude Code",
    aliases: ["claude"],
    project: ".claude/skills",
    global: ".claude/skills",
    detect: ".claude",
  },
  codex: {
    label: "Codex CLI",
    aliases: [],
    project: ".agents/skills",
    global: ".codex/skills",
    detect: ".codex",
  },
  cursor: {
    label: "Cursor",
    aliases: [],
    project: ".agents/skills",
    global: ".cursor/skills",
    detect: ".cursor",
  },
  qoder: {
    label: "Qoder",
    aliases: [],
    project: ".qoder/skills",
    global: ".qoder/skills",
    detect: ".qoder",
  },
  workbuddy: {
    label: "WorkBuddy",
    aliases: ["wb"],
    project: ".workbuddy-ai/skills",
    global: ".workbuddy-ai/skills",
    detect: ".workbuddy-ai",
  },
  "github-copilot": {
    label: "GitHub Copilot",
    aliases: ["copilot"],
    project: ".agents/skills",
    global: ".copilot/skills",
    detect: ".copilot",
  },
  "gemini-cli": {
    label: "Gemini CLI",
    aliases: ["gemini"],
    project: ".agents/skills",
    global: ".gemini/skills",
    detect: ".gemini",
  },
  windsurf: {
    label: "Windsurf",
    aliases: [],
    project: ".windsurf/skills",
    global: ".codeium/windsurf/skills",
    detect: ".codeium",
  },
  opencode: {
    label: "OpenCode",
    aliases: [],
    project: ".agents/skills",
    global: ".config/opencode/skills",
    detect: ".config/opencode",
  },
  codebuddy: {
    label: "CodeBuddy",
    aliases: [],
    project: ".codebuddy/skills",
    global: ".codebuddy/skills",
    detect: ".codebuddy",
  },
  universal: {
    label: "通用 .agents",
    aliases: ["agents", "amp", "replit"],
    project: ".agents/skills",
    global: ".config/agents/skills",
    detect: ".config/agents",
  },
};

const ALIAS_MAP = Object.entries(AGENTS).reduce((acc, [key, meta]) => {
  acc[key] = key;
  for (const alias of meta.aliases) acc[alias] = key;
  return acc;
}, {});

// ─────────────────────────────────────────────────────────────
// 工具函数
// ─────────────────────────────────────────────────────────────
const C = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  cyan: "\x1b[36m",
};
const color = process.stdout.isTTY
  ? (c, s) => `${C[c]}${s}${C.reset}`
  : (_c, s) => s;

function fail(msg) {
  console.error(color("red", `错误：${msg}`));
  process.exit(1);
}

/** 列出包内置的技能（含 SKILL.md 的目录） */
function listSkills() {
  if (!fs.existsSync(SKILLS_DIR)) return [];
  return fs
    .readdirSync(SKILLS_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .filter((name) => fs.existsSync(path.join(SKILLS_DIR, name, "SKILL.md")))
    .sort();
}

/** 从 SKILL.md 读 description，用于展示 */
function readDescription(skillName) {
  const md = path.join(SKILLS_DIR, skillName, "SKILL.md");
  try {
    const text = fs.readFileSync(md, "utf8");
    const block = text.match(/^---\s*\n([\s\S]*?)\n\s*---/);
    if (!block) return "";
    const line = block[1].split("\n").find((l) => l.trim().startsWith("description:"));
    if (!line) return "";
    return line.slice(line.indexOf(":") + 1).trim().replace(/^["']|["']$/g, "");
  } catch {
    return "";
  }
}

function resolveAgents(input) {
  if (!input || input.length === 0) return null;
  const out = [];
  for (const raw of input) {
    for (const token of String(raw).split(",").map((s) => s.trim()).filter(Boolean)) {
      if (token === "*") return Object.keys(AGENTS);
      const key = ALIAS_MAP[token.toLowerCase()];
      if (!key) {
        fail(
          `未知的 agent：${token}\n可用：${Object.keys(AGENTS).join(", ")}\n` +
            `别名：${Object.entries(AGENTS)
              .filter(([, m]) => m.aliases.length)
              .map(([k, m]) => `${k} = ${m.aliases.join("/")}`)
              .join(", ")}`
        );
      }
      if (!out.includes(key)) out.push(key);
    }
  }
  return out;
}

/** 探测本机已安装的 agent（看其配置目录是否存在） */
function detectAgents() {
  const home = os.homedir();
  return Object.entries(AGENTS)
    .filter(([, meta]) => fs.existsSync(path.join(home, meta.detect)))
    .map(([key]) => key);
}

function targetDir(agentKey, scope, projectRoot) {
  const meta = AGENTS[agentKey];
  const base = scope === "global" ? os.homedir() : projectRoot;
  return path.resolve(base, scope === "global" ? meta.global : meta.project);
}

function makeLinkOrCopy(src, dest, useSymlink) {
  if (useSymlink) {
    const type = process.platform === "win32" ? "junction" : "dir";
    try {
      fs.symlinkSync(src, dest, type);
      return "链接";
    } catch {
      // 权限不足时降级为复制
    }
  }
  fs.cpSync(src, dest, { recursive: true });
  return "复制";
}

function ensureParent(p) {
  fs.mkdirSync(path.dirname(p), { recursive: true });
}

function removeDir(dest) {
  fs.rmSync(dest, { recursive: true, force: true });
}

// ─────────────────────────────────────────────────────────────
// 参数解析（手写，零依赖）
// ─────────────────────────────────────────────────────────────
function parseArgs(argv) {
  const opts = {
    command: null,
    agents: [],
    skills: [],
    scope: null,
    symlink: false,
    dryRun: false,
    force: false,
    yes: false,
    to: null,
    help: false,
    version: false,
  };

  const VALUE_FLAGS = new Set(["-a", "--agent", "-s", "--skill", "--to"]);

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (VALUE_FLAGS.has(arg)) {
      const val = argv[++i];
      if (val === undefined) fail(`${arg} 需要一个值`);
      if (arg === "-a" || arg === "--agent") opts.agents.push(val);
      else if (arg === "-s" || arg === "--skill") opts.skills.push(val);
      else opts.to = val;
      continue;
    }
    switch (arg) {
      case "-g":
      case "--global":
        opts.scope = "global";
        break;
      case "-p":
      case "--project":
        opts.scope = "project";
        break;
      case "--all":
        opts.agents.push("*");
        opts.skills.push("*");
        opts.yes = true;
        break;
      case "--symlink":
      case "--link":
        opts.symlink = true;
        break;
      case "--copy":
        opts.symlink = false;
        break;
      case "--dry-run":
        opts.dryRun = true;
        break;
      case "-f":
      case "--force":
        opts.force = true;
        break;
      case "-y":
      case "--yes":
        opts.yes = true;
        break;
      case "-h":
      case "--help":
        opts.help = true;
        break;
      case "-v":
      case "--version":
        opts.version = true;
        break;
      default:
        if (arg.startsWith("-")) fail(`未知选项：${arg}（用 --help 查看用法）`);
        if (!opts.command) opts.command = arg;
        else fail(`多余的参数：${arg}`);
    }
  }
  return opts;
}

function printHelp() {
  const pkg = JSON.parse(fs.readFileSync(path.join(PKG_ROOT, "package.json"), "utf8"));
  console.log(`
${color("bold", "ai-visual-skills")} ${color("dim", `v${pkg.version}`)}
${pkg.description || ""}

${color("bold", "用法")}
  npx ai-visual-skills <命令> [选项]

${color("bold", "命令")}
  list, ls              列出内置技能与支持的 agent
  install, i, add       安装技能到 agent 目录
  uninstall, rm         从 agent 目录移除技能
  agents                查看本机检测到的 agent

${color("bold", "选项")}
  -a, --agent <名>      目标 agent，可重复或用逗号分隔（默认自动探测本机已装）
  -s, --skill <名>      只装指定技能（默认全部）
  -g, --global          装到用户级全局目录 ${color("dim", "（默认）")}
  -p, --project         装到当前项目目录
      --to <路径>       自定义安装根目录
      --symlink         用软链接代替复制（便于统一维护）
      --copy            强制复制 ${color("dim", "（默认）")}
      --all             全部技能装到全部 agent，跳过确认
      --dry-run         只预览，不写盘
  -f, --force           覆盖已存在的同名技能
  -y, --yes             跳过确认提示
  -h, --help            显示帮助
  -v, --version         显示版本

${color("bold", "示例")}
  npx ai-visual-skills install --all
  npx ai-visual-skills install -a claude-code,cursor,qoder
  npx ai-visual-skills install -s image-prompt-director -a cursor
  npx ai-visual-skills install -p --to ./my-project
  npx ai-visual-skills uninstall --all

${color("bold", "支持的 agent")}
${Object.entries(AGENTS)
  .map(([k, m]) => `  ${k.padEnd(16)}${m.label}`)
  .join("\n")}
`);
}

// ─────────────────────────────────────────────────────────────
// 命令实现
// ─────────────────────────────────────────────────────────────
function cmdList() {
  const skills = listSkills();
  const detected = detectAgents();

  console.log(color("bold", `\n内置技能（${skills.length}）\n`));
  for (const s of skills) {
    const desc = readDescription(s);
    console.log(`  ${color("cyan", s)}`);
    if (desc) console.log(`    ${color("dim", desc.slice(0, 100) + (desc.length > 100 ? "…" : ""))}`);
  }

  console.log(color("bold", `\n支持的 agent（${Object.keys(AGENTS).length}）\n`));
  console.log(
    `  ${"名称".padEnd(16)}${"说明".padEnd(16)}${"用户级目录".padEnd(34)}本机`
  );
  console.log("  " + "─".repeat(80));
  for (const [key, meta] of Object.entries(AGENTS)) {
    const mark = detected.includes(key) ? color("green", "✓") : color("dim", "·");
    console.log(
      `  ${key.padEnd(16)}${meta.label.padEnd(16)}${("~/" + meta.global).padEnd(34)}${mark}`
    );
  }
  console.log(
    `\n${color("dim", "本机检测到的 agent 会在未指定 -a 时作为默认目标。")}\n`
  );
}

function cmdAgents() {
  const detected = detectAgents();
  if (detected.length === 0) {
    console.log("未检测到任何已安装的 agent。用 -a 显式指定目标。");
    return;
  }
  console.log(color("bold", `\n本机检测到 ${detected.length} 个 agent：\n`));
  for (const key of detected) {
    console.log(`  ${color("green", "✓")} ${key.padEnd(16)}${AGENTS[key].label}`);
  }
  console.log();
}

function resolveSkillNames(input) {
  const all = listSkills();
  if (!input || input.length === 0) return all;
  const out = [];
  for (const raw of input) {
    for (const token of String(raw).split(",").map((s) => s.trim()).filter(Boolean)) {
      if (token === "*") return all;
      if (!all.includes(token)) {
        fail(`找不到技能：${token}\n可用：${all.join(", ")}`);
      }
      if (!out.includes(token)) out.push(token);
    }
  }
  return out;
}

function cmdInstall(opts) {
  const skills = resolveSkillNames(opts.skills);
  if (skills.length === 0) fail("包内没有找到任何技能");

  const scope = opts.scope || "global";
  const projectRoot = process.cwd();

  let agents = resolveAgents(opts.agents);
  let autoDetected = false;
  if (!agents) {
    agents = detectAgents();
    autoDetected = true;
    if (agents.length === 0) agents = Object.keys(AGENTS);
  }

  // 计算安装目标，按目录去重（多个 agent 可能共享 .agents/skills）
  const targets = [];
  const seen = new Set();
  for (const agent of agents) {
    const dir = targetDir(agent, scope, projectRoot);
    const key = dir.toLowerCase();
    const isDup = seen.has(key);
    if (!isDup) seen.add(key);
    targets.push({ agent, dir, isDup });
  }

  console.log(color("bold", "\nai-visual-skills · 安装\n"));
  console.log(`  技能    ${skills.join(", ")}`);
  console.log(
    `  目标    ${agents.length} 个 agent${autoDetected ? color("dim", "（自动探测）") : ""} → ${targets.filter((t) => !t.isDup).length} 个目录`
  );
  console.log(
    `  作用域  ${scope === "global" ? "用户级全局" : `项目级：${projectRoot}`}`
  );
  console.log(`  方式    ${opts.symlink ? "软链接" : "复制"}${opts.dryRun ? "（预览）" : ""}\n`);

  if (opts.to) {
    console.log(`  ${color("yellow", "注意")} 指定了 --to，将只安装到该目录\n`);
  }

  let ok = 0;
  let skipped = 0;
  let failed = 0;

  const plan = opts.to
    ? [{ agent: "custom", dir: path.resolve(opts.to), isDup: false }]
    : targets;

  for (const { agent, dir, isDup } of plan) {
    if (isDup) {
      console.log(
        `  ${color("dim", "跳过")}  ${agent.padEnd(16)}${color("dim", "与前面的 agent 共用同一目录")}`
      );
      continue;
    }

    for (const skill of skills) {
      const src = path.join(SKILLS_DIR, skill);
      const dest = path.join(dir, skill);
      const label = `${agent} · ${skill}`;

      if (fs.existsSync(dest) && !opts.force) {
        console.log(`  ${color("yellow", "已存在")} ${label.padEnd(42)}${color("dim", dest)}`);
        console.log(`           ${color("dim", "用 --force 覆盖")}`);
        skipped++;
        continue;
      }

      if (opts.dryRun) {
        console.log(`  ${color("dim", "[预览]")} ${label.padEnd(42)}${color("dim", dest)}`);
        ok++;
        continue;
      }

      try {
        ensureParent(dest);
        if (fs.existsSync(dest)) removeDir(dest);
        const how = makeLinkOrCopy(src, dest, opts.symlink);
        console.log(`  ${color("green", how)}   ${label.padEnd(42)}${color("dim", dest)}`);
        ok++;
      } catch (err) {
        console.log(`  ${color("red", "失败")}   ${label.padEnd(42)}${err.message}`);
        failed++;
      }
    }
  }

  console.log(
    `\n完成：成功 ${ok}，跳过 ${skipped}，失败 ${failed}。`
  );
  if (ok > 0 && !opts.dryRun) {
    console.log(color("dim", "部分 agent 需要重启后才会加载新技能。"));
  }
  console.log();
  if (failed > 0) process.exitCode = 1;
}

function cmdUninstall(opts) {
  const skills = resolveSkillNames(opts.skills);
  const scope = opts.scope || "global";
  const projectRoot = process.cwd();

  let agents = resolveAgents(opts.agents);
  if (!agents) {
    agents = detectAgents();
    if (agents.length === 0) agents = Object.keys(AGENTS);
  }

  const dirs = [];
  const seen = new Set();
  for (const agent of agents) {
    const dir = targetDir(agent, scope, projectRoot);
    if (seen.has(dir.toLowerCase())) continue;
    seen.add(dir.toLowerCase());
    dirs.push({ agent, dir });
  }
  if (opts.to) dirs.push({ agent: "custom", dir: path.resolve(opts.to) });

  console.log(color("bold", "\nai-visual-skills · 卸载\n"));

  let removed = 0;
  let missing = 0;
  for (const { agent, dir } of dirs) {
    for (const skill of skills) {
      const dest = path.join(dir, skill);
      const label = `${agent} · ${skill}`;
      if (!fs.existsSync(dest)) {
        console.log(`  ${color("dim", "未安装")} ${label.padEnd(42)}${color("dim", dest)}`);
        missing++;
        continue;
      }
      if (opts.dryRun) {
        console.log(`  ${color("dim", "[预览]")} ${label.padEnd(42)}${color("dim", dest)}`);
        removed++;
        continue;
      }
      try {
        removeDir(dest);
        console.log(`  ${color("green", "已移除")} ${label.padEnd(42)}${color("dim", dest)}`);
        removed++;
      } catch (err) {
        console.log(`  ${color("red", "失败")}   ${label.padEnd(42)}${err.message}`);
      }
    }
  }
  console.log(`\n完成：移除 ${removed}，未安装 ${missing}。\n`);
}

// ─────────────────────────────────────────────────────────────
// 入口
// ─────────────────────────────────────────────────────────────
function main() {
  const opts = parseArgs(process.argv.slice(2));

  if (opts.version) {
    const pkg = JSON.parse(fs.readFileSync(path.join(PKG_ROOT, "package.json"), "utf8"));
    console.log(pkg.version);
    return;
  }

  const cmd = (opts.command || "").toLowerCase();
  if (opts.help || cmd === "" || cmd === "help") {
    printHelp();
    return;
  }

  switch (cmd) {
    case "list":
    case "ls":
      cmdList();
      break;
    case "agents":
      cmdAgents();
      break;
    case "install":
    case "i":
    case "add":
      cmdInstall(opts);
      break;
    case "uninstall":
    case "remove":
    case "rm":
      cmdUninstall(opts);
      break;
    default:
      fail(`未知命令：${opts.command}（用 --help 查看用法）`);
  }
}

main();
