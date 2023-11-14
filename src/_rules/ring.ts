import type { Rule } from '@unocss/core'
import type { Theme } from '../theme'
import { colorResolver, h } from '../utils'
import { varEmpty } from './static'

export const ringBase = {
  '--un-ring-inset': varEmpty,
  '--un-ring-offset-width': '0px',
  '--un-ring-offset-color': '#fff',
  '--un-ring-width': '0px',
  '--un-ring-color': 'rgb(147 197 253 / 0.5)',
  '--un-shadow': '0 0 rgb(0 0 0 / 0)',
}

export const rings: Rule<Theme>[] = [
  // size
  [/^ring(?:-(.+))?$/, ([, d], { theme }) => {
    const value = theme.ringWidth?.[d || 'DEFAULT'] ?? h.px(d || '1')
    if (value) {
      return {
        '--un-ring-width': value,
        '--un-ring-offset-shadow': 'var(--un-ring-inset) 0 0 0 var(--un-ring-offset-width) var(--un-ring-offset-color)',
        '--un-ring-shadow': 'var(--un-ring-inset) 0 0 0 calc(var(--un-ring-width) + var(--un-ring-offset-width)) var(--un-ring-color)',
        'box-shadow': 'var(--un-ring-offset-shadow), var(--un-ring-shadow), var(--un-shadow)',
      }
    }
  }, { autocomplete: 'ring-$ringWidth' }],
  [/^ring-(?:width-|size-)(.+)$/, ([, d], { theme }) => ({ '--un-ring-width': theme.lineWidth?.[d] ?? h.bracket.cssvar.px(d) }), { autocomplete: 'ring-(width|size)-$lineWidth' }],

  // offset size
  ['ring-offset', { '--un-ring-offset-width': '1px' }],
  [/^ring-offset-(?:width-|size-)?(.+)$/, ([, d], { theme }) => ({ '--un-ring-offset-width': theme.lineWidth?.[d] ?? h.bracket.cssvar.px(d) }), { autocomplete: 'ring-offset-(width|size)-$lineWidth' }],

  // colors
  [/^ring-(.+)$/, colorResolver('--un-ring-color', 'ring'), { autocomplete: 'ring-$colors' }],
  [/^ring-op?(.+)$/, ([, opacity]) => ({ '--un-ring-opacity': h.bracket.percent.cssvar(opacity) }), { autocomplete: 'ring-op<percent>' }],

  // offset color
  [/^ring-offset-(.+)$/, colorResolver('--un-ring-offset-color', 'ring-offset'), { autocomplete: 'ring-offset-$colors' }],
  [/^ring-offset-op(.+)$/, ([, opacity]) => ({ '--un-ring-offset-opacity': h.bracket.percent.cssvar(opacity) }), { autocomplete: 'ring-offset-op<percent>' }],

  // style
  ['ring-inset', { '--un-ring-inset': 'inset' }],
]
