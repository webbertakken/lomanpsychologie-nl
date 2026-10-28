import { describe, expect, it } from 'vitest'
import { IconLibraries } from './iconLibraries'

describe('IconLibraries', () => {
  it('derives the library from the icon name prefix', () => {
    expect(IconLibraries.libraryOf('HiChevronDown')).toBe('hi')
    expect(IconLibraries.libraryOf('VscAccount')).toBe('vsc')
  })

  it('extends a library with the newer set sharing its prefix, older glyphs first', async () => {
    const fa = await IconLibraries.load('fa')
    const fa5 = await import('react-icons/fa')

    expect(fa.FaPersonCircleExclamation).toBeTypeOf('function')
    expect(fa.FaRegFilePdf).toBe(fa5.FaRegFilePdf)
    expect((await IconLibraries.load('hi')).HiWrench).toBeTypeOf('function')
    expect((await IconLibraries.load('io')).IoWoman).toBeTypeOf('function')
  })

  it('knows no library for unprefixed or unknown names', () => {
    expect(IconLibraries.libraryOf('chevron')).toBeUndefined()
    expect(IconLibraries.libraryOf('XyzHeart')).toBeUndefined()
    expect(IconLibraries.libraryOf('ConstructorIcon')).toBeUndefined()
  })
})
