# 画质词库 & 负面提示词库

---

# 一、默认画质词（每次必加）

```
8K UHD, Ultra realistic, Photorealistic, Cinematic lighting, Highly detailed,
Realistic texture, Natural skin, Professional photography
```

这八个词是基线，直接追加到正向提示词末尾。

## 进阶画质词（按需叠加）

| 类别 | 词 |
| --- | --- |
| 解析力 | hyper-detailed, intricate detail, micro-texture visible, tack sharp |
| 真实感 | shot on real camera, photographic realism, physically accurate lighting |
| 材质 | visible fabric weave, brushed metal, subsurface scattering on skin, wet surface reflections |
| 光学 | real bokeh, natural lens falloff, subtle chromatic aberration, anamorphic flare |
| 胶片 | subtle film grain, Kodak Portra color science, halation on highlights |
| 质感 | matte finish, glossy finish, weathered patina, raw concrete texture |

## 禁用词（对模型无信息量，只会稀释有效描述）

```
beautiful, amazing, stunning, gorgeous, epic, masterpiece, best quality,
award winning, ultra beautiful, very very detailed, 8k 8k 8k
```

**理由**：这些词不描述任何可拍摄的特征。把字数留给具体的材质、光位、动作。

---

# 二、负面提示词

## 基础负面词（每次必加）

```
low quality, blurry, out of focus, deformed hands, extra fingers, missing fingers,
fused fingers, malformed limbs, wrong anatomy, bad proportions, plastic skin,
over-smoothed skin, airbrushed, AI artifacts, uncanny face, asymmetrical eyes,
flat lighting, unrealistic shadows, oversaturated, watermark, signature, text, logo
```

中文版（给中文模型用）：

```
低质量, 模糊, 失焦, 畸形手脚, 多指, 缺指, 手指粘连, 肢体畸形, 人体结构错误,
比例失调, 塑料感皮肤, 过度磨皮, AI生成痕迹, 恐怖谷脸, 双眼不对称,
平淡光照, 不真实光影, 过饱和, 水印, 签名, 文字, Logo
```

## 按类型追加

| 类型 | 追加负面词 |
| --- | --- |
| 人像摄影 | no plastic skin, no over-smoothing, no dead eyes, no wide-angle distortion, no heavy makeup cakey, no duplicate faces |
| 产品广告 | no cluttered background, no product blur, no blown highlights, no cheap plastic look, no distorted proportions, no fingerprints |
| 电影剧照 | no flat lighting, no evenly lit studio look, no posed stock-photo feel, no empty background |
| 海报 | no cluttered composition, no text, no busy background, no small subject |
| 历史复原 | no modern objects, no modern clothing, no plastic materials, no contemporary fonts, no anachronistic props |
| 科幻概念 | no random mechanical clutter, no nonsensical design, no inconsistent scale, no unmotivated light sources |
| 奇幻艺术 | no mismatched anatomy, no inconsistent creature design, no clashing color palettes, no floating disconnected elements |
| 纪录片摄影 | no studio lighting, no posed models, no heavy post-processing, no artificial perfection |
| 建筑/场景为主 | no warped perspective, no converging verticals, no shifted geometry, no impossible architecture |
| 含人物手部 | no extra fingers, no fused fingers, no claw hands, no hidden hands behind back, no six fingers |

## 特殊场景负面词

| 场景 | 追加 |
| --- | --- |
| 多人同框 | no duplicate faces, no identical twins, no merged bodies, no extra people |
| 动物/生物 | no extra legs, no malformed paws, no two heads, no impossible anatomy |
| 含文字招牌 | no garbled text, no nonsensical letters, no unreadable signage |
| 食物 | no inedible appearance, no plastic food, no unnatural colors |
| 车辆/机械 | no melted parts, no extra wheels, no asymmetric design, no floating components |

---

# 三、负面词的写法原则

1. **只写你要排除的东西**，不要写否定式描述主体的话（例如不要写 `not a man`——模型会读到 "man"）。
2. **优先排除高频失败项**：手、眼睛、解剖、文字、水印。这五类占翻车案例的绝大多数。
3. **不要堆砌上百个负面词**。超过 40 个会开始互相干扰，效果反而变差。基础词 + 类型词 + 特殊场景词，通常 30–40 个足够。
4. **负面词和正向词不要冲突**。正向写了 `shallow depth of field`，负面就别写 `blurry background`——虚化背景不是模糊。
