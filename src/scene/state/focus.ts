export const focusIds = {
  company: 'profile:company',
  contact: (type: string) => `contact:${type}`,
  cv: 'cv',
  example: (title: string) => `example:${title}`,
  gallery: 'gallery',
  map: 'map',
  shot: (slug: string) => `shot:${slug}`,
  technology: (title: string) => `technology:${title}`,
}
