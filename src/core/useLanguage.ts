import { useRouter } from 'next/compat/router'
import { type Copy, copyFor } from './copy'
import { asLanguage, type Language } from './languages'

/** The visitor's language; Dutch outside a Next.js page, such as in tests. */
export const useLanguage = (): Language => asLanguage(useRouter()?.locale)

export const useCopy = (): Copy => copyFor(useLanguage())
