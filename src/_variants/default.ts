import type { Variant } from '@unocss/core'
import type { PresetMpOptions } from '..'
import type { Theme } from '../theme'
import { variantCombinators } from './combinators'
import { variantColorsMediaOrClass } from './dark'
import { variantLanguageDirections } from './directions'
import { variantCssLayer, variantInternalLayer, variantScope, variantSelector, variantVariables } from './misc'
import { variantNegative } from './negative'
import { variantImportant } from './important'
import { variantSupports } from './supports'
import { variantPartClasses, variantPseudoClassFunctions, variantPseudoClassesAndElements, variantTaggedPseudoClasses } from './pseudo'
import { variantContainerQuery } from './container'

export function variants(options: PresetMpOptions): Variant<Theme>[] {
  return [
    variantCssLayer,
    variantSelector,
    variantInternalLayer,
    variantNegative,
    variantImportant(),
    variantSupports,
    ...variantCombinators,

    variantPseudoClassesAndElements(),
    variantPseudoClassFunctions(),
    ...variantTaggedPseudoClasses(options),

    variantPartClasses,
    ...variantColorsMediaOrClass(options),
    ...variantLanguageDirections,
    variantScope,

    variantContainerQuery,
    variantVariables,
  ]
}
