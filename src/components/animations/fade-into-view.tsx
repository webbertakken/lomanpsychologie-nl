import { ReactNode, useMemo, useRef } from 'react'
import { animated, useSpring } from 'react-spring'
import { useIsInView } from './useIsInView'

interface FadeIntoViewProps {
  children: ReactNode
  className?: string
  delay?: number
}

export const isAutomatedBrowser = (): boolean => {
  if (typeof window === 'undefined') return false
  // `navigator.webdriver` is set by all WebDriver-controlled browsers
  // (Playwright, Cypress, Selenium, etc.). Cypress also exposes
  // `window.Cypress`; keep that as a fallback for older Cypress versions
  // that historically left `navigator.webdriver` unset.
  if (typeof navigator !== 'undefined' && navigator.webdriver) return true
  // @ts-ignore: legacy detection of Cypress
  if (typeof window.Cypress !== 'undefined') return true
  return false
}

const FadeIntoView = ({ children, className, delay = 0 }: FadeIntoViewProps) => {
  const automatedTest = useMemo(isAutomatedBrowser, [])
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useIsInView(ref, 100)

  const style = useSpring({
    from: { opacity: 0 },
    to: { opacity: isInView || automatedTest ? 1 : 0.1 },
    delay,
    config: automatedTest ? { duration: 0 } : { friction: 60 },
  })

  return (
    <animated.div ref={ref} className={className} style={style}>
      {children}
    </animated.div>
  )
}

export default FadeIntoView
