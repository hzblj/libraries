'use client'

import {type FC, useMemo} from 'react'

import type {EntryExamples} from '@/db'

import {Surface, useEntity} from '../../entity'
import {insetRect} from '../../grid'
import {CV_BORDER_ANGLE} from '../cv'
import {ShotLabel} from '../shot/ShotLabel'
import {ExampleRow} from './ExampleRow'
import {useExampleRows} from './useExampleRows'

type ExamplesContentProps = {
  entry: EntryExamples
}

export const ExamplesContent: FC<ExamplesContentProps> = ({entry}) => {
  const {size} = useEntity()
  const clip = useMemo(() => insetRect({x: 0, y: 0, ...size}, 1), [size])
  const {motions, pointer, rows} = useExampleRows(entry.examples)

  return (
    <>
      <Surface border={CV_BORDER_ANGLE} {...pointer} />
      {entry.examples.map((example, index) => (
        <ExampleRow key={example.url} example={example} row={rows[index]} motion={motions[index]} />
      ))}
      <ShotLabel title={entry.title} subtitle={entry.subtitle} clip={clip} />
    </>
  )
}
