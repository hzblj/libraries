'use client'

import type {FC} from 'react'

import {Surface} from '../../entity'
import {TechnologyItem} from './TechnologyItem'
import {TECHNOLOGIES} from './technologies'
import {useTechnologyColumns} from './useTechnologyColumns'

export const TechnologiesContent: FC = () => {
  const {columns, lifts, pointer} = useTechnologyColumns()

  return (
    <>
      <Surface {...pointer} />
      {TECHNOLOGIES.map((technology, index) => (
        <TechnologyItem key={technology.title} technology={technology} column={columns[index]} lift={lifts[index]} />
      ))}
    </>
  )
}
