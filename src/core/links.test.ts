import { describe, expect, it } from 'vitest'
import { isResolved } from './links'

describe('isResolved', () => {
  it('accepts a resolved entry', () => {
    expect(isResolved({ sys: { type: 'Entry', id: 'a' }, fields: {} })).toBe(true)
  })

  it('accepts a resolved asset', () => {
    expect(isResolved({ sys: { type: 'Asset', id: 'a' }, fields: {} })).toBe(true)
  })

  it('rejects a link to a draft or deleted entry', () => {
    expect(isResolved({ sys: { type: 'Link', linkType: 'Entry', id: 'a' } })).toBe(false)
  })

  it('rejects a missing link', () => {
    expect(isResolved(undefined)).toBe(false)
  })
})
