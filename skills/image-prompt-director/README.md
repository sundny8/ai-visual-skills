# AI 视觉导演 · 图片提示词 · 安装说明

一个跨工具通用的 Agent Skill。写一次，装到 Claude Code / Codex / Cursor / Qoder / WorkBuddy / Copilot / Gemini CLI / Windsurf。

---

## 这是什么

把用户一句话创意，扩展成专业级 AI 图片生成提示词（正向 + 负向）。

产出物是**可直接投喂文生图模型的提示词文本**，不是图片本身。

核心能力：

- 自动判定 8 类图片（剧照 / 海报 / 人像 / 产品 / 历史 / 科幻 / 奇幻 / 纪录片），并套用该类型的默认值
- 主体设计补全（身份、外貌、服装、动作、表情、姿态、材质）
- 场景设计 + 前景/中景/背景三层空间结构
- 构图与摄影机镜头匹配（含"禁止 85mm 拍大场面"这类硬规则）
- 四大主题光影配方（史诗 / 科幻 / 东方 / 恐怖）
- 分层负面提示词库（基础 + 类型 + 特殊场景）

---

## 一、安装

本技能是 [`ai-visual-skills`](../../) 仓库的一部分，推荐用仓库级安装器一次装好全部技能。

### 方式一：skills CLI（推荐）

```bash
npx skills add <sundny8>/ai-visual-skills -s image-prompt-director -g -y
```

### 方式二：npm

```bash
npx ai-visual-skills install -s image-prompt-director --all
```

### 方式三：克隆仓库后跑脚本

```bash
git clone https://github.com/<sundny8>/ai-visual-skills.git
cd ai-visual-skills

# Node（零依赖）
node bin/cli.js install -s image-prompt-director --all

# 或 Python 3.7+（零依赖，无需 Node）
python scripts/install.py --skill image-prompt-director --all
```

### 方式四：手动复制

把本文件夹整个复制到目标 agent 的 skills 目录即可，唯一要求是**文件夹内必须有 `SKILL.md`**：

```bash
cp -r image-prompt-director ~/.claude/skills/
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

## 三、手动安装（不想跑脚本）

把整个 `image-prompt-director` 文件夹复制到目标目录即可，唯一要求是**文件夹内必须有 `SKILL.md`**：

```bash
cp -r image-prompt-director ~/.claude/skills/
```

Windows PowerShell：

```powershell
Copy-Item -Recurse -Force .\image-prompt-director "$env:USERPROFILE\.claude\skills\"
```

---

## 四、怎么用

安装后**不需要记命令**，直接说需求就会自动触发：

```
帮我把"一个女孩在雨天等人"写成出图提示词
```

```
给我一条木质调男士香水的产品广告提示词
```

```
做一张赛博朋克风格的竖版海报提示词，主体是一个孤独的人
```

手动触发（支持 `/` 命令的工具）：

```
/image-prompt-director 写一个古代战场的电影剧照提示词
```

### 输出长什么样

固定两个区块：`【图片生成提示词】` 和 `【负面提示词】`。只有这两块，没有解释性文字。

完整范例见 `references/examples.md`（人像 / 产品 / 科幻海报三例）。

---

## 五、目录结构

```
image-prompt-director/
├── SKILL.md                              主入口：工作流 + 硬性约束 + 输出契约
├── README.md                             本文件
└── references/
    ├── image-types.md                    8 类图片的差异化策略
    ├── subject-and-scene.md              主体设计补全 + 场景三层结构
    ├── composition-and-camera.md         构图选择 + 摄影机/镜头/景深/画幅
    ├── lighting-and-mood.md              四大主题光影配方 + 色彩分级
    ├── quality-and-negative.md           画质词库 + 分层负面词库
    ├── output-format.md                  输出格式规范
    ├── examples.md                       三个完整成品范例
    └── full-prompt.md                    单段式提示词（给只吃 system prompt 的工具）
```

**渐进式披露**：`SKILL.md` 只放工作流和硬性规则，细节按需读 `references/`。

---

## 六、给不支持 Skills 的工具用

有些地方没有 Skills 机制——网页版大模型、自定义 GPT。这些场合用 `references/full-prompt.md`：从代码块里整段复制，粘贴到 system prompt 或角色设定里即可，功能等价。

---

## 七、自定义

| 想改什么 | 改哪里 |
| --- | --- |
| 默认画质词 | `references/quality-and-negative.md` 第一节 |
| 基础负面词 | `references/quality-and-negative.md` 第二节 |
| 各类型默认画幅/镜头/光影 | `references/image-types.md` |
| 四大主题光影配方 | `references/lighting-and-mood.md` |
| 镜头与构图的匹配规则 | `references/composition-and-camera.md` |

改完若用 `--link` 方式安装，所有工具立即生效；用复制方式则需重跑一次安装命令。

---

## 八、与其他技能的关系

本技能只负责**生成提示词**，不负责出图。如果你还需要视频方向的能力，可以搭配 [`seedance-director`](../seedance-director/)（30 秒电影级视频提示词）一起使用——两者在同一个仓库里，用同一条命令就能一起装上。
