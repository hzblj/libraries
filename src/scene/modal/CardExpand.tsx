import type {FC} from 'react'
import type {OpenCard} from '../state'
export const CardExpand: FC<{card: OpenCard; onExpand: (href: string) => void}> = ({card}) => (
  <a
    href={card.kind === 'shot' ? `https://github.com/hzblj/${card.entry.slug}` : 'https://github.com/hzblj'}
    target="_blank"
    rel="noreferrer"
    className="glass rounded-full px-5 py-3 text-sm"
  >
    GitHub ↗
  </a>
)
