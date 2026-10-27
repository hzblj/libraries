import Image from 'next/image'
import {FC, ReactNode} from 'react'

import {EntryShot, EntryShotPlatform, EntryShotProperty} from '@/db'
import {CopyButton} from './copy-button'
import {LoopVideo} from './loop-video'

export type ShotDetailProps = Pick<
  EntryShot,
  'title' | 'image' | 'description' | 'install' | 'platforms' | 'properties' | 'videos' | 'size'
>

// Each platform's mark, drawn inline in the pill's ink. Apple's and Android's
// are Simple Icons' (CC0); the web has no mark of its own, so it gets a globe.
const platformIcons: Record<EntryShotPlatform, ReactNode> = {
  Android: (
    <path
      fill="currentColor"
      d="M18.4395 5.5586c-.675 1.1664-1.352 2.3318-2.0274 3.498-.0366-.0155-.0742-.0286-.1113-.043-1.8249-.6957-3.484-.8-4.42-.787-1.8551.0185-3.3544.4643-4.2597.8203-.084-.1494-1.7526-3.021-2.0215-3.4864a1.1451 1.1451 0 0 0-.1406-.1914c-.3312-.364-.9054-.4859-1.379-.203-.475.282-.7136.9361-.3886 1.5019 1.9466 3.3696-.0966-.2158 1.9473 3.3593.0172.031-.4946.2642-1.3926 1.0177C2.8987 12.176.452 14.772 0 18.9902h24c-.119-1.1108-.3686-2.099-.7461-3.0683-.7438-1.9118-1.8435-3.2928-2.7402-4.1836a12.1048 12.1048 0 0 0-2.1309-1.6875c.6594-1.122 1.312-2.2559 1.9649-3.3848.2077-.3615.1886-.7956-.0079-1.1191a1.1001 1.1001 0 0 0-.8515-.5332c-.5225-.0536-.9392.3128-1.0488.5449zm-.0391 8.461c.3944.5926.324 1.3306-.1563 1.6503-.4799.3197-1.188.0985-1.582-.4941-.3944-.5927-.324-1.3307.1563-1.6504.4727-.315 1.1812-.1086 1.582.4941zM7.207 13.5273c.4803.3197.5506 1.0577.1563 1.6504-.394.5926-1.1038.8138-1.584.4941-.48-.3197-.5503-1.0577-.1563-1.6504.4008-.6021 1.1087-.8106 1.584-.4941z"
    />
  ),
  iOS: (
    <path
      fill="currentColor"
      d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"
    />
  ),
  Web: (
    <g fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <ellipse cx="12" cy="12" rx="4" ry="10" />
      <path d="M2 12h20" />
    </g>
  ),
}

// Where the library runs, the first row of the list: small pills of the same
// glass as the install line above it, each its platform's mark and name. They
// stand lower than the row's line, so the row keeps the height of the links
// under it.
const ShotPlatforms: FC<{platforms: EntryShotPlatform[]}> = ({platforms}) => (
  <ul className="flex shrink-0 items-center gap-1.5">
    {platforms.map(platform => (
      <li
        key={platform}
        className="flex items-center gap-1 rounded-full border-[0.75px] border-[#FFFFFF26] bg-white/[0.04] py-[3px] pr-2 pl-[7px] text-[12px] text-white/70 leading-none"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" className="size-[11px] shrink-0">
          {platformIcons[platform]}
        </svg>
        {platform}
      </li>
    ))}
  </ul>
)

// The install command on one line, as a terminal shows it. A long one (Kara
// with its peers, Airgap with its chain) scrolls sideways and fades out at the
// edge instead of wrapping, so it still reads as one command to paste; the copy
// button takes all of it either way. A pill, so its corners run round the copy
// button's at the same 8px all the way.
const ShotInstall: FC<{command: string}> = ({command}) => (
  <div className="flex items-center gap-2 rounded-full border-[0.75px] border-[#FFFFFF26] bg-white/[0.04] py-2 pr-2 pl-[18px]">
    <code className="min-w-0 flex-1 overflow-x-auto whitespace-nowrap font-mono text-[13px] text-white/80 leading-[20px] [scrollbar-width:none] [mask-image:linear-gradient(to_right,black_calc(100%-20px),transparent)] [&::-webkit-scrollbar]:hidden">
      <span aria-hidden="true" className="select-none text-white/35">
        {'$ '}
      </span>
      {command}
    </code>
    <CopyButton value={command} label="Copy install command" size="sm" />
  </div>
)

const ShotRow: FC<{name: string; children: ReactNode}> = ({name, children}) => (
  <div className="flex flex-row items-center py-6">
    <div className="flex-1">
      <span className="text-[14px] md:text-[15px] font-normal tracking-normal align-middle text-white/50 leading-[100%]">
        {name}
      </span>
    </div>
    <div>{children}</div>
  </div>
)

const ShotProperty: FC<EntryShotProperty> = ({name, value, url}) => (
  <ShotRow name={name}>
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
  </ShotRow>
)

export const ShotDetail: FC<ShotDetailProps> = ({
  properties,
  title,
  description,
  install,
  platforms,
  image,
  videos,
  size,
}) => (
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
      {/* With the description, apart from the links: the gap under it and the
          first row's padding make the 48px the description has above the links
          on a card without a command. */}
      {install && (
        <div data-reveal className="mb-[24px]">
          <ShotInstall command={install} />
        </div>
      )}
      <div>
        {platforms && (
          <div data-reveal>
            <ShotRow name="Platforms">
              <ShotPlatforms platforms={platforms} />
            </ShotRow>
            <div className="h-[1px] w-full bg-white/15" />
          </div>
        )}
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
