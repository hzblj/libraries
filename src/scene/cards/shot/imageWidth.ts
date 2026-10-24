import type {EntryShot} from '@/db'

export const shotImageWidth = (size: EntryShot['size']) => (size === 'small' ? 640 : 1200)
