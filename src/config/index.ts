export const Config = {
  // One curve for every floating control — the corner dock on the grid, the
  // expand pill over an open modal, the close button on a phone. They all come
  // and go alongside a modal, so they borrow its timing rather than each
  // carrying its own: opening a card and the controls arriving around it read as
  // one gesture instead of two.
  controls: {
    enterDelay: 0.1,
    enterDuration: 0.3,
    enterEase: 'power2.out',
    exitDuration: 0.2,
    exitEase: 'power2.in',
    // What they shrink to on the way out, matching the modal card itself.
    scale: 0.95,
  },
  // What the site says about itself to search engines and link previews.
  description:
    'Open-source libraries for Expo and React Native by Jan Blazej: Kara, a native-first design system, Zyplot charts, native zoom transitions, alternate app icons, rich haptics, country flags and a monorepo starter.',
  fullName: 'Jan Blazej',
  // What the profile card in the middle of the grid says.
  handle: 'hzblj',
  location: {
    city: 'Prague, Czechia',
    mapUrl: 'https://maps.app.goo.gl/7TbuX47ttiZbRms27',
  },
  // Where the portfolio lives, the person behind the libraries in structured data.
  portfolio: 'https://www.janblazej.dev',
  // The host every absolute URL the site publishes has to carry — canonicals,
  // `og:` tags, the sitemap, the structured data. The apex redirects here, so
  // anything naming it sends a crawler one hop short of where it meant to point,
  // and a canonical that redirects is a canonical arguing with itself.
  site: 'https://www.libraries.janblazej.dev',
  // The profile card's second line: the prefix muted, the subject in full white.
  tagline: {prefix: 'Libraries for', subject: 'Expo'},
  title: 'hzblj · Libraries for Expo and React Native',
  // The whole collection with the grid's 2px padding on every side: five
  // columns and three rows of the template in scene/grid/layout.ts.
  viewport: {
    height: 690,
    width: 1518,
  },
} as const
