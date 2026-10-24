import {useCallback, useEffect, useState} from 'react'
import {LinearFilter, NoColorSpace, VideoTexture} from 'three'

import type {EntryShotVideos} from '@/db'
import {isLent, lendVideo} from '@/lib/lent-video'

import type {VideoSource} from '../../entity'

const SOURCES = [
  ['webm', 'video/webm'],
  ['mp4', 'video/mp4'],
] as const

const createVideo = (videos: EntryShotVideos) => {
  const element = document.createElement('video')
  element.muted = true
  element.loop = true
  element.playsInline = true
  element.preload = 'auto'

  for (const [key, type] of SOURCES) {
    const source = document.createElement('source')
    source.src = videos[key]
    source.type = type
    element.append(source)
  }

  return element
}

const createVideoTexture = (element: HTMLVideoElement) => {
  const texture = new VideoTexture(element)
  texture.colorSpace = NoColorSpace
  texture.generateMipmaps = false
  texture.minFilter = LinearFilter
  texture.userData.size = {height: 0, width: 0}

  element.addEventListener('loadedmetadata', () => {
    texture.userData.size = {height: element.videoHeight, width: element.videoWidth}
  })

  return texture
}

export const useHoverVideo = (videos?: EntryShotVideos) => {
  const [source] = useState<VideoSource>(() => ({mix: 0, texture: null}))
  const [player] = useState(() => ({element: null as HTMLVideoElement | null, hovered: false}))

  useEffect(
    () => () => {
      player.element?.pause()
      source.texture?.dispose()
    },
    [player, source]
  )

  const play = useCallback(() => {
    player.hovered = true

    if (!videos) {
      return
    }

    if (!player.element) {
      const element = createVideo(videos)
      const texture = createVideoTexture(element)

      // The card shows the clip again only once a frame of this play has reached the
      // texture, so the frame the last hover stopped on never flashes back.
      element.addEventListener('playing', () => {
        element.requestVideoFrameCallback(() => {
          if (player.hovered || isLent(element)) {
            source.texture = texture
            source.mix = 1
          }
        })
      })

      player.element = element
    }

    player.element.play().catch(() => undefined)
  }, [player, source, videos])

  // Straight back to the still, the clip's own first frame: nothing redraws a card
  // that stops moving, so leaving the clip up would hold whatever frame it paused on.
  const rewind = useCallback(() => {
    source.mix = 0

    if (!player.element) {
      return
    }

    player.element.pause()
    player.element.currentTime = 0
  }, [player, source])

  const stop = useCallback(() => {
    player.hovered = false

    if (player.element && !isLent(player.element)) {
      rewind()
    }
  }, [player, rewind])

  const lend = useCallback(() => {
    const element = player.element

    if (!element) {
      return
    }

    lendVideo(element, () => {
      if (player.hovered) {
        element.play().catch(() => undefined)
      } else {
        rewind()
      }
    })
  }, [player, rewind])

  return {lend, play, source, stop}
}
