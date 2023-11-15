import type { CSSEntries, CSSObject, Rule, RuleContext } from '@unocss/core'
import { colorOpacityToString, colorToString } from '@unocss/rule-utils'
import type { Theme } from '../theme'
import { cornerMap, directionMap, globalKeywords, h, hasParseableColor, isCSSMathFn, parseColor } from '../utils'

export const borderStyles = ['solid', 'dashed', 'dotted', 'double', 'hidden', 'none', 'groove', 'ridge', 'inset', 'outset', ...globalKeywords]

// `(?:border|b)` -> `(?:b)`
// `(border|b)-` -> `b-`
// `(?:rounded|rd)` -> `(?:rd)
// `(rounded|rd)` -> `rd`
export const borders: Rule[] = [
  // compound
  [/^(?:b)()(?:-(.+))?$/, handlerBorder, { autocomplete: 'b-<directions>' }],
  [/^(?:b)-([xy])(?:-(.+))?$/, handlerBorder],
  [/^(?:b)-([rltbse])(?:-(.+))?$/, handlerBorder],
  [/^(?:b)-(block|inline)(?:-(.+))?$/, handlerBorder],
  [/^(?:b)-([bi][se])(?:-(.+))?$/, handlerBorder],

  // size
  [/^(?:b)-()(?:width|size)-(.+)$/, handlerBorderSize, { autocomplete: ['b-<num>', 'b-<directions>-<num>'] }],
  [/^(?:b)-([xy])-(?:width|size)-(.+)$/, handlerBorderSize],
  [/^(?:b)-([rltbse])-(?:width|size)-(.+)$/, handlerBorderSize],
  [/^(?:b)-(block|inline)-(?:width|size)-(.+)$/, handlerBorderSize],
  [/^(?:b)-([bi][se])-(?:width|size)-(.+)$/, handlerBorderSize],

  // colors
  [/^(?:b)-()(?:color-)?(.+)$/, handlerBorderColor, { autocomplete: ['b-$colors', 'b-<directions>-$colors'] }],
  [/^(?:b)-([xy])-(?:color-)?(.+)$/, handlerBorderColor],
  [/^(?:b)-([rltbse])-(?:color-)?(.+)$/, handlerBorderColor],
  [/^(?:b)-(block|inline)-(?:color-)?(.+)$/, handlerBorderColor],
  [/^(?:b)-([bi][se])-(?:color-)?(.+)$/, handlerBorderColor],

  // opacity
  [/^(?:b)-()op-?(.+)$/, handlerBorderOpacity, { autocomplete: 'b-op-<percent>' }],
  [/^(?:b)-([xy])-op-?(.+)$/, handlerBorderOpacity],
  [/^(?:b)-([rltbse])-op-?(.+)$/, handlerBorderOpacity],
  [/^(?:b)-(block|inline)-op-?(.+)$/, handlerBorderOpacity],
  [/^(?:b)-([bi][se])-op-?(.+)$/, handlerBorderOpacity],

  // radius
  [/^(?:border-|b-)?(?:rd)()(?:-(.+))?$/, handlerRounded, { autocomplete: ['b-rd', 'b-rd-<num>', 'rd', 'rd-<num>'] }],
  [/^(?:border-|b-)?(?:rd)-([rltbse])(?:-(.+))?$/, handlerRounded],
  [/^(?:border-|b-)?(?:rd)-([rltb]{2})(?:-(.+))?$/, handlerRounded],
  [/^(?:border-|b-)?(?:rd)-([bise][se])(?:-(.+))?$/, handlerRounded],
  [/^(?:border-|b-)?(?:rd)-([bi][se]-[bi][se])(?:-(.+))?$/, handlerRounded],

  // style
  [/^(?:b)-(?:style-)?()(.+)$/, handlerBorderStyle, { autocomplete: ['b-style', `b-(${borderStyles.join('|')})`, 'b-<directions>-style', `b-<directions>-(${borderStyles.join('|')})`, `b-<directions>-style-(${borderStyles.join('|')})`, `b-style-(${borderStyles.join('|')})`] }],
  [/^(?:b)-([xy])-(?:style-)?(.+)$/, handlerBorderStyle],
  [/^(?:b)-([rltbse])-(?:style-)?(.+)$/, handlerBorderStyle],
  [/^(?:b)-(block|inline)-(?:style-)?(.+)$/, handlerBorderStyle],
  [/^(?:b)-([bi][se])-(?:style-)?(.+)$/, handlerBorderStyle],
]

function borderColorResolver(direction: string) {
  return ([, body]: string[], theme: Theme): CSSObject | undefined => {
    const data = parseColor(body, theme)

    if (!data)
      return

    const { alpha, color, cssColor } = data

    if (cssColor) {
      if (alpha != null) {
        return {
          [`border${direction}-color`]: colorToString(cssColor, alpha),
        }
      }
      if (direction === '') {
        return {
          '--un-border-opacity': colorOpacityToString(cssColor),
          'border-color': colorToString(cssColor, 'var(--un-border-opacity)'),
        }
      }
      else {
        return {
        // Separate this return since if `direction` is an empty string, the first key will be overwritten by the second.
          '--un-border-opacity': colorOpacityToString(cssColor),
          [`--un-border${direction}-opacity`]: 'var(--un-border-opacity)',
          [`border${direction}-color`]: colorToString(cssColor, `var(--un-border${direction}-opacity)`),
        }
      }
    }
    else if (color) {
      if (isCSSMathFn(color)) {
        return {
          'border-width': color,
        }
      }

      return {
        [`border${direction}-color`]: colorToString(color, alpha),
      }
    }
  }
}

function handlerBorder(m: string[], ctx: RuleContext): CSSEntries | undefined {
  return handlerBorderSize(m, ctx)
}

function handlerBorderSize([, a = '', b]: string[], { theme }: RuleContext<Theme>): CSSEntries | undefined {
  const v = theme.lineWidth?.[b || 'DEFAULT'] ?? h.bracket.cssvar.global.px(b || '1')
  if (a in directionMap && v != null)
    return directionMap[a].map(i => [`border${i}-width`, v])
}

function handlerBorderColor([, a = '', c]: string[], { theme }: RuleContext<Theme>): CSSObject | undefined {
  if (a in directionMap && hasParseableColor(c, theme)) {
    return Object.assign(
      {},
      ...directionMap[a].map(i => borderColorResolver(i)(['', c], theme)),
    )
  }
}

function handlerBorderOpacity([, a = '', opacity]: string[]): CSSEntries | undefined {
  const v = h.bracket.percent.cssvar(opacity)
  if (a in directionMap && v != null)
    return directionMap[a].map(i => [`--un-border${i}-opacity`, v])
}

function handlerRounded([, a = '', s]: string[], { theme }: RuleContext<Theme>): CSSEntries | undefined {
  const v = theme.borderRadius?.[s || 'DEFAULT'] || h.bracket.cssvar.global.fraction.rem(s || '1')
  if (a in cornerMap && v != null)
    return cornerMap[a].map(i => [`border${i}-radius`, v])
}

export function handlerBorderStyle([, a = '', s]: string[]): CSSEntries | undefined {
  if (borderStyles.includes(s) && a in directionMap)
    return directionMap[a].map(i => [`border${i}-style`, s])
}
