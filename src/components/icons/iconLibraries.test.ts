import { describe, expect, it } from 'vitest'
import { IconLibraries } from './iconLibraries'

describe('IconLibraries', () => {
  it('derives the library from the icon name prefix', () => {
    expect(IconLibraries.libraryOf('HiChevronDown')).toBe('hi')
    expect(IconLibraries.libraryOf('VscAccount')).toBe('vsc')
  })

  it('knows no library for unprefixed or unknown names', () => {
    expect(IconLibraries.libraryOf('chevron')).toBeUndefined()
    expect(IconLibraries.libraryOf('XyzHeart')).toBeUndefined()
    expect(IconLibraries.libraryOf('ConstructorIcon')).toBeUndefined()
  })
})
