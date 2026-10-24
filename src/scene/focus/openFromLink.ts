import {nearestCopy} from '../camera'
import {getAreaRect} from '../grid'
import {type OpenCard, openCard} from '../state'

export const openFromLink = (card: OpenCard) => {
  const {rect, slot} = nearestCopy(getAreaRect(card.entry.area))

  openCard(card, {rect, slot, slug: card.entry.slug})
}
