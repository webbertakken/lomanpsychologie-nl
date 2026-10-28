export type IconLibrary = Readonly<Record<string, unknown>>

// Newer react-icons sets reuse their predecessor's prefix (FaXTwitter lives
// in fa6), so a prefix covers both; the older glyph wins where names overlap.
const withNewerSet =
  (older: () => Promise<IconLibrary>, newer: () => Promise<IconLibrary>) =>
  async (): Promise<IconLibrary> => {
    const [olderIcons, newerIcons] = await Promise.all([older(), newer()])
    return { ...newerIcons, ...olderIcons }
  }

// Bundlers only emit chunks for import specifiers they can see, so every
// react-icons library is listed explicitly; each loads lazily on first use.
const loaders: Record<string, () => Promise<IconLibrary>> = {
  ai: () => import('react-icons/ai'),
  bi: () => import('react-icons/bi'),
  bs: () => import('react-icons/bs'),
  cg: () => import('react-icons/cg'),
  ci: () => import('react-icons/ci'),
  di: () => import('react-icons/di'),
  fa: withNewerSet(
    () => import('react-icons/fa'),
    () => import('react-icons/fa6'),
  ),
  fc: () => import('react-icons/fc'),
  fi: () => import('react-icons/fi'),
  gi: () => import('react-icons/gi'),
  go: () => import('react-icons/go'),
  gr: () => import('react-icons/gr'),
  hi: withNewerSet(
    () => import('react-icons/hi'),
    () => import('react-icons/hi2'),
  ),
  im: () => import('react-icons/im'),
  io: withNewerSet(
    () => import('react-icons/io'),
    () => import('react-icons/io5'),
  ),
  lia: () => import('react-icons/lia'),
  lu: () => import('react-icons/lu'),
  md: () => import('react-icons/md'),
  pi: () => import('react-icons/pi'),
  ri: () => import('react-icons/ri'),
  rx: () => import('react-icons/rx'),
  si: () => import('react-icons/si'),
  sl: () => import('react-icons/sl'),
  tb: () => import('react-icons/tb'),
  tfi: () => import('react-icons/tfi'),
  ti: () => import('react-icons/ti'),
  vsc: () => import('react-icons/vsc'),
  wi: () => import('react-icons/wi'),
}

export const IconLibraries = {
  libraryOf: (iconName: string): string | undefined => {
    const library = iconName.match(/^[A-Z][a-z]+/)?.[0].toLowerCase()
    return library && Object.hasOwn(loaders, library) ? library : undefined
  },
  load: (library: string): Promise<IconLibrary> => loaders[library](),
} as const
