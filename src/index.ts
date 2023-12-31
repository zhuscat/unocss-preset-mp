import type { Postprocessor, Preflight, PreflightContext, PresetOptions } from '@unocss/core'
import { definePreset } from '@unocss/core'
import { extractorArbitraryVariants } from '@unocss/extractor-arbitrary-variants'
import { preflights } from './preflights'
import { rules } from './rules'
import type { Theme, ThemeAnimation } from './theme'
import { theme } from './theme'
import { variants } from './variants'
import { shorthands } from './shorthands'

export { preflights } from './preflights'
export { theme, colors } from './theme'
export { parseColor } from './utils'

export type { ThemeAnimation, Theme }

export interface DarkModeSelectors {
  /**
   * Selector for light variant.
   *
   * @default '.light'
   */
  light?: string

  /**
   * Selector for dark variant.
   *
   * @default '.dark'
   */
  dark?: string
}

export interface PresetMpOptions extends PresetOptions {
  /**
   * Dark mode options
   *
   * @default 'class'
   */
  dark?: 'class' | 'media' | DarkModeSelectors
  /**
   * Generate pseudo selector as `[group=""]` instead of `.group`
   *
   * @default false
   */
  attributifyPseudo?: boolean
  /**
   * Prefix for CSS variables.
   *
   * @default 'un-'
   */
  variablePrefix?: string
  /**
   * Utils prefix
   *
   * @default undefined
   */
  prefix?: string | string[]
  /**
   * Generate preflight
   *
   * @default true
   */
  preflight?: boolean

  /**
   * Enable arbitrary variants, for example `<div class="[&>*]:m-1 [&[open]]:p-2"></div>`.
   *
   * Disable this might slightly improve the performance.
   *
   * @default true
   */
  arbitraryVariants?: boolean

  unit?: 'rpx' | 'vw'
}

export const presetMp = definePreset((options: PresetMpOptions = {}) => {
  options.dark = options.dark ?? 'class'
  options.attributifyPseudo = options.attributifyPseudo ?? false
  options.preflight = options.preflight ?? true
  options.variablePrefix = options.variablePrefix ?? 'un-'
  return {
    name: '@unocss/preset-mini',
    theme,
    rules,
    variants: variants(options),
    options,
    prefix: options.prefix,
    postprocess: postprocessor(options.variablePrefix, options.unit ?? 'rpx'),
    preflights: options.preflight
      ? normalizePreflights(preflights, options.variablePrefix)
      : [],
    extractorDefault: options.arbitraryVariants === false
      ? undefined
      : extractorArbitraryVariants,
    autocomplete: {
      shorthands,
    },
  }
})

export default presetMp

function postprocessor(prefix: string, unit: 'vw' | 'rpx'): Postprocessor {
  const varPrefix = VarPrefixPostprocessor(prefix)
  const unitTransform = unit === 'rpx' ? RemToRpxPostprocessor() : RemToVwPostprocessor()
  return (obj) => {
    if (varPrefix) {
      varPrefix(obj)
    }
    unitTransform(obj)
  }
}

export function VarPrefixPostprocessor(prefix: string): Postprocessor | undefined {
  if (prefix !== 'un-') {
    return (obj) => {
      obj.entries.forEach((i) => {
        i[0] = i[0].replace(/^--un-/, `--${prefix}`)
        if (typeof i[1] === 'string')
          i[1] = i[1].replace(/var\(--un-/g, `var(--${prefix}`)
      })
    }
  }
}

const remRE = /(-?[.\d]+)rem/g

export function RemToRpxPostprocessor(): Postprocessor {
  return (obj) => {
    obj.entries.forEach((i) => {
      const value = i[1]
      if (typeof value === 'string' && remRE.test(value))
        i[1] = value.replace(remRE, (_, p1) => `${p1 * 8}rpx`)
    })
  }
}

export function RemToVwPostprocessor(): Postprocessor {
  function round(n: number) {
    return n.toFixed(10).replace(/\.0+$/, '').replace(/(\.\d+?)0+$/, '$1')
  }
  return (obj) => {
    obj.entries.forEach((i) => {
      const value = i[1]
      if (typeof value === 'string' && remRE.test(value))
        i[1] = value.replace(remRE, (_, p1) => `${round(p1 * 100 / 375)}vw`)
    })
  }
}

export function normalizePreflights<Theme extends object>(preflights: Preflight<Theme>[], variablePrefix: string) {
  if (variablePrefix !== 'un-') {
    return preflights.map(p => ({
      ...p,
      getCSS: (() => async (ctx: PreflightContext<Theme>) => {
        const css = await p.getCSS(ctx)
        if (css)
          return css.replace(/--un-/g, `--${variablePrefix}`)
      })(),
    }))
  }

  return preflights
}
