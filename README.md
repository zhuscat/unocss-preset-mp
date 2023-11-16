# unocss-preset-mp

👷

基于 `@unocss/preset-mini` 改写的，适用于小程序的预设

1. 与 [unocss-preset-weapp](https://github.com/MellowCo/unocss-preset-weapp) 不同，这个预设期望所有规则不会有微信小程序中不允许的特殊字符，这样我们就不需要去 transform 项目中的类名
2. 这个预设尽量是作为 `@unocss/preset-mini` 的子集，尽量不做不兼容的更改，对于 alias，因为小程序体积限制较多，尽量只保留短的那一个

## 起步

```ts
import { defineConfig } from 'unocss'
import presetMp from 'unocss-preset-echo'

export default defineConfig({
  presets: [
    presetMp(),
  ],
  // 一定加上这个
  separators: ['-'],
})
```

## 移除

移除了如下的一些写法

透明度简写，`c-black/100`，可以用 `c-black c-op-100` 代替

`#` 开头的颜色写法：`c-#fff` (可以使用 `c-hex-fff` 代替)

一些比较常用的原子 CSS，只保留短名：`(border|b)-xxx`、`(opacity|op)-xxx`、`(leading|ln)-xxx`、font weight、`(rounded|rd)-xxx` 只保留 `b`、`op`、`ln`、`fw`、`rd` 写法

尽量用 `-` 做一个分割，去掉了 `w1`、`h100` 这样的写法

移除了 bracket 的写法，比如：`c-[rgb(255,255,255)]`、`w-[calc(100vh-8px)]`

## 不兼容

所有使用分数的地方，如：

`aspect-3/4` -> `aspect-3to4`

`w-1/2` -> `w-1to2`

使用百分号的地方，如：

`w-50%` -> `w-50pct`

## 新增

safearea 相关：

`h-screen-safe`

`p-[trbl]-safe-{size}`

具体可以在 interactive docs 里看
