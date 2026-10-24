const opensInNewTab = (url: string) => /^https?:/i.test(url)

export const openExternal = (url: string) => {
  if (!opensInNewTab(url)) {
    window.location.href = url
    return
  }

  window.open(url, '_blank', 'noopener,noreferrer')
}
