import {Config} from '@/config'
import {type EntryShot, entries} from '@/db'

const libraries = entries.filter((entry): entry is EntryShot => entry.variant === 'shot')

const link = (entry: EntryShot, name: string) => entry.properties.find(property => property.name === name)?.url

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  author: {
    '@type': 'Person',
    alternateName: Config.handle,
    name: Config.fullName,
    sameAs: ['https://github.com/hzblj', 'https://www.npmjs.com/~hzblj'],
    url: Config.portfolio,
  },
  description: Config.description,
  mainEntity: {
    '@type': 'ItemList',
    itemListElement: libraries.map((entry, index) => ({
      '@type': 'ListItem',
      item: {
        '@type': 'SoftwareSourceCode',
        codeRepository: link(entry, 'GitHub'),
        description: entry.description,
        name: entry.title,
        programmingLanguage: 'TypeScript',
        url: link(entry, 'Website') ?? link(entry, 'GitHub'),
      },
      position: index + 1,
    })),
  },
  name: Config.title,
  url: Config.site,
}

/** The collection as structured data: who made it and every library in it, with its repository. */
export const LibrariesJsonLd = () => (
  <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(jsonLd)}} />
)

/**
 * The page as text, for whatever reads it without running the scene: a heading,
 * what the site is, and each library with its links. A browser that runs
 * scripts never shows it, so it says nothing twice to a screen reader.
 */
export const LibrariesNoScript = () => (
  <noscript>
    <main>
      <h1>{Config.title}</h1>
      <p>{Config.description}</p>
      <ul>
        {libraries.map(entry => (
          <li key={entry.slug}>
            <h2>{entry.title}</h2>
            <p>{entry.description}</p>
            {entry.properties
              .filter(property => property.url)
              .map(property => (
                <a key={property.name} href={property.url}>
                  {property.name}: {property.value}
                </a>
              ))}
          </li>
        ))}
      </ul>
    </main>
  </noscript>
)
