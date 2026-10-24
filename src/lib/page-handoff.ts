type Handoff = {scroll: number}

let toPage: Handoff | null = null
let toModal: Handoff | null = null

export const handOffToPage = (scroll: number) => {
  toPage = {scroll}
}

export const pageArrival = () => toPage

export const settlePageArrival = () => {
  toPage = null
}

export const handBackToModal = (scroll: number) => {
  toModal = {scroll}
}

export const takeModalReturn = () => {
  const handoff = toModal
  toModal = null

  return handoff
}
