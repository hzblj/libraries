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
  // What the site says about itself to search engines and link previews. Kept
  // under the ~160 characters a search result shows before cutting it off; the
  // keywords in app/layout.tsx and the structured data name every library.
  description:
    'Open-source Expo and React Native libraries by Jan Blazej: the Kara design system, Zyplot charts, PayPal, speech to text, native icons, haptics and more.',
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
  // The profile card's second line: the prefix muted, the subject in full white
  // and a link to where it comes from.
  tagline: {href: 'https://expo.dev', prefix: 'Libraries for', subject: 'Expo'},
  title: 'hzblj · Libraries for Expo and React Native',
  // One tile of the endless grid: the five columns and five rows of the
  // template in scene/grid/layout.ts, each a card and its gap.
  viewport: {
    height: 1170,
    width: 1530,
  },
} as const
