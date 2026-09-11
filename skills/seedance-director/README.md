# Seedance 2.5 电影导演 · 安装说明

一个跨工具通用的 Agent Skill。写一次，装到 Claude Code / Codex / Cursor / Qoder / WorkBuddy / Copilot / Gemini CLI / Windsurf。

---

## 这是什么

把一句普通想法（故事、人物、场景、广告、历史事件、电影桥段……）导演成一部 30 秒电影级视频提示词。

产出物是**可直接投喂 Seedance 2.5 的提示词文本**，不是视频文件。

核心能力：

- 五幕结构 + 30 秒时间轴编排
- 七维分镜设计（景别 / 角度 / 构图 / 光影 / 色彩 / 动势 / 转场）
- 人物与场景一致性锁定
- 动作物理链与微表情转译
- 声音设计与风格匹配
- 安全脱敏改写

---

## 一、安装

本技能是 [`ai-visual-skills`](../../) 仓库的一部分，推荐用仓库级安装器一次装好全部技能。

### 方式一：skills CLI（推荐）

```bash
npx skills add <你的GitHub用户名>/ai-visual-skills -s seedance-director -g -y
```

### 方式二：npm

```bash
npx ai-visual-skills install -s seedance-director --all
```

### 方式三：克隆仓库后跑脚本

```bash
git clone https://github.com/<你的GitHub用户名>/ai-visual-skills.git
cd ai-visual-skills

# Node（零依赖）
node bin/cli.js install -s seedance-director --all

# 或 Python 3.7+（零依赖，无需 Node）
python scripts/install.py --skill seedance-director --all
```

### 方式四：手动复制

把本文件夹整个复制到目标 agent 的 skills 目录即可，唯一要求是**文件夹内必须有 `SKILL.md`**：

```bash
cp -r seedance-director ~/.claude/skills/
```

安装后**重启对应工具**才会加载新技能。

---

## 二、各工具目录对照

| 工具 | 用户级（全局） | 项目级 |
| --- | --- | --- |
| Claude Code | `~/.claude/skills/` | `.claude/skills/` |
| Codex CLI | `~/.codex/skills/` | `.agents/skills/` |
| Cursor | `~/.cursor/skills/` | `.agents/skills/` |
| Qoder | `~/.qoder/skills/` | `.qoder/skills/` |
| WorkBuddy | `~/.workbuddy-ai/skills/` | `.workbuddy-ai/skills/` |
| GitHub Copilot | `~/.copilot/skills/` | `.agents/skills/` |
| Gemini CLI | `~/.gemini/skills/` | `.agents/skills/` |
| Windsurf | `~/.codeium/windsurf/skills/` | `.windsurf/skills/` |

> Windows 上 `~` 即 `C:\Users\<用户名>`。软链接需要开启开发者模式，脚本会自动降级为复制。

---

## 三、手动复制的完整路径

```bash
# Claude Code
cp -r seedance-director ~/.claude/skills/

# Cursor
cp -r seedance-director ~/.cursor/skills/

# Qoder
cp -r seedance-director ~/.qoder/skills/

# WorkBuddy
cp -r seedance-director ~/.workbuddy-ai/skills/
```

Windows PowerShell：

```powershell
Copy-Item -Recurse -Force .\seedance-director "$env:USERPROFILE\.claude\skills\"
```

---

## 四、怎么用

安装后**不需要记命令**，直接说需求就会自动触发：

```
帮我把"外卖骑手暴雨夜送最后一单"做成 30 秒视频提示词
```

```
用 Seedance 做一条 30 秒的香水广告分镜，产品是木质调男香
```

```
把这张图里的女孩做成一段 30 秒的悬疑短片分镜
```

手动触发（支持 `/` 命令的工具）：

```
/seedance-director 帮我做一条赛博朋克风格的 30 秒短片提示词
```

### 输出长什么样

固定四个区块：人物设定、场景设定、完整视频提示词（含逐镜分镜）、负面约束。

完整范例见 `references/examples.md`。

---

## 五、目录结构

```
seedance-director/
├── SKILL.md                              主入口：工作流 + 硬性约束 + 输出契约
├── README.md                             本文件
└── references/
    ├── structure.md                      五幕结构 + 30 秒时间轴
    ├── shot-language.md                  七维分镜系统（景别/角度/构图/光影/色彩/动势/转场）
    ├── consistency.md                    人物与场景一致性锁定
    ├── physics-microexpression.md        动作物理链 + 微表情转译 + 导演修正
    ├── sound-style-safety.md             声音设计 + 风格匹配 + 安全脱敏
    ├── output-format.md                  输出格式规范 + 负面约束
    ├── examples.md                       完整成品范例
    └── full-prompt.md                    单段式提示词（给只吃 system prompt 的工具）
```

**渐进式披露**：`SKILL.md` 只放工作流和硬性规则，细节按需读 `references/`。这样不会一次性占满上下文。

---

## 六、给不支持 Skills 的工具用

有些地方没有 Skills 机制——网页版大模型、自定义 GPT、即梦/Seedance 对话框。这些场合用 `references/full-prompt.md`：从代码块里整段复制，粘贴到 system prompt 或角色设定里即可，功能等价。

---

## 七、自定义

| 想改什么 | 改哪里 |
| --- | --- |
| 片头片尾署名（默认 ERIC LIANG） | `SKILL.md` 的「硬性约束」段 |
| 默认时长 / 比例 / 分辨率 | `SKILL.md` 的「默认参数」 |
| 负面约束词串 | `references/output-format.md` 区块四 |
| 各题材追加的负面词 | `references/output-format.md` 的题材表 |
| 分镜七维的选项与用途 | `references/shot-language.md` |

改完若用 `--link` 方式安装，所有工具立即生效；用复制方式则需重跑一次安装命令。
