import type { CSSEntries, Rule } from '@unocss/core'
import { directionMap, directionSize } from '../utils'

export const paddings: Rule[] = [
  [
    /^p()-(-?.+)$/,
    directionSize('padding'),
    { autocomplete: ['(m|p)<num>', '(m|p)-<num>'] },
  ],
  [/^p-xy()()$/, directionSize('padding'), { autocomplete: '(m|p)-(xy)' }],
  [/^p([xy])(?:-(-?.+))?$/, directionSize('padding')],
  [
    /^p([rltbse])(?:-(-?.+))?$/,
    directionSize('padding'),
    { autocomplete: '(m|p)<directions>-<num>' },
  ],
  [
    /^p-(block|inline)(?:-(-?.+))?$/,
    directionSize('padding'),
    { autocomplete: '(m|p)-(block|inline)-<num>' },
  ],
  [
    /^p-([bi][se])(?:-(-?.+))?$/,
    directionSize('padding'),
    { autocomplete: '(m|p)-(bs|be|is|ie)-<num>' },
  ],
  // addtional rules: safe area
  [
    /^p([rltb])-safe(?:-(-?.+))?$/,
    (match, ctx): CSSEntries | undefined => {
      const props = directionSize('padding')(match, ctx) as CSSEntries
      if (props) {
        return props.map(([k, v]) => {
          return [
            k,
            `calc(env(safe-area-inset${directionMap[match[1]]}) + ${v})`,
          ]
        })
      }
    },
    { autocomplete: '(m|p)<directions>-safe-<num>' },
  ],
]

export const margins: Rule[] = [
  [/^m()-(-?.+)$/, directionSize('margin')],
  [/^m-xy()()$/, directionSize('margin')],
  [/^m([xy])(?:-(-?.+))?$/, directionSize('margin')],
  [/^m([rltbse])(?:-(-?.+))?$/, directionSize('margin')],
  [/^m-(block|inline)(?:-(-?.+))?$/, directionSize('margin')],
  [/^m-([bi][se])(?:-(-?.+))?$/, directionSize('margin')],

  // addtional rules: safe area
  [
    /^m([rltb])-safe(?:-(-?.+))?$/,
    (match, ctx): CSSEntries | undefined => {
      const props = directionSize('margin')(match, ctx) as CSSEntries
      if (props) {
        return props.map(([k, v]) => {
          return [
            k,
            `calc(env(safe-area-inset${directionMap[match[1]]}) + ${v})`,
          ]
        })
      }
    },
  ],
]
