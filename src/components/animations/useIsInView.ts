import { RefObject, useEffect, useState } from 'react'
import { useClientValue } from '../../core/useClientValue'

const lacksIntersectionObserver = () => typeof IntersectionObserver === 'undefined'

/**
 * Whether the element is in the viewport, counting it only once its top has
 * risen `bottomOffset` pixels above the viewport's bottom edge.
 * Where IntersectionObserver is unavailable, the element counts as in view.
 */
export const useIsInView = (ref: RefObject<Element | null>, bottomOffset: number): boolean => {
  const [isIntersecting, setIsIntersecting] = useState(false)
  const cannotObserve = useClientValue(lacksIntersectionObserver, false)

  useEffect(() => {
    const element = ref.current
    if (!element || cannotObserve) return undefined

    const observer = new IntersectionObserver(
      ([entry]) => setIsIntersecting(entry.isIntersecting),
      {
        rootMargin: `0px 0px -${bottomOffset}px 0px`,
      },
    )
    observer.observe(element)

    return () => observer.disconnect()
  }, [ref, bottomOffset, cannotObserve])

  return cannotObserve || isIntersecting
}
