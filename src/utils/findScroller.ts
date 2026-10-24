export const findScroller = (node: HTMLElement | null) => {
  let element = node?.parentElement ?? null

  while (element && element !== document.body) {
    const {overflowY} = getComputedStyle(element)

    if (overflowY === 'auto' || overflowY === 'scroll') {
      return element
    }

    element = element.parentElement
  }

  return undefined
}
