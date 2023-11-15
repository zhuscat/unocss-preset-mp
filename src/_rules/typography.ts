import type { CSSObject, Rule } from '@unocss/core'
import { toArray } from '@unocss/core'
import type { Theme } from '../theme'
import { colorResolver, colorableShadows, h } from '../utils'

function handleThemeByKey(s: string, theme: Theme, key: 'lineHeight' | 'letterSpacing') {
  return theme[key]?.[s] || h.bracket.cssvar.global.rem(s)
}

export const fonts: Rule<Theme>[] = [
  // size
  [
    /^text-(.+)$/,
    ([, s = 'base'], { theme }) => {
      const size = s
      const sizePairs = toArray(theme.fontSize?.[size]) as [string, string | CSSObject, string?]

      if (sizePairs?.[0]) {
        const [fontSize, height, letterSpacing] = sizePairs
        if (typeof height === 'object') {
          return {
            'font-size': fontSize,
            ...height,
          }
        }
        return {
          'font-size': fontSize,
          'line-height': '1',
          'letter-spacing': letterSpacing ? handleThemeByKey(letterSpacing, theme, 'letterSpacing') : undefined,
        }
      }

      return { 'font-size': h.bracketOfLength.rem(s) }
    },
    { autocomplete: 'text-$fontSize' },
  ],
  [/^(?:text|font)-size-(.+)$/, ([, s], { theme }) => {
    const themed = toArray(theme.fontSize?.[s]) as [string, string | CSSObject]
    const size = themed?.[0] ?? h.bracket.cssvar.global.rem(s)
    if (size != null)
      return { 'font-size': size }
  }, { autocomplete: 'text-size-$fontSize' }],

  // weights
  [
    /^(?:fw)-?([^-]+)$/,
    ([, s], { theme }) => ({ 'font-weight': theme.fontWeight?.[s] || h.bracket.global.number(s) }),
    {
      autocomplete: [
        '(fw)-(100|200|300|400|500|600|700|800|900)',
        '(fw)-$fontWeight',
      ],
    },
  ],

  // leadings
  [
    /^(?:font-)?(?:lh)-(.+)$/,
    ([, s], { theme }) => ({ 'line-height': handleThemeByKey(s, theme, 'lineHeight') }),
    { autocomplete: '(lh)-$lineHeight' },
  ],

  // synthesis
  ['font-synthesis-weight', { 'font-synthesis': 'weight' }],
  ['font-synthesis-style', { 'font-synthesis': 'style' }],
  ['font-synthesis-small-caps', { 'font-synthesis': 'small-caps' }],
  ['font-synthesis-none', { 'font-synthesis': 'none' }],
  [/^font-synthesis-(.+)$/, ([, s]) => ({ 'font-synthesis': h.bracket.cssvar.global(s) })],

  // tracking
  [
    /^(?:font-)?tracking-(.+)$/,
    ([, s], { theme }) => ({ 'letter-spacing': theme.letterSpacing?.[s] || h.bracket.cssvar.global.rem(s) }),
    { autocomplete: 'tracking-$letterSpacing' },
  ],

  // word-spacing
  [
    /^(?:font-)?word-spacing-(.+)$/,
    ([, s], { theme }) => ({ 'word-spacing': theme.wordSpacing?.[s] || h.bracket.cssvar.global.rem(s) }),
    { autocomplete: 'word-spacing-$wordSpacing' },
  ],

  // family
  [
    /^font-(.+)$/,
    ([, d], { theme }) => ({ 'font-family': theme.fontFamily?.[d] || h.bracket.cssvar.global(d) }),
    { autocomplete: 'font-$fontFamily' },
  ],
]

export const tabSizes: Rule<Theme>[] = [
  [/^tab(?:-(.+))?$/, ([, s]) => {
    const v = h.bracket.cssvar.global.number(s || '4')
    if (v != null) {
      return {
        '-moz-tab-size': v,
        '-o-tab-size': v,
        'tab-size': v,
      }
    }
  }],
]

export const textIndents: Rule<Theme>[] = [
  [/^indent(?:-(.+))?$/, ([, s], { theme }) => ({ 'text-indent': theme.textIndent?.[s || 'DEFAULT'] || h.bracket.cssvar.global.fraction.rem(s) }), { autocomplete: 'indent-$textIndent' }],
]

export const textStrokes: Rule<Theme>[] = [
  // widths
  [/^text-stroke(?:-(.+))?$/, ([, s], { theme }) => ({ '-webkit-text-stroke-width': theme.textStrokeWidth?.[s || 'DEFAULT'] || h.bracket.cssvar.px(s) }), { autocomplete: 'text-stroke-$textStrokeWidth' }],

  // colors
  [/^text-stroke-(.+)$/, colorResolver('-webkit-text-stroke-color', 'text-stroke'), { autocomplete: 'text-stroke-$colors' }],
  [/^text-stroke-op-?(.+)$/, ([, opacity]) => ({ '--un-text-stroke-opacity': h.bracket.percent.cssvar(opacity) }), { autocomplete: 'text-stroke-op-<percent>' }],
]

export const textShadows: Rule<Theme>[] = [
  [/^text-shadow(?:-(.+))?$/, ([, s], { theme }) => {
    const v = theme.textShadow?.[s || 'DEFAULT']
    if (v != null) {
      return {
        '--un-text-shadow': colorableShadows(v, '--un-text-shadow-color').join(','),
        'text-shadow': 'var(--un-text-shadow)',
      }
    }
    return { 'text-shadow': h.bracket.cssvar.global(s) }
  }, { autocomplete: 'text-shadow-$textShadow' }],

  // colors
  [/^text-shadow-color-(.+)$/, colorResolver('--un-text-shadow-color', 'text-shadow'), { autocomplete: 'text-shadow-color-$colors' }],
  [/^text-shadow-color-op-?(.+)$/, ([, opacity]) => ({ '--un-text-shadow-opacity': h.bracket.percent.cssvar(opacity) }), { autocomplete: 'text-shadow-color-op-<percent>' }],
]
