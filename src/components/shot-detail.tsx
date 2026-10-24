import Image from 'next/image'
import {FC} from 'react'

import {EntryShot, EntryShotProperty} from '@/db'
import {LoopVideo} from './loop-video'

export type ShotDetailProps = Pick<EntryShot, 'title' | 'image' | 'description' | 'properties' | 'videos' | 'size'>

const ShotProperty: FC<EntryShotProperty> = ({name, value, url}) => (
  <div className="flex flex-row py-6">
    <div className="flex-1">
      <span className="text-[14px] md:text-[15px] font-normal tracking-normal align-middle text-white/50 leading-[100%]">
        {name}
      </span>
    </div>
    <div>
      {url && (
        <a
          href={url}
          target="_blank"
          className="text-[14px] md:text-[15px] font-normal tracking-normal align-middle text-white/90 leading-[100%] underline decoration-white/60 decoration-[1.5px] underline-offset-4 hover:decoration-white/80 transition-colors duration-500 ease-out"
          rel="noopener"
        >
          {value}
        </a>
      )}
      {!url && (
        <span className="text-[14px] md:text-[15px] font-normal tracking-normal align-middle text-white/90 leading-[100%]">
          {value}
        </span>
      )}
    </div>
  </div>
)

export const ShotDetail: FC<ShotDetailProps> = ({properties, title, description, image, videos, size}) => (
  // No card here, the way the CV has none: on its own page the shot is the page,
  // and a pane of glass around it only draws a second frame inside the first.
  // The open card on the grid renders this same markup, so the page it hands
  // over to lines up exactly; `data-morph` marks the parts the morph flies and
  // `data-reveal` the sections it staggers in once the card has landed.
  <div className="flex flex-col w-full">
    <div
      data-morph="media"
      className="relative w-full h-[250px] md:h-[336px] rounded-[28px] md:rounded-[20px] flex justify-center items-center overflow-hidden border-[0.75px] border-[#FFFFFF26]"
    >
      <Image src={image} alt="shot" fill sizes={size === 'small' ? '289px' : '594px'} style={{objectFit: 'cover'}} />
      {videos && (
        <div className="absolute inset-0 overflow-hidden">
          <LoopVideo srcMp4={videos.mp4} srcWebm={videos.webm} poster={image} />
        </div>
      )}
    </div>
    <div data-morph="details">
      <div>
        <h2
          data-reveal
          className="text-[16px] font-normal tracking-normal align-middle mt-[40px] text-white leading-[100%]"
        >
          {title}
        </h2>
        <p
          data-reveal
          className="text-[15px] md:text-[16px] font-normal tracking-normal align-middle mt-[8px] mb-[24px] text-white/50 leading-[20px]"
        >
          {description}
        </p>
      </div>
      <div>
        {properties.map((item, index) => (
          <div key={item.name} data-reveal>
            <ShotProperty {...item} />
            {properties.length - 1 > index && <div className="h-[1px] w-full bg-white/15" />}
          </div>
        ))}
      </div>
    </div>
  </div>
)
