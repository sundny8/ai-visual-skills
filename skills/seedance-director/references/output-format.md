# 最终输出格式

每次只输出四个区块。标题格式固定，不要增删。

---

## 区块一

```
【人物设定｜<主题>】
```

逐个人物写，包含：外貌、年龄、服装、气质、动作特点、人物关系。

写法要求：**这一段就是后面要逐字复用的锁定表**，所以字段要具体到可以肉眼分辨。

```markdown
【人物设定｜雨夜快递】

林晚，女，27 岁，鹅蛋脸，下颌线清晰，丹凤眼，鼻梁挺直，唇形偏薄。
暖调象牙肤色。黑发，齐肩，扎低马尾，发丝因淋雨贴在两颊。
身高约 168cm，体态偏瘦，肩膀习惯性微含。
穿着深墨绿色防水风衣，内搭米白高领针织，深色直筒裤，黑色短靴。
左手腕戴一只细银色手表。
气质：警觉，疲惫但不服输。习惯性用拇指摩挲表盘。
人物关系：与收件人素未谋面，仅通过电话联系过三次。
```

---

## 区块二

```
【场景设定｜<主题>】
```

包含：地点、时代、环境、建筑、天气、材质、光线、色彩。

```markdown
【场景设定｜雨夜快递】

地点：老旧居民楼之间的窄巷，中国南方城市。
时代：当代。
环境：暴雨夜，积水没过脚踝，路面湿滑反光。
建筑：六层无电梯居民楼，外墙瓷砖剥落，防盗窗生锈，楼道声控灯忽明忽暗。
天气：强降雨，偶有闪电。
材质：湿水泥、锈铁、积水、塑料雨棚。
光线：唯一光源是巷口一盏昏黄路灯，在积水上形成长长的倒影；闪电提供短暂冷白侧光。
色彩：整体冷蓝灰基调，路灯与窗户透出的暖橙作为对比点（Teal & Orange）。
```

---

## 区块三

```
【完整视频提示词｜<主题>】
```

这是核心产出。必须包含全部要素，缺一不可：

- [ ] 基础参数（时长、比例、分辨率、画质）
- [ ] 电影风格
- [ ] 人物（锁定表原文）
- [ ] 场景（锁定表原文）
- [ ] 故事结构
- [ ] 30 秒时间轴
- [ ] 分镜设计（逐镜）
- [ ] 景别
- [ ] 摄影角度
- [ ] 构图
- [ ] 运镜
- [ ] 焦段
- [ ] 景深
- [ ] 光影
- [ ] 色彩
- [ ] 动作
- [ ] 物理逻辑
- [ ] 声音
- [ ] 连续性
- [ ] 负面约束

### 推荐排版

```markdown
【完整视频提示词｜雨夜快递】

── 基础参数 ──
Duration: 30s | Aspect: 9:16 vertical | Resolution: 8K Ultra HD
Style: Hollywood cinematic realism, shot on real cinema camera
Lenses: 35mm / 50mm / 85mm

── 片头 (0–2s) ──
Black frame. Text fades in: "A Film by ERIC LIANG".
White, minimal, slight fade-in, non-watermark feel.

── 正片 (2–28s) ──

Shot 1 | 0–5s | 视觉钩子
Scale: Extreme Wide Shot
Angle: High Angle Shot
Composition: Rule of Thirds, subject on lower-left third
Camera: slow Dolly In
Lens: 35mm | Deep-ish DOF
Lighting: single warm street lamp as key, hard rim from behind
Color: cold blue-grey base, warm amber accent
Action: 林晚 crosses the flooded alley, each step sending up spray...
Physics: water splashes outward and falls back; coat hem swings with a slight lag
Sound: heavy rain bed, footsteps in standing water, distant thunder
Continuity: —
Prompt: ...

Shot 2 | 5–12s | 故事展开
...

── 片尾 (28–30s) ──
Black frame. Text fades in: "Directed by ERIC LIANG". Clean, minimal.

── 声音设计 ──
Ambient: ...
Foley: ...
Space: ...
Music: enters at 12s, peaks at 20–27s, cuts hard at 27s.

── 连续性锚点 ──
Character lock: <逐字复用的英文人物块>
Scene lock: <逐字复用的英文场景块>
State inheritance: ...
```

### 逐镜描述必须写成英文 Prompt

分镜表的字段（景别、角度等）可以用中文标注便于阅读，但**每一镜最终投喂给模型的 prompt 段落必须是英文**——Seedance 等视频模型对英文提示词的响应更稳定。

英文 prompt 每镜一段，结构固定：

```
[shot scale] of [locked character block] in [locked scene block], [action with cause and feedback], [camera movement], [lens and DOF], [lighting], [color], [continuity note]
```

---

## 区块四

```
【负面约束】
```

**默认全量附加以下英文负面词串**（逐字复制，不要改写）：

```
no AI artifacts, no face distortion, no inconsistent characters, no extra fingers, no unrealistic anatomy, no broken physics, no random scene changes, no floating objects, no cheap CGI look, no plastic texture, no unstable camera movement
```

按题材追加：

| 题材 | 追加负面词 |
| --- | --- |
| 人物为主 | no duplicate faces, no morphing features, no changing hairstyle, no changing outfit |
| 动作戏 | no teleporting, no clipping, no rubber limbs, no weightless motion |
| 场景为主 | no shifting architecture, no inconsistent weather, no changing time of day |
| 有道具 | no melting objects, no shape-shifting props, no disappearing items |
| 有文字 | no on-screen subtitles, no title cards, no logos, no watermarks, no text overlays |

---

## 输出纪律

- **四个区块都要有**，缺一个就是不合格输出。
- **不要输出创作过程**。不要写"我为你设计了……"这类说明，直接给成品。
- **不要输出多套方案**，除非用户明确要求。一次给一个最好的。
- **时间轴秒数必须加总等于总时长**，写完后自己验算一遍。
- 用户要求修改时，只改动被指出的部分，其余锁定表逐字保留。
