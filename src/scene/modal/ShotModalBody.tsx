import type {FC} from 'react'

import {ShotDetail} from '@/components/shot-detail'
import type {EntryShot} from '@/db'

type ShotModalBodyProps = {
  entry: EntryShot
}

export const ShotModalBody: FC<ShotModalBodyProps> = ({entry}) => {
  const {title, description, image, videos, size, properties} = entry

  return (
    <div className="px-[20px] md:px-8 pt-[20px] md:pt-8 pb-2">
      <ShotDetail
        title={title}
        description={description}
        image={image}
        videos={videos}
        size={size}
        properties={properties}
      />
    </div>
  )
}
