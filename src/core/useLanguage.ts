import { useRouter } from 'next/router'
import { type Copy, copyFor } from './copy'
import { asLanguage, type Language } from './languages'

export const useLanguage = (): Language => asLanguage(useRouter().locale)

export const useCopy = (): Copy => copyFor(useLanguage())
