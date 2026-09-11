# AI Visual Skills

跨工具通用的 **Agent Skills** 集合——把一句话创意变成专业级 AI 图片提示词和 30 秒电影级视频提示词。

写一次，Claude Code / Codex / Cursor / Qoder / WorkBuddy / GitHub Copilot / Gemini CLI / Windsurf 都能用。

---

## 包含的技能

| 技能 | 作用 | 产出 |
| --- | --- | --- |
| [`image-prompt-director`](skills/image-prompt-director/) | AI 视觉导演 · 图片提示词 | 一句话 → 图片生成提示词 + 负面提示词 |
| [`seedance-director`](skills/seedance-director/) | Seedance 2.5 电影导演 | 一句话 → 30 秒电影级视频提示词 + 逐镜分镜 |

两个技能都**只生成提示词文本**，不生成图片或视频。拿到提示词后投喂给你常用的模型即可。

---

## 安装

三种方式，任选其一。

### 方式一：skills CLI（推荐）

```bash
npx skills add <你的GitHub用户名>/ai-visual-skills
```

交互式选择要装的技能和目标 agent。非交互式：

```bash
# 全部技能装到全部 agent（用户级全局）
npx skills add <你的GitHub用户名>/ai-visual-skills --all -g -y

# 只装指定技能到指定 agent
npx skills add <你的GitHub用户名>/ai-visual-skills \
  -s image-prompt-director -a claude-code -a cursor -g -y

# 先看看仓库里有什么
npx skills add <你的GitHub用户名>/ai-visual-skills --list
```

### 方式二：npm

```bash
# 直接运行，不安装
npx ai-visual-skills install --all

# 或全局安装后使用
npm install -g ai-visual-skills
ai-visual-skills install --all
```

本包**自包含、无需联网**，内置技能文件直接复制到目标目录。

```bash
ai-visual-skills list                      # 查看内置技能与本机 agent
ai-visual-skills install -a claude-code,cursor,qoder
ai-visual-skills install -s seedance-director -a cursor
ai-visual-skills install -p --to ./my-project   # 装到指定目录
ai-visual-skills uninstall --all
```

### 方式三：克隆仓库

```bash
git clone https://github.com/<你的GitHub用户名>/ai-visual-skills.git
cd ai-visual-skills
python scripts/install.py --all
```

`scripts/install.py` 是零依赖的 Python 安装器（Python 3.7+），不需要 Node。

### 装到哪了

| Agent | 用户级（全局） | 项目级 |
| --- | --- | --- |
| Claude Code | `~/.claude/skills/` | `.claude/skills/` |
| Codex CLI | `~/.codex/skills/` | `.agents/skills/` |
| Cursor | `~/.cursor/skills/` | `.agents/skills/` |
| Qoder | `~/.qoder/skills/` | `.qoder/skills/` |
| WorkBuddy | `~/.workbuddy-ai/skills/` | `.workbuddy-ai/skills/` |
| GitHub Copilot | `~/.copilot/skills/` | `.agents/skills/` |
| Gemini CLI | `~/.gemini/skills/` | `.agents/skills/` |
| Windsurf | `~/.codeium/windsurf/skills/` | `.windsurf/skills/` |

Windows 上 `~` 即 `C:\Users\<用户名>`。安装后**重启对应工具**才会加载新技能。

---

## 使用

装好后不用记命令，直接说需求就会自动触发。

### 图片提示词

```
帮我把"一个女孩在雨天等人"写成出图提示词
```

```
给我一条木质调男士香水的产品广告提示词
```

```
做一张赛博朋克风格的竖版海报提示词，主体是一个孤独的人
```

输出：

```
【图片生成提示词】
editorial portrait photography, ... a 24-year-old East Asian woman with an oval face ...

【负面提示词】
low quality, blurry, out of focus, deformed hands, extra fingers, ...
```

技能会自动判定图片类型（剧照 / 海报 / 人像 / 产品 / 历史 / 科幻 / 奇幻 / 纪录片），并套用该类型的画幅、镜头、光影默认值。

### 视频提示词

```
帮我把"外卖骑手暴雨夜送最后一单"做成 30 秒视频提示词
```

```
用 Seedance 做一条 30 秒的香水广告分镜，产品是木质调男香
```

输出固定四个区块：人物设定、场景设定、完整视频提示词（含五幕结构 + 逐镜分镜 + 声音设计）、负面约束。

---

## 仓库结构

```
ai-visual-skills/
├── package.json                npm 包定义（bin: ai-visual-skills）
├── bin/cli.js                  Node CLI 安装器（零依赖）
├── scripts/
│   ├── install.py              Python 安装器（零依赖，Node 的替代方案）
│   └── validate.js             技能规范校验（CI 也跑这个）
├── skills/
│   ├── image-prompt-director/
│   │   ├── SKILL.md            主入口：工作流 + 硬性约束 + 输出契约
│   │   ├── README.md
│   │   └── references/         8 个参考文件，按需加载
│   └── seedance-director/
│       ├── SKILL.md
│       ├── README.md
│       └── references/         8 个参考文件
└── .github/workflows/validate.yml
```

### 设计原则

**渐进式披露。** `SKILL.md` 只放工作流、硬性约束和输出契约，控制在 5k 词以内；细节按主题拆进 `references/`，模型需要时才读。这样不会一上来就吃满上下文。

**工具无关。** 不写任何单一 agent 的专有语法，脚本只用标准库。所以同一份内容换个工具照样能用。

**双安装器。** Node CLI 给 npm 用户，Python 脚本给没装 Node 的人。两者行为一致。

---

## 兼容性说明

Skills 遵循共享的 Agent Skills 规范（`SKILL.md` + YAML frontmatter 的 `name` / `description`），主流工具通用。

不同 agent 的特性支持有差异：

| 特性 | Claude Code | Cline | 其他 |
| --- | --- | --- | --- |
| 基础技能 | ✅ | ✅ | ✅ |
| `allowed-tools` | ✅ | ✅ | 多数支持 |
| `context: fork` | ✅ | ❌ | ❌ |

本仓库的技能**只依赖基础技能能力**，不绑定任何高级特性，因此在所有支持 Skills 的工具里行为一致。

### 不支持 Skills 的工具

网页版大模型、自定义 GPT、即梦对话框等没有 Skills 机制。这些场合用各技能下的 `references/full-prompt.md`：整段复制粘贴到 system prompt 或角色设定里，功能等价。

---

## 新增一个技能

1. 在 `skills/` 下建目录：

```bash
mkdir -p skills/my-skill/references
```

2. 写 `SKILL.md`，frontmatter 必须有 `name` 和 `description`：

```markdown
---
name: my-skill
description: 这个技能做什么，以及什么时候该用它。写清触发场景，否则模型不会调用。
---

# My Skill

## 用途
## 何时启用
## 工作流
## 参考文件路由
## 硬性约束
## 输出契约
```

3. 跑校验：

```bash
npm test          # 等价于 node scripts/validate.js
```

校验会检查 frontmatter 完整性、`name` 与目录名是否一致、`references/` 引用是否都存在、有没有混入 `_test` / `__pycache__` 之类的垃圾。

4. 提交。CI 会自动跑同一个校验。

---

## 发布到 npm

```bash
# 先把 package.json 里的 repository / homepage / bugs 改成你的仓库地址
npm login
npm publish --access public
```

`prepublishOnly` 钩子会在发布前自动跑校验，不通过就发布不了。

---

## License

[MIT](LICENSE)
