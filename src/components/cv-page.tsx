'use client'

import {type FC, useState} from 'react'

import {pageArrival} from '@/lib/page-handoff'

import {CV} from './cv'
import {PageArrival} from './page-arrival'

export const CVPage: FC = () => {
  const [arrived] = useState(() => pageArrival() !== null)

  return (
    <>
      <PageArrival />
      <CV animated instant={arrived}>
        <div className="flex h-[116px] w-full flex-shrink-0" />
      </CV>
    </>
  )
}
