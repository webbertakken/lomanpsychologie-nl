import loadable from '@loadable/component'
import { IconContext, IconType } from 'react-icons'
import { IconLibraries, IconLibrary } from './iconLibraries'

interface Props extends IconContext {
  icon: string
}

const Fallback = () => <div>•</div>

const LoadedIconLibrary = loadable.lib(
  ({ library }: { library: string }) => IconLibraries.load(library),
  {
    cacheKey: ({ library }) => library,
    resolveComponent: (icons: IconLibrary) => icons,
  },
)

const IconFrom = ({
  icons,
  icon,
  library,
}: {
  icons: IconLibrary
  icon: string
  library: string
}) => {
  const Found = icons[icon]
  if (typeof Found !== 'function') {
    console.warn(`DynamicIcon: react-icons/${library} has no icon "${icon}"`)
    return <Fallback />
  }
  const Icon = Found as IconType
  return <Icon />
}

export function DynamicIcon({ icon, ...iconContext }: Props) {
  const library = icon ? IconLibraries.libraryOf(icon) : undefined

  if (!library) {
    if (icon) console.warn(`DynamicIcon: no react-icons library for "${icon}"`)
    return <Fallback />
  }

  return (
    <IconContext.Provider value={iconContext}>
      <LoadedIconLibrary library={library}>
        {(icons) => <IconFrom icons={icons} icon={icon} library={library} />}
      </LoadedIconLibrary>
    </IconContext.Provider>
  )
}
