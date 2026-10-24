export type SlugifyOptions = {
  allowDots?: boolean
}

export const slugify = (input: string, options: SlugifyOptions = {}): string => {
  const allowDots = options.allowDots ?? false

  const normalized = input
    .normalize('NFKD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()

  const pattern = allowDots ? /[^a-z0-9.]+/g : /[^a-z0-9]+/g

  return normalized.replace(pattern, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')
}

export const isValidSlug = (slug: string): boolean => {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)
}

export const assertValidSlug = (slug: string, context?: string): void => {
  if (!isValidSlug(slug)) {
    throw new Error(`Invalid slug${context ? ` (${context})` : ''}: "${slug}"`)
  }

  const canonical = slugify(slug)

  if (canonical !== slug) {
    throw new Error(`Non-canonical slug${context ? ` (${context})` : ''}: "${slug}" (expected "${canonical}")`)
  }
}

export const assertUniqueSlugs = (slugs: string[], context?: string): void => {
  const seen = new Set<string>()
  const duplicates: string[] = []

  for (const s of slugs) {
    if (seen.has(s)) {
      duplicates.push(s)
    }
    seen.add(s)
  }

  if (duplicates.length > 0) {
    const uniq = [...new Set(duplicates)].sort()
    throw new Error(`Duplicate slugs${context ? ` (${context})` : ''}: ${uniq.join(', ')}`)
  }
}
