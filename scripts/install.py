#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Agent Skills 跨工具安装器（Python 版，无需 Node）

支持两种目录形态，自动识别：

  1. 单技能模式：脚本与 SKILL.md 同级
     <skill-name>/install.py + SKILL.md

  2. 仓库模式：脚本位于仓库的 scripts/ 下
     <repo>/scripts/install.py + <repo>/skills/<name>/SKILL.md

把技能分发到各家 AI 智能体的 Skills 目录。

用法示例：
    python install.py --list                       # 查看所有目标路径
    python install.py --all                        # 装到全部 agent（用户级全局）
    python install.py --tool claude-code,cursor    # 只装指定 agent
    python install.py --all --scope project --project-dir ../my-project
    python install.py --tool workbuddy --uninstall
    python install.py --all --link                 # 用软链接代替复制
    python install.py --all --dry-run              # 只预览，不落盘
"""

import argparse
import os
import re
import shutil
import sys
from pathlib import Path

# ─────────────────────────────────────────────────────────────
# Agent 注册表：key -> (显示名, 用户级相对路径, 项目级相对路径)
# key 与 skills CLI 的 --agent 取值保持一致
# ─────────────────────────────────────────────────────────────
TOOLS = {
    "claude-code":    ("Claude Code",    ".claude/skills",           ".claude/skills"),
    "codex":          ("Codex CLI",      ".codex/skills",            ".agents/skills"),
    "cursor":         ("Cursor",         ".cursor/skills",           ".agents/skills"),
    "qoder":          ("Qoder",          ".qoder/skills",            ".qoder/skills"),
    "workbuddy":      ("WorkBuddy",      ".workbuddy-ai/skills",     ".workbuddy-ai/skills"),
    "github-copilot": ("GitHub Copilot", ".copilot/skills",          ".agents/skills"),
    "gemini-cli":     ("Gemini CLI",     ".gemini/skills",           ".agents/skills"),
    "windsurf":       ("Windsurf",       ".codeium/windsurf/skills", ".windsurf/skills"),
    "opencode":       ("OpenCode",       ".config/opencode/skills",  ".agents/skills"),
    "codebuddy":      ("CodeBuddy",      ".codebuddy/skills",        ".codebuddy/skills"),
    "universal":      ("通用 .agents",    ".config/agents/skills",    ".agents/skills"),
}

# 别名
ALIASES = {
    "claude": "claude-code",
    "wb": "workbuddy",
    "copilot": "github-copilot",
    "gemini": "gemini-cli",
    "agents": "universal",
    "amp": "universal",
    "replit": "universal",
}

# 兼容旧路径
LEGACY_USER_PATHS = {
    "workbuddy": [".workbuddy/skills"],
}

COPY_IGNORE = shutil.ignore_patterns(
    ".git", "__pycache__", "*.pyc", ".DS_Store", "_test", "node_modules"
)


# ─────────────────────────────────────────────────────────────
# 目录识别
# ─────────────────────────────────────────────────────────────
def script_dir() -> Path:
    return Path(__file__).resolve().parent


def detect_skill_name(skill_dir: Path) -> str:
    """从 SKILL.md 的 frontmatter 读 name；读不到则回退为目录名。"""
    md = skill_dir / "SKILL.md"
    if md.exists():
        text = md.read_text(encoding="utf-8", errors="ignore")
        block = re.match(r"^\s*---\s*\n(.*?)\n\s*---", text, re.S)
        if block:
            for line in block.group(1).splitlines():
                if line.strip().startswith("name:"):
                    value = line.split(":", 1)[1].strip().strip("'\"")
                    if value:
                        return value
    return skill_dir.name


def find_skills() -> list:
    """返回 [(技能名, 技能目录 Path)]，自动识别单技能模式或仓库模式。"""
    here = script_dir()

    # 模式 1：脚本与 SKILL.md 同级
    if (here / "SKILL.md").exists():
        return [(detect_skill_name(here), here)]

    # 模式 2：仓库模式，脚本在 scripts/ 下
    repo_skills = here.parent / "skills"
    if repo_skills.is_dir():
        found = [
            (detect_skill_name(c), c)
            for c in sorted(repo_skills.iterdir())
            if c.is_dir() and (c / "SKILL.md").exists()
        ]
        if found:
            return found

    # 模式 3：脚本所在目录的子目录里找
    return [
        (detect_skill_name(c), c)
        for c in sorted(here.iterdir())
        if c.is_dir() and (c / "SKILL.md").exists()
    ]


def is_inside(child: Path, parent: Path) -> bool:
    """判断 child 是否位于 parent 之内（含自身）。"""
    try:
        child.resolve().relative_to(parent.resolve())
        return True
    except ValueError:
        return False


# ─────────────────────────────────────────────────────────────
# 目标解析
# ─────────────────────────────────────────────────────────────
def normalize_key(raw: str) -> str:
    key = ALIASES.get(raw.strip().lower(), raw.strip().lower())
    if key not in TOOLS:
        raise KeyError(raw)
    return key


def resolve_targets(tool_keys, scope: str, project_dir: Path):
    """返回 [(显示名, 目标根目录 Path)]，已按目录去重。"""
    out, seen = [], set()
    for key in tool_keys:
        display, user_rel, project_rel = TOOLS[key]
        if scope == "user":
            rels = [user_rel] + LEGACY_USER_PATHS.get(key, [])
            base = Path.home()
        else:
            rels = [project_rel]
            base = project_dir
        for rel in rels:
            target = (base / rel).resolve()
            low = str(target).lower()
            if low in seen:
                continue
            seen.add(low)
            label = display if rel == rels[0] else f"{display} (旧路径)"
            out.append((label, target))
    return out


def install_one(src: Path, dest: Path, use_link: bool, dry_run: bool, force: bool) -> str:
    # 防护：目标不能落在源目录内部，否则 copytree 会自我递归
    if is_inside(dest, src):
        raise ValueError(
            "目标目录位于技能源目录内部，会导致无限递归复制。请改用技能目录之外的路径。"
        )

    if dest.exists() and not force:
        return f"[跳过·已存在] {dest}  （加 --force 覆盖）"

    if dry_run:
        return f"[预览] {dest}"

    dest.parent.mkdir(parents=True, exist_ok=True)

    if dest.exists() or dest.is_symlink():
        if dest.is_symlink() or dest.is_file():
            dest.unlink()
        else:
            shutil.rmtree(dest)

    if use_link:
        try:
            os.symlink(src, dest, target_is_directory=True)
            return f"[链接] {dest}"
        except (OSError, NotImplementedError):
            shutil.copytree(src, dest, ignore=COPY_IGNORE)
            return f"[复制·软链不可用已降级] {dest}"
    shutil.copytree(src, dest, ignore=COPY_IGNORE)
    return f"[复制] {dest}"


def uninstall_one(dest: Path, dry_run: bool) -> str:
    if not dest.exists() and not dest.is_symlink():
        return f"[跳过·未安装] {dest}"
    if dry_run:
        return f"[预览·将删除] {dest}"
    if dest.is_symlink() or dest.is_file():
        dest.unlink()
    else:
        shutil.rmtree(dest)
    return f"[已移除] {dest}"


# ─────────────────────────────────────────────────────────────
# 入口
# ─────────────────────────────────────────────────────────────
def main():
    parser = argparse.ArgumentParser(
        description="把 Agent Skills 安装到各家 AI 智能体",
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    parser.add_argument("--list", action="store_true", help="列出技能、支持的 agent 与目标路径")
    parser.add_argument("--tool", default="", help="逗号分隔的 agent 名，如 claude-code,cursor")
    parser.add_argument("--skill", default="", help="逗号分隔的技能名，默认全部")
    parser.add_argument("--all", action="store_true", help="安装到全部 agent")
    parser.add_argument("--scope", choices=["user", "project"], default="user",
                        help="user=用户级全局（默认）；project=仅当前项目")
    parser.add_argument("--project-dir", default=".", help="项目根目录，配合 --scope project")
    parser.add_argument("--to", default="", help="自定义安装根目录（覆盖 --tool/--scope）")
    parser.add_argument("--link", action="store_true", help="用软链接代替复制")
    parser.add_argument("--force", action="store_true", help="覆盖已存在的同名技能")
    parser.add_argument("--uninstall", action="store_true", help="卸载")
    parser.add_argument("--dry-run", action="store_true", help="只预览，不实际写入")
    args = parser.parse_args()

    skills = find_skills()

    if args.list:
        print("发现的技能：")
        for name, path_ in skills:
            print(f"  {name:<26}{path_}")
        print(f"\n支持的 agent（{len(TOOLS)}）：")
        print(f"  {'名称':<18}{'说明':<18}{'用户级路径':<38}项目级路径")
        print("  " + "-" * 100)
        for key, (display, user_rel, project_rel) in TOOLS.items():
            print(f"  {key:<18}{display:<18}{'~/' + user_rel:<38}{project_rel}")
        print("\n别名：" + ", ".join(f"{a} = {k}" for a, k in ALIASES.items()))
        return 0

    if not skills:
        print("错误：没有找到任何含 SKILL.md 的技能目录。", file=sys.stderr)
        return 1

    # 选择技能
    if args.skill:
        wanted = [s.strip() for s in args.skill.split(",") if s.strip()]
        available = {name for name, _ in skills}
        unknown = [s for s in wanted if s not in available]
        if unknown:
            print(f"未知技能：{', '.join(unknown)}\n可用：{', '.join(sorted(available))}",
                  file=sys.stderr)
            return 2
        skills = [(n, p) for n, p in skills if n in wanted]

    # 选择目标
    if args.to:
        targets = [("自定义", Path(args.to).expanduser().resolve())]
    else:
        if args.all:
            keys = list(TOOLS.keys())
        elif args.tool:
            raw = [t.strip() for t in args.tool.split(",") if t.strip()]
            try:
                keys = [normalize_key(t) for t in raw]
            except KeyError as exc:
                print(f"未知 agent：{exc.args[0]}\n可用：{', '.join(TOOLS.keys())}",
                      file=sys.stderr)
                return 2
        else:
            parser.print_help()
            print("\n提示：至少指定 --all 或 --tool，或使用 --list 查看目标。", file=sys.stderr)
            return 2

        project_dir = Path(args.project_dir).expanduser().resolve()
        if args.scope == "project":
            for _, src in skills:
                if is_inside(project_dir, src):
                    print(
                        f"错误：项目目录 {project_dir}\n"
                        f"      位于技能目录 {src} 内部，复制时会无限递归。\n"
                        f"      请改用技能目录之外的路径。",
                        file=sys.stderr,
                    )
                    return 1
        targets = resolve_targets(keys, args.scope, project_dir)

    if args.to:
        scope_desc = f"自定义：{targets[0][1]}"
    elif args.scope == "user":
        scope_desc = "用户级（全局）"
    else:
        scope_desc = f"项目级：{args.project_dir}"

    action = "卸载" if args.uninstall else ("软链接" if args.link else "复制")
    print(f"技能：{', '.join(n for n, _ in skills)}")
    print(f"作用域：{scope_desc}")
    print(f"方式：{action}{'（预览模式）' if args.dry_run else ''}")
    print(f"目标数量：{len(targets)}\n")

    ok, skipped, failed = 0, 0, 0
    for name, src in skills:
        for label, root in targets:
            dest = root / name
            try:
                if args.uninstall:
                    msg = uninstall_one(dest, args.dry_run)
                else:
                    msg = install_one(src, dest, args.link, args.dry_run, args.force)
                if "跳过" in msg:
                    skipped += 1
                else:
                    ok += 1
                print(f"  {label:<18}{msg}")
            except Exception as exc:
                print(f"  {label:<18}[失败] {dest} -> {exc}")
                failed += 1

    print(f"\n完成：成功 {ok}，跳过 {skipped}，失败 {failed}。")
    if ok and not args.dry_run and not args.uninstall:
        print("提示：部分 agent 需要重启后才会加载新技能。")
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main())
