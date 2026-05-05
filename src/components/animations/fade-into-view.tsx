import { ReactNodeLike } from 'prop-types'
import React, { useMemo } from 'react'
import { animated, Spring } from 'react-spring'
import VisibilitySensor from 'react-visibility-sensor'

interface FadeIntoViewProps {
  children: ReactNodeLike
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

const FadeIntoView = ({ children, className, delay }: FadeIntoViewProps) => {
  const automatedTest = useMemo(isAutomatedBrowser, [])

  return (
    <VisibilitySensor partialVisibility minTopValue={100}>
      {({ isVisible }) => (
        <Spring
          from={{ opacity: 0 }}
          delay={delay}
          to={{ opacity: isVisible ? 1 : automatedTest ? 1 : 0.1 }}
          config={automatedTest ? { duration: 0 } : { friction: 60 }}
        >
          {({ opacity }) => (
            <animated.div className={className} style={{ opacity }}>
              {children}
            </animated.div>
          )}
        </Spring>
      )}
    </VisibilitySensor>
  )
}

FadeIntoView.defaultProps = {
  delay: 0,
  className: undefined,
}

export default FadeIntoView
