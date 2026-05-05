import { describe, expect, it } from 'vitest'
import { humanFileSize } from './humanFileSize'

describe('humanFileSize', () => {
  it('returns bytes when below 1024 (binary)', () => {
    expect(humanFileSize(0)).toBe('0 B')
    expect(humanFileSize(1023)).toBe('1023 B')
  })

  it('formats kibibytes (binary)', () => {
    expect(humanFileSize(1024)).toBe('1.0 KiB')
    expect(humanFileSize(1024 * 1024)).toBe('1.0 MiB')
  })

  it('formats SI units when si=true', () => {
    expect(humanFileSize(1000, true)).toBe('1.0 kB')
    expect(humanFileSize(1_500_000, true)).toBe('1.5 MB')
  })

  it('respects the decimal-places argument', () => {
    expect(humanFileSize(1536, false, 0)).toBe('2 KiB')
    expect(humanFileSize(1536, false, 2)).toBe('1.50 KiB')
  })

  it('handles negative values', () => {
    expect(humanFileSize(-2048)).toBe('-2.0 KiB')
  })
})
