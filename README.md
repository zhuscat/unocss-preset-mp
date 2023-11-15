# unocss-preset-mp

基于 `@unocss/preset-mini` 改写的，适用于小程序的预设

1. 与 [unocss-preset-weapp](https://github.com/MellowCo/unocss-preset-weapp) 不同，这个预设期望所有规则不会有微信小程序中不允许的特殊字符，这样我们就不需要去 transform 项目中的类名
2. 这个预设尽量是作为 `@unocss/preset-mini` 的子集，对于 alias，因为小程序体积限制较多，尽量只保留短的那一个

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


## 例子

不兼容：

`aspect-1/1` -> `aspect-1-1`