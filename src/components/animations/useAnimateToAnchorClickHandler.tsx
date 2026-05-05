export function useAnimateToAnchorClickHandler() {
  const onClick = (e) => {
    const href = e.target.getAttribute('href').replace(/^\/+(index)?/, '')

    if (!href.startsWith('#')) return

    e.preventDefault()
    document.querySelector(href).scrollIntoView({ behavior: 'smooth' })
  }

  return onClick
}
