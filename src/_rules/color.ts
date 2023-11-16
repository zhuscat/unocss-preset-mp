import type { Rule } from '@unocss/core'
import { colorResolver, globalKeywords, h, isSize } from '../utils'

/**
 * @example op10
 */
export const opacity: Rule[] = [
  [/^op-?(.+)$/, ([, d]) => ({ opacity: h.percent.cssvar(d) })],
]

/**
 * @example c-red c-red5 c-red-300
 */
export const textColors: Rule[] = [
  [/^(?:c)-(.+)$/, colorResolver('color', 'text'), { autocomplete: 'c-$colors' }],
  // auto detection and fallback to font-size if the content looks like a size
  [/^(?:c)-(.+)$/, ([, v]) => globalKeywords.includes(v) ? { color: v } : undefined, { autocomplete: `(c)-(${globalKeywords.join('|')})` }],
  [/^(?:c)-op-?(.+)$/, ([, opacity]) => ({ '--un-text-opacity': h.percent.cssvar(opacity) }), { autocomplete: '(c)-op-<percent>' }],
]

export const bgColors: Rule[] = [
  [/^bg-(.+)$/, (...args) => isSize(args[0][1]) ? undefined : colorResolver('background-color', 'bg')(...args), { autocomplete: 'bg-$colors' }],
  [/^bg-op-?(.+)$/, ([, opacity]) => ({ '--un-bg-opacity': h.percent.cssvar(opacity) }), { autocomplete: 'bg-op-<percent>' }],
]

export const colorScheme: Rule[] = [
  [/^color-scheme-(\w+)$/, ([, v]) => ({ 'color-scheme': v })],
]
