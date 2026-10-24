import type {FC} from 'react'

import {CV} from '@/components/cv'

export const CVModalBody: FC = () => {
  return (
    <div className="flex flex-col items-center py-[32px] md:py-[56px] px-[32px] md:px-0">
      <div data-morph="media" className="w-full max-w-[572px]">
        <div data-morph="details">
          <CV animated instant />
        </div>
      </div>
    </div>
  )
}
