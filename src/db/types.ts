export type EntryVariant =
  | 'shot'
  | 'link'
  | 'contact'
  | 'map'
  | 'cv'
  | 'profile'
  | 'gallery'
  | 'technologies'
  | 'examples'

export type ShotSize = 's' | 'l'
export type ShotArea = `${ShotSize}${number}`

export type AnimationConfig = {
  origin: string
  from: {
    x: number
    y: number
    scale: number
    opacity: number
  }
  to: {
    x: number
    y: number
    scale: number
    opacity: number
    duration: number
    delay: number
    ease: string
  }
}

export type EntryShotProperty = {
  name: string
  value: string
  url?: string
}

export type EntryShotProperties = EntryShotProperty[]

export type EntryShotVideos = {
  mp4: string
  webm: string
}

export type EntryShotSize = 'large' | 'small'

export type EntryShot = {
  title: string
  /** The line under the title on the card: what the library is, in a few words. */
  subtitle?: string
  description: string
  image: string
  videos?: EntryShotVideos
  area: ShotArea
  properties: EntryShotProperties
  variant: Extract<EntryVariant, 'shot'>
  size: EntryShotSize
  slug: string
  animation?: AnimationConfig
}

/** A card that looks like a shot but leads elsewhere: clicking it opens `url` instead of a dialog. */
export type EntryLink = Pick<
  EntryShot,
  'title' | 'subtitle' | 'image' | 'videos' | 'area' | 'size' | 'slug' | 'animation'
> & {
  url: string
  variant: Extract<EntryVariant, 'link'>
}

/** One library's example app in the examples card: its icon, what it shows, and where its source lives. */
export type EntryExample = {
  title: string
  /** What the example shows, in a few words under its title. */
  description: string
  icon: string
  url: string
}

/** A tall card listing every library's example app, each row a link to its source rather than a dialog. */
export type EntryExamples = {
  area: 'examples'
  title: string
  subtitle: string
  examples: EntryExample[]
  variant: Extract<EntryVariant, 'examples'>
  slug: string
  animation?: AnimationConfig
}

export type Contact = {
  type: string
  url: string
  name?: string
}

export type EntryContact = {
  area: 'contact'
  contacts: Contact[]
  variant: Extract<EntryVariant, 'contact'>
  slug: string
  animation?: AnimationConfig
}

export type EntryMap = {
  area: 'map'
  variant: Extract<EntryVariant, 'map'>
  slug: string
  animation?: AnimationConfig
}

export type EntryCV = {
  area: 'cv'
  variant: Extract<EntryVariant, 'cv'>
  slug: string
  animation?: AnimationConfig
}

export type EntryProfile = {
  area: 'profile'
  variant: Extract<EntryVariant, 'profile'>
  slug: string
  animation?: AnimationConfig
}

export type EntryGallery = {
  area: 'gallery'
  variant: Extract<EntryVariant, 'gallery'>
  slug: string
  animation?: AnimationConfig
}

export type EntryTechnologies = {
  area: 'technologies'
  variant: Extract<EntryVariant, 'technologies'>
  slug: string
  animation?: AnimationConfig
}

export type Entry =
  | EntryShot
  | EntryLink
  | EntryContact
  | EntryMap
  | EntryCV
  | EntryProfile
  | EntryGallery
  | EntryTechnologies
  | EntryExamples

export type Entries = Entry[]

export type CVSectionProject = {
  name: string
  url: string
  position: string
  technologies: string[]
  paragraphs: string[]
}

export type CVSectionLink = {
  name: string
  url: string
}

export type CVPosition = {
  company?: string
  title: string
  url?: string
}

export type CVSection = {
  year: string
  positions: CVPosition[]
  location: string | null
  technologies: string[]
  paragraphs: string[]
  projects?: CVSectionProject[]
  links: CVSectionLink[]
}

export type CVSections = CVSection[]

export type CV = {
  workExperience: CVSections
  sideProjects: CVSections
  education: CVSections
  connect: Contact[]
}

export type IcoRecord = {
  label: string
  hint?: string
  value: string
  url?: string
}

export type Ico = {
  ico: string
  name: string
  headline: string
  since: string
  vat: string
  location: string
  records: IcoRecord[]
  source: {
    name: string
    url: string
    updatedAt: string
  }
}
