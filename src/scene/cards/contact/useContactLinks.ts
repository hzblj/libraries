import {use, useMemo} from 'react'

import type {Contact} from '@/db'

import {loadFonts, measureText} from '../../graphics'
import {openExternal, useHotspots} from '../../interaction'
import {useUnderlines} from '../shared'
import {DIVIDER, LINK, ROW_TOP, WIDTH} from './styles'

const layoutLinks = (contacts: Contact[], top: number, span: number) => {
  const widths = contacts.map(contact => measureText(contact.type, LINK))
  let cursor = (span - widths.reduce((sum, width) => sum + width, 0) - DIVIDER * (contacts.length - 1)) / 2

  return contacts.map((contact, index) => {
    const x = cursor
    cursor += widths[index] + DIVIDER

    return {
      contact,
      link: {height: 21, width: widths[index], x, y: top},
      underline: {height: 1.5, width: widths[index], x, y: top + 21},
    }
  })
}

export const useContactLinks = (contacts: Contact[], top = ROW_TOP, width = WIDTH) => {
  use(loadFonts())
  const underlines = useUnderlines(contacts.length)
  const links = useMemo(() => layoutLinks(contacts, top, width), [contacts, top, width])

  const hotspots = useMemo(
    () =>
      links.map(({contact, link}, index) => ({
        onClick: () => openExternal(contact.url),
        onEnter: underlines[index].enter,
        onLeave: underlines[index].leave,
        rect: link,
      })),
    [links, underlines]
  )

  return {links, pointer: useHotspots(hotspots), underlines}
}
