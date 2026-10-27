import { RefObject, useEffect, useState } from 'react'

/**
 * Whether the element is in the viewport, counting it only once its top has
 * risen `bottomOffset` pixels above the viewport's bottom edge.
 */
export const useIsInView = (ref: RefObject<Element | null>, bottomOffset: number): boolean => {
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return undefined

    if (typeof IntersectionObserver === 'undefined') {
      setIsInView(true)
      return undefined
    }

    const observer = new IntersectionObserver(([entry]) => setIsInView(entry.isIntersecting), {
      rootMargin: `0px 0px -${bottomOffset}px 0px`,
    })
    observer.observe(element)

    return () => observer.disconnect()
  }, [ref, bottomOffset])

  return isInView
}
