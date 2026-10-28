import { act, render, screen } from '@testing-library/react'
import { useRef } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useIsInView } from './useIsInView'

type ObserverRecord = {
  callback: IntersectionObserverCallback
  options: IntersectionObserverInit | undefined
  observed: Element[]
  disconnect: ReturnType<typeof vi.fn<() => void>>
}

const observers: ObserverRecord[] = []
const originalIntersectionObserver = globalThis.IntersectionObserver

class FakeIntersectionObserver {
  private readonly record: ObserverRecord

  constructor(callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {
    this.record = { callback, options, observed: [], disconnect: vi.fn<() => void>() }
    observers.push(this.record)
  }

  observe(element: Element) {
    this.record.observed.push(element)
  }

  disconnect() {
    this.record.disconnect()
  }
}

const Probe = ({ bottomOffset }: { bottomOffset: number }) => {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useIsInView(ref, bottomOffset)
  return <div ref={ref}>{isInView ? 'in view' : 'out of view'}</div>
}

const intersect = (isIntersecting: boolean) =>
  act(() => {
    const { callback } = observers[0]
    callback(
      [{ isIntersecting } as IntersectionObserverEntry],
      {} as unknown as IntersectionObserver,
    )
  })

describe('useIsInView', () => {
  beforeEach(() => {
    observers.length = 0
    globalThis.IntersectionObserver =
      FakeIntersectionObserver as unknown as typeof IntersectionObserver
  })

  afterEach(() => {
    globalThis.IntersectionObserver = originalIntersectionObserver
  })

  it('starts out of view and observes the element, shrinking the viewport bottom by the offset', () => {
    render(<Probe bottomOffset={100} />)

    const element = screen.getByText('out of view')
    expect(observers).toHaveLength(1)
    expect(observers[0].observed).toEqual([element])
    expect(observers[0].options).toEqual({ rootMargin: '0px 0px -100px 0px' })
  })

  it('follows the element as it enters and leaves the viewport', () => {
    render(<Probe bottomOffset={0} />)

    intersect(true)
    expect(screen.getByText('in view')).toBeInTheDocument()

    intersect(false)
    expect(screen.getByText('out of view')).toBeInTheDocument()
  })

  it('stops observing on unmount', () => {
    const { unmount } = render(<Probe bottomOffset={0} />)

    unmount()

    expect(observers[0].disconnect).toHaveBeenCalledOnce()
  })

  it('treats the element as in view where IntersectionObserver is unavailable', () => {
    globalThis.IntersectionObserver = undefined

    render(<Probe bottomOffset={0} />)

    expect(screen.getByText('in view')).toBeInTheDocument()
  })
})
