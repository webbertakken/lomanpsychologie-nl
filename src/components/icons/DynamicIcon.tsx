import loadable from '@loadable/component'
import { IconContext, IconType } from 'react-icons'
import { IconLibraries } from './iconLibraries'

interface Props extends IconContext {
  icon: string
}

const Fallback = () => <div>•</div>

export function DynamicIcon({ icon, ...iconContext }: Props) {
  const library = icon ? IconLibraries.libraryOf(icon) : undefined

  if (!library) {
    if (icon) console.warn(`DynamicIcon: no react-icons library for "${icon}"`)
    return <Fallback />
  }

  const Icon = loadable(() => IconLibraries.load(library), {
    resolveComponent: (icons): IconType => {
      const Found = icons[icon]
      if (typeof Found === 'function') return Found as IconType
      console.warn(`DynamicIcon: react-icons/${library} has no icon "${icon}"`)
      return Fallback
    },
  })

  return (
    <IconContext.Provider value={iconContext}>
      <Icon />
    </IconContext.Provider>
  )
}
