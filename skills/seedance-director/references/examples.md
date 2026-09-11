# 成品范例

用这个范例校准输出质量。注意每一镜如何逐字复用锁定块、如何写物理反馈、如何转译情绪。

**用户输入**：*一个女孩在暴雨夜送最后一单外卖*

---

## 【人物设定｜雨夜最后一单】

林晚，女，27 岁，鹅蛋脸，下颌线清晰，丹凤眼，鼻梁挺直，唇形偏薄，暖调象牙肤色。黑发齐肩扎低马尾，被雨水打湿贴在两颊。身高约 168cm，体态偏瘦，肩膀习惯性微含。穿深墨绿色防水风衣，内搭米白高领针织，深色直筒裤，黑色短靴。左手腕一只细银色手表。气质警觉、疲惫但不服输，习惯用拇指摩挲表盘。与收件人素未谋面，只通过电话联系过三次。

**英文锁定块**（逐镜原样复制）：
```
a 27-year-old Chinese woman, oval face with a defined jawline, phoenix eyes, straight nose bridge, thin lips, warm ivory skin tone; shoulder-length black hair in a low ponytail, strands stuck wet to both cheeks; about 168cm, slim build, shoulders habitually slightly rounded; dark forest-green waterproof trench coat, cream ribbed turtleneck, dark straight-leg trousers, black ankle boots; a slim silver watch on her left wrist
```

---

## 【场景设定｜雨夜最后一单】

地点：中国南方某城市老旧居民楼之间的窄巷。时代：当代。环境：暴雨夜，积水没过脚踝，路面湿滑反光。建筑：六层无电梯居民楼，外墙瓷砖剥落，防盗窗生锈，楼道声控灯忽明忽暗。天气：强降雨，偶有闪电。材质：湿水泥、锈铁、积水、塑料雨棚。光线：唯一光源是巷口一盏昏黄路灯，在积水上拉出长长的倒影；闪电提供短暂冷白侧光。色彩：冷蓝灰基调，路灯与窗户透出的暖橙作为对比点（Teal & Orange）。

**英文锁定块**：
```
a narrow alley between six-storey walk-up apartment blocks in a southern Chinese city at night, ankle-deep floodwater on cracked wet concrete, peeling wall tiles, rusted security grilles, a flickering voice-activated hallway light, heavy rain with occasional lightning, one dim amber street lamp at the alley mouth casting a long reflection on the water, cold blue-grey base grade with warm amber accents
```

---

## 【完整视频提示词｜雨夜最后一单】

### ── 基础参数 ──
```
Duration: 30s | Aspect: 9:16 vertical | Resolution: 8K Ultra HD
Style: Hollywood cinematic realism, shot on a real cinema camera
Lenses: 35mm / 50mm / 85mm | Shallow DOF, real bokeh, real motion blur
```

### ── 片头 (0–2s) ──
黑场。文字轻微淡入：`A Film by ERIC LIANG`。白色，极简，非水印感。

### ── 正片 (2–28s) ──

**Shot 1 ｜ 2–7s ｜ 视觉钩子**
- 景别：超远景 Extreme Wide Shot
- 角度：高角度 High Angle Shot
- 构图：三分构图，人物压在左下交叉点；右侧大片留白是积水倒影
- 运镜：缓慢 Dolly In
- 焦段：35mm ｜ 中等景深
- 光影：巷口暖橙路灯作主光，雨幕被逆光打亮成一片光雾
- 色彩：冷蓝灰基底 + 暖橙点光
- 动作：林晚从画面右侧走入，每一步踩碎水面倒影
- 物理：水花向外溅开并落回，风衣下摆因惯性滞后半拍
- 声音：厚重雨声底噪、涉水脚步声、远处闷雷
- Prompt：
```
extreme wide shot, high angle, of a 27-year-old Chinese woman in a dark forest-green waterproof trench coat crossing an ankle-deep flooded alley at night, each step shattering the reflection of a single amber street lamp, slow dolly in, 35mm lens, medium depth of field, warm amber backlight turning the rain into glowing haze, cold blue-grey grade with warm amber accents, rain splashes outward and falls back, coat hem swinging with a slight lag, heavy rain ambience, footsteps in standing water, distant thunder
```

**Shot 2 ｜ 7–14s ｜ 故事展开**
- 景别：中景 Medium Shot
- 角度：平视 Eye Level
- 构图：中心构图，人物居中偏左，前景是锈蚀防盗窗的框架
- 运镜：手持跟拍，轻微晃动
- 焦段：50mm ｜ 浅景深
- 光影：侧光，闪电提供一次冷白补光
- 色彩：维持冷蓝灰
- 动作：她抬头看六楼唯一亮着的窗，拇指摩挲表盘，再低头看手机屏幕上"最后一单"四个字
- 物理：雨滴打在屏幕上形成水痕并被手指抹开；抬头时马尾甩动滞后
- 声音：雨声压低，加入她急促的呼吸声、手机提示音
- 连续性：风衣已湿透，颜色变深贴身（继承 Shot 1 的淋雨状态）
- Prompt：
```
medium shot, eye level, of a 27-year-old Chinese woman with shoulder-length black hair in a low ponytail, strands stuck wet to both cheeks, dark forest-green waterproof trench coat soaked and clinging, cream ribbed turtleneck, standing in a flooded alley, she looks up at the only lit window on the sixth floor, her thumb rubbing the face of the slim silver watch on her left wrist, then looks down at her phone, handheld tracking camera with slight shake, 50mm lens, shallow depth of field, side lighting with a brief cold-white flash of lightning, cold blue-grey grade, raindrops form streaks on the phone screen and she wipes them away, ponytail lags behind her head movement, continuity: her coat is still soaked and darkened from the previous shot
```

**Shot 3 ｜ 14–21s ｜ 冲突升级**
- 景别：全景 → 近景 Full Body → Medium Close-up
- 角度：低角度 Low Angle（爬楼时仰视，压迫感）
- 构图：引导线，楼梯扶手形成上升的斜线
- 运镜：镜头随她上升，轻微 Dolly In
- 焦段：35mm 转 50mm
- 光影：声控灯忽明忽暗，硬光切割楼梯
- 色彩：加入楼道绿灰色调
- 动作：她抱着保温箱爬楼，到四楼声控灯灭了，她跺脚，灯亮，继续上
- 物理：保温箱有明确重量，她右肩下沉、步伐变慢、呼吸变重；跺脚时积水从鞋面飞出
- 声音：楼梯回声、湿鞋摩擦水泥、急促呼吸、声控灯的"咔哒"开关声
- 连续性：全身湿透，保温箱外壁有水痕
- Prompt：
```
full body shot to medium close-up, low angle, of a 27-year-old Chinese woman in a soaked dark forest-green trench coat climbing a narrow apartment stairwell, carrying a heavy insulated delivery box that visibly pulls her right shoulder down, staircase handrail forming a strong leading line, camera rises with her and dollies in slightly, 35mm to 50mm lens, shallow depth of field, the flickering voice-activated hallway light cutting hard shadows across the steps, cold blue-grey with greenish hallway cast, the light dies on the fourth floor, she stomps once, water sprays off her boot, the light clicks back on, she keeps climbing, footsteps in wet shoes, stairwell echo, breath growing heavier, continuity: she and the insulated box are still soaked from the previous shot
```

**Shot 4 ｜ 21–26s ｜ 高潮**
- 景别：特写 → 大特写 Close-up → Extreme Close-up
- 角度：平视转轻微荷兰角
- 构图：中心构图
- 运镜：极缓 Dolly In，最后定格
- 焦段：85mm ｜ 极浅景深
- 光影：门缝里透出的暖光打在她脸上，形成一道光刃；背景完全沉入黑暗
- 色彩：冷调中唯一的暖光源——冷暖对比达到峰值
- 动作：她敲门。门开。里面是空房间，地上散落着没拆的纸箱。她低头看手机，屏幕显示"已送达"。她手指悬在"确认"上方，停住。
- 物理：门被推开的惯性带动气流，她额前湿发轻晃；手指悬停时有极细微的颤动
- 声音：音乐在 21 秒进入并达到最强，敲门声在空房间里产生长混响，27 秒音乐骤停
- 连续性：保温箱仍在她手上，湿透状态保持
- 微表情：呼吸变浅，喉结移动一次（吞咽），视线从空房间缓慢移到手机屏幕，眼眶微微发热但不落泪
- Prompt：
```
close-up to extreme close-up, eye level drifting to a slight dutch angle, of a 27-year-old Chinese woman with wet black hair stuck to her cheeks, warm ivory skin, soaked dark forest-green trench coat, standing at a doorway in a dark hallway, she knocks, the door opens onto an empty room with unopened cardboard boxes scattered on the floor, warm light spilling from the doorway cuts a single blade of light across her face while the background sinks into near-black, she looks down at her phone showing "delivered", her thumb hovers above the confirm button and stops, extremely slow dolly in that settles and holds, 85mm lens, very shallow depth of field, sharp focus on her eyes, cold blue-grey grade broken by the single warm doorway source, airflow from the opening door stirs the wet strands on her forehead, her thumb trembles almost imperceptibly, breathing grows shallow, one visible swallow, gaze moving slowly from the empty room to the phone screen, music swells to its peak then cuts hard, long reverb on the knock, continuity: the insulated box is still in her hand, she is still soaked
```

**Shot 5 ｜ 26–28s ｜ 结果 / 反转**
- 景别：远景 Wide Shot
- 角度：高角度
- 构图：大量留白，人物缩成小小一个
- 运镜：缓慢 Dolly Out
- 焦段：35mm
- 光影：只剩巷口那盏路灯
- 色彩：回到冷蓝灰，暖橙只剩一点
- 动作：她转身下楼，手机屏幕的光映在她脸上。她没有按确认。
- 物理：转身时风衣下摆划出一道弧线并甩出水珠
- 声音：雨声重新成为主音，脚步声远去
- Prompt：
```
wide shot, high angle, of a 27-year-old Chinese woman in a soaked dark forest-green trench coat turning and walking back down the alley, her figure small against a large negative space, slow dolly out, 35mm lens, only the single dim amber street lamp remaining as a light source, cold blue-grey grade with a faint warm accent, the glow of her phone screen on her face, the trench coat hem arcs and flicks off water droplets as she turns, rain becomes the dominant sound again, footsteps receding, continuity: still soaked, still carrying the insulated box
```

### ── 片尾 (28–30s) ──
黑场。文字轻微淡入：`Directed by ERIC LIANG`。简洁、高级、不影响观看。

### ── 声音设计 ──
- **环境音**：厚重雨声为主层，远处城市底噪为次层
- **动作音**：涉水脚步、湿鞋摩擦水泥、楼梯回声、敲门的长混响、声控灯开关声
- **空间感**：窄巷几乎无混响；楼道中短混响；空房间长混响
- **音乐**：14 秒低频持续音进入，21 秒达到最强，27 秒骤停留白
- **对白**：无

### ── 连续性锚点 ──
- **人物锁定**：`a 27-year-old Chinese woman, oval face with a defined jawline, phoenix eyes, straight nose bridge, thin lips, warm ivory skin tone; shoulder-length black hair in a low ponytail, strands stuck wet to both cheeks; about 168cm, slim build; dark forest-green waterproof trench coat, cream ribbed turtleneck, dark straight-leg trousers, black ankle boots; a slim silver watch on her left wrist`
- **场景锁定**：`a narrow alley between six-storey walk-up apartment blocks in a southern Chinese city at night, ankle-deep floodwater, peeling wall tiles, rusted security grilles, heavy rain with occasional lightning, one dim amber street lamp at the alley mouth`
- **状态继承**：Shot 1 淋雨 → Shot 2/3/4/5 全程湿透且风衣颜色加深；Shot 3 保温箱外壁水痕 → Shot 4/5 保持；Shot 4 门保持敞开状态至镜头结束

---

## 【负面约束】

```
no AI artifacts, no face distortion, no inconsistent characters, no extra fingers, no unrealistic anatomy, no broken physics, no random scene changes, no floating objects, no cheap CGI look, no plastic texture, no unstable camera movement, no duplicate faces, no morphing features, no changing hairstyle, no changing outfit, no teleporting, no clipping, no rubber limbs, no weightless motion, no shifting architecture, no inconsistent weather, no changing time of day, no on-screen subtitles, no title cards, no logos, no watermarks, no text overlays
```

---

## 这个范例示范了什么

1. **锁定块逐字复用** — 人物和场景的英文块在每一镜里一字不改，只是把变的部分（湿透、位置）接在后面。
2. **情绪不写形容词** — "眼眶微微发热但不落泪""一次可见的吞咽"代替"她很感动"。
3. **物理写了反馈** — 水花落回、下摆滞后、右肩下沉、甩出水珠。
4. **连续性显式声明** — 每一镜末尾都有 `continuity:` 段。
5. **高潮只给一个** — Shot 4 是唯一的最高点，前面四镜全在铺垫。
6. **反转靠克制** — 结尾没有解释，只留"她没有按确认"这个动作。
