type Lease = {
  element: HTMLVideoElement
  holders: HTMLElement[]
  onReturn: () => void
}

let lease: Lease | null = null

const plays = (element: HTMLVideoElement, src: string) =>
  [...element.querySelectorAll('source')].some(source => source.getAttribute('src') === src)

const endLease = () => {
  if (!lease) {
    return
  }

  const {element, onReturn} = lease
  lease = null
  element.remove()
  onReturn()
}

export const lendVideo = (element: HTMLVideoElement, onReturn: () => void) => {
  endLease()
  lease = {element, holders: [], onReturn}
}

export const isLent = (element: HTMLVideoElement) => lease?.element === element

export const hasLentVideo = (src: string) => lease !== null && plays(lease.element, src)

export const borrowVideo = (src: string, holder: HTMLElement) => {
  const current = lease

  if (!current || !plays(current.element, src)) {
    return null
  }

  current.holders.push(holder)
  holder.append(current.element)
  current.element.play().catch(() => undefined)

  return () => {
    current.holders = current.holders.filter(item => item !== holder)
    const previous = current.holders.at(-1)

    if (previous) {
      previous.append(current.element)
      current.element.play().catch(() => undefined)
      return
    }

    queueMicrotask(() => {
      if (lease === current && current.holders.length === 0) {
        endLease()
      }
    })
  }
}
