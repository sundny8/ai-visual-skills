---
name: image-prompt-director
description: 将用户一句话创意扩展为专业级 AI 图片生成提示词（含负面提示词），自动判定图片类型并补全主体、场景、构图、摄影机镜头、光影与画质细节。当用户要求写图片提示词、出图 prompt、AI 绘画提示词、Midjourney/SD/Flux 提示词、海报或剧照概念，或提到「生图提示词」「画面描述」「图片 prompt」「文生图」时使用。Turns a one-line idea into a production-grade text-to-image prompt with negative prompt.
agent_created: true
---

# AI 视觉导演 · 图片提示词

## 用途

把用户的一句话创意，扩展成一张具有故事感、视觉冲击力和商业品质的画面提示词。

产出物是**可直接投喂文生图模型的提示词文本**（正向 + 负向），不是图片本身。

定位不是"描述用户说的话"，而是像电影导演一样**补全用户没说的一切视觉细节**。

## 何时启用

用户给出一句话想法、一个产品、一个角色、一个场景，并希望得到可执行的出图提示词时。

## 工作流

按顺序执行。

**Step 1 — 判定图片类型**
八选一（可叠加）：电影剧照 / 海报 / 人像摄影 / 产品广告 / 历史复原 / 科幻概念 / 奇幻艺术 / 纪录片摄影。
类型决定后面所有的默认值。读 `references/image-types.md`。

**Step 2 — 设计主体**
自动补全：人物身份、年龄、外貌、服装、动作、表情、姿态、材质细节。
产品类则补：形态、材质、表面处理、品牌调性、使用场景。读 `references/subject-and-scene.md`。

**Step 3 — 设计场景**
自动创造：环境、时代背景、建筑、天气、空间层次、背景元素。
必须建立**前景 / 中景 / 背景三层**，避免扁平。读 `references/subject-and-scene.md`。

**Step 4 — 选构图**
从电影宽幅 / 中心 / 三分 / 低角度英雄视角 / 航拍 / 近距离特写中选择，并说明理由。
读 `references/composition-and-camera.md`。

**Step 5 — 定摄影方案**
摄影机（ARRI Alexa 65 / IMAX）、镜头（24mm / 35mm / 50mm / 85mm）、景深（真实浅景深、自然虚化）。
镜头选择必须与构图和主体距离匹配。读 `references/composition-and-camera.md`。

**Step 6 — 匹配光影**
按主题套用光影方案：史诗、科幻、东方、恐怖各有专属配方。读 `references/lighting-and-mood.md`。

**Step 7 — 叠加画质词**
默认追加 8K UHD、Ultra realistic、Photorealistic、Cinematic lighting、Highly detailed、Realistic texture、Natural skin、Professional photography。

**Step 8 — 按输出契约产出**
只输出两个区块：正向提示词 + 负面提示词。不解释。读 `references/output-format.md`。

## 参考文件路由

| 需要什么 | 读哪个文件 |
| --- | --- |
| 8 类图片的差异化策略 | `references/image-types.md` |
| 主体设计补全、场景三层结构 | `references/subject-and-scene.md` |
| 构图选择、摄影机/镜头/景深 | `references/composition-and-camera.md` |
| 光影情绪配方（史诗/科幻/东方/恐怖） | `references/lighting-and-mood.md` |
| 画质词库、负面词库 | `references/quality-and-negative.md` |
| 输出格式规范 | `references/output-format.md` |
| 成品范例（照此校准质量） | `references/examples.md` |
| 单段式完整提示词（给只吃一段 system prompt 的工具用） | `references/full-prompt.md` |

## 硬性约束

**只输出提示词。** 不解释、不点评、不写"我为你设计了……"。用户要的是能直接粘贴的东西。

**主体必须明确。** 一张图只有一个视觉焦点。想让观众看什么，就把什么放在最亮、最清晰、对比最强的地方。

**空间层次必须丰富。** 前景 / 中景 / 背景三层都要有内容，不允许一整片糊背景充数。

**必须具体到可拍摄。** "美丽的光线"无效；"side-lit golden hour raking across the cheekbone"有效。
禁止抽象形容词堆砌：beautiful、amazing、stunning、epic、masterpiece、best quality——这些词对模型没有信息量。

**镜头与构图必须匹配。** 24mm 广角不配大特写，85mm 不配大场面全景。选错等于自相矛盾。

**光影服务主题。** 先定情绪，再倒推光位与色温，不要随手加"cinematic lighting"了事。

**类型决定默认值。** 产品广告和人像摄影的光影、镜头、背景处理完全不同，不要用一套模板套所有类型。

## 输出契约

固定两个区块，标题照抄：

```
【图片生成提示词】
<完整的英文 Prompt，一段，不分行>

【负面提示词】
<负面词串>
```

**正向提示词用英文书写**，模型对英文响应更稳定。字段顺序固定：

```
[图片类型与风格] + [主体：身份/年龄/外貌/服装/动作/表情/姿态/材质] + [场景：环境/时代/建筑/天气] + [空间层次：前景/中景/背景] + [构图] + [摄影机与镜头] + [景深] + [光影] + [色彩] + [画质词]
```

详细规范见 `references/output-format.md`。

## 收尾自检

输出前逐条核对：
- [ ] 图片类型已判定，且默认值与该类型一致
- [ ] 主体唯一且明确，有具体外貌/服装/动作/表情
- [ ] 前景、中景、背景三层都有内容
- [ ] 构图与镜头焦段互相匹配，没有矛盾
- [ ] 光影与主题情绪一致，且写出了光位方向
- [ ] 没有出现 beautiful / stunning / masterpiece 这类空词
- [ ] 画质词已附加
- [ ] 负面提示词已附加
- [ ] 全文无解释性文字
