'use client'

import gsap from 'gsap'
import {ScrollTrigger} from 'gsap/ScrollTrigger'
import {FC, ReactNode, type RefObject, useLayoutEffect, useRef} from 'react'

import {CVPosition, CVSection, CVSectionLink, CVSectionProject, cv} from '@/db'
import {cn, findScroller} from '@/utils'

import {LinkExternal} from './link-external'
import {SplitWords, WORD_SELECTOR} from './split-words'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

const SectionLeft: FC<{year: string}> = ({year}) => (
  <div className="w-[88px] h-[17px] flex-shrink-0">
    <span data-cv-reveal="true" className="block font-normal text-[14px] leading-[100%] tracking-[0px] text-white/40">
      <SplitWords>{year}</SplitWords>
    </span>
  </div>
)

const Dot = () => <div className="w-[4px] h-[4px] bg-white/20 rounded-full" />
const Line = () => <div className="w-[1.5px] h-[18.75px] bg-white/15 rounded-[2px]" />

const Segments: FC<Pick<CVSection, 'positions'>> = ({positions}) => {
  if (positions.length - 1 === 0) {
    return null
  }

  return (
    // Revealed with the positions it runs alongside. Left out of the reveal it
    // sat there fully drawn next to labels that had not arrived yet, which read
    // as broken rather than as a rail waiting to be filled. One node, not one
    // per dot: sliding a dotted rail in piece by piece draws the eye to the
    // rail, and the rail is not the content.
    <div
      data-cv-reveal="true"
      className="absolute left-[-13px] top-[7px] flex flex-col items-center justify-center gap-[2px]"
    >
      {positions.map((_, index) => (
        <div key={index.toString()} className="flex flex-col items-center justify-center gap-[2px]">
          <Dot />
          {index !== positions.length - 1 && <Line />}
        </div>
      ))}
    </div>
  )
}

const variant: Record<'active' | 'inactive', string> = {
  active: 'text-white',
  inactive: 'text-white/60',
}

const PositionLabel: FC<CVPosition & {className?: string}> = ({title, company, url, className}) => {
  const label = company ? `${title} at ` : title

  if (company && url) {
    return (
      <span className={className}>
        <SplitWords>{label}</SplitWords>
        <LinkExternal url={url} variant="muted">
          <span className={className}>
            <SplitWords>{company}</SplitWords>
          </span>
        </LinkExternal>
      </span>
    )
  }

  if (company) {
    return (
      <span className={className}>
        <SplitWords>{`${label}${company}`}</SplitWords>
      </span>
    )
  }

  return (
    <span className={className}>
      <SplitWords>{title}</SplitWords>
    </span>
  )
}

const SectionPositions: FC<Pick<CVSection, 'positions'>> = props => (
  <div className="flex flex-col flex-shrink-0 h-full gap-[10px] relative">
    <Segments positions={props.positions} />
    {props.positions.map((position, index) => (
      <div key={index.toString()} data-cv-reveal="true" className="h-[17px]">
        <PositionLabel
          {...position}
          className={cn(
            'font-normal text-[14px] leading-[100%] tracking-[0px]',
            variant[index === 0 ? 'active' : 'inactive']
          )}
        />
      </div>
    ))}
  </div>
)

const SectionLocation: FC<Pick<CVSection, 'location'>> = props => {
  if (!props.location) {
    return null
  }

  return (
    <div>
      <span
        data-cv-reveal="true"
        className="block font-normal text-[14px] leading-[100%] tracking-[0px] text-white/60 h-[17px]"
      >
        <SplitWords>{props.location}</SplitWords>
      </span>
    </div>
  )
}

const SectionTechnologies: FC<Pick<CVSection, 'technologies'> & {className?: string}> = props => {
  if (!props.technologies || props.technologies.length === 0) {
    return null
  }

  return (
    <div>
      <span
        data-cv-reveal="true"
        className={cn(
          'block font-normal text-[14px] leading-[100%] tracking-[0px] text-white/50 h-[17px]',
          props.className
        )}
      >
        <SplitWords>{props.technologies.join(', ')}</SplitWords>
      </span>
    </div>
  )
}

const SectionParagraph: FC<{children: string}> = ({children}) => (
  <p className="block font-normal text-[14px] leading-[22px] tracking-[0px] text-white/50">
    <SplitWords>{children}</SplitWords>
  </p>
)

const SectionLink: FC<CVSectionLink> = ({name, url}) => (
  <div>
    <a
      href={url}
      target="_blank"
      data-cv-reveal="true"
      className="block font-normal text-[14px] leading-[22px] tracking-[0px] text-white/50 underline decoration-white/20 decoration-[1.5px] underline-offset-4 hover:decoration-white/40 transition-colors duration-500 ease-out"
      rel="noopener"
    >
      {name}
    </a>
  </div>
)

const SectionLinks: FC<Pick<CVSection, 'links'>> = ({links}) => {
  if (!links || links.length === 0) {
    return null
  }

  return (
    <div className="flex flex-col gap-[24px] pt-[24px]">
      {links.map((link, index) => (
        <SectionLink key={index.toString()} {...link} />
      ))}
    </div>
  )
}

const SectionTitle: FC<Pick<CVSection, 'positions' | 'location' | 'technologies'>> = ({
  positions,
  location,
  technologies,
}) => (
  <div className="flex flex-col gap-[6px] pb-[24px]">
    <SectionPositions positions={positions} />
    <SectionLocation location={location} />
    <SectionTechnologies technologies={technologies} />
  </div>
)

const SectionProject: FC<CVSectionProject> = ({name, position, technologies, paragraphs, url}) => (
  <div>
    <div className="flex flex-col gap-[8px] pb-[24px]">
      <div>
        <a
          href={url}
          target="_blank"
          data-cv-reveal="true"
          className="block font-normal text-[14px] leading-[22px] tracking-[0px] text-white/80 h-[22px] underline decoration-white/20 decoration-[1.5px] underline-offset-4 hover:decoration-white/40 transition-colors duration-300 ease-in-out"
          rel="noopener"
        >
          {name}
        </a>
      </div>
      <div>
        <span
          data-cv-reveal="true"
          className="block font-normal text-[14px] leading-[100%] tracking-[0px] text-white/60 h-[17px]"
        >
          <SplitWords>{position}</SplitWords>
        </span>
      </div>
      <div>
        <SectionTechnologies technologies={technologies} />
      </div>
    </div>
    <div className="flex flex-col gap-[24px]">
      {paragraphs.map((paragraph, index) => (
        <div key={index.toString()} data-cv-reveal="true">
          <SectionParagraph>{paragraph}</SectionParagraph>
        </div>
      ))}
    </div>
  </div>
)

const SectionProjects: FC<Pick<CVSection, 'projects'>> = ({projects}) => {
  if (!projects || projects?.length === 0) {
    return null
  }

  return (
    <div>
      <div className="py-[24px]">
        <span
          data-cv-reveal="true"
          className="block font-normal text-[14px] leading-[22px] tracking-[0px] text-white h-[22px]"
        >
          <SplitWords>Projects</SplitWords>
        </span>
      </div>
      <div className="flex flex-col gap-[24px]">
        {projects.map((project, index) => (
          <SectionProject key={index.toString()} {...project} />
        ))}
      </div>
    </div>
  )
}

const SectionRight: FC<Omit<CVSection, 'year'>> = ({
  paragraphs,
  positions,
  location,
  technologies,
  projects,
  links,
}) => (
  <div>
    <SectionTitle positions={positions} location={location} technologies={technologies} />
    <div className="flex flex-col gap-[24px]">
      {paragraphs.map((paragraph, index) => (
        <div key={index.toString()} data-cv-reveal="true">
          <SectionParagraph>{paragraph}</SectionParagraph>
        </div>
      ))}
    </div>
    <SectionProjects projects={projects} />
    <SectionLinks links={links} />
  </div>
)

const Section = ({year, ...props}: CVSection) => (
  <div className="flex flex-col md:flex-row w-full items-start gap-[24px] md:gap-[44px]" data-cv-section="true">
    <SectionLeft year={year} />
    <SectionRight {...props} />
  </div>
)

const GRADIENT_INK = 'bg-[linear-gradient(180deg,#ffffff_0%,rgba(255,255,255,0.72)_100%)] bg-clip-text text-transparent'

const GradientText: FC<{children: string}> = ({children}) => (
  <span className="text-[14px] font-normal tracking-[0px] drop-shadow-[0_0_2px_rgba(0,0,0,0.25)]">
    <SplitWords className={GRADIENT_INK}>{children}</SplitWords>
  </span>
)

const SectionItem: FC<{name?: string; url?: string; type: string}> = ({name = '', url, type}) => {
  return (
    <div data-cv-reveal="true" className="flex items-center">
      <span className="block font-normal text-[14px] leading-[100%] tracking-[0px] text-white/40 w-[70.37px] mr-[35.98px]">
        <SplitWords>{type}</SplitWords>
      </span>
      {url ? (
        <LinkExternal url={url}>
          <GradientText>{name}</GradientText>
        </LinkExternal>
      ) : (
        <GradientText>{name}</GradientText>
      )}
    </div>
  )
}

const SectionConnect: FC = () => (
  <div className="flex flex-col gap-[19.19px]">
    {cv.connect.map(connect => (
      <SectionItem key={connect.type} {...connect} />
    ))}
  </div>
)

const SectionLanguagesAndLocations: FC = () => (
  <div className="flex flex-row gap-[51px] flex-wrap">
    <div className="flex flex-col gap-[56px]">
      <div className="h-[17px]">
        <h1 data-cv-reveal="true" className="block font-normal text-[14px] leading-[100%] tracking-[0px] text-white">
          <SplitWords>Languages</SplitWords>
        </h1>
      </div>
      <div className="flex flex-col gap-[19.19px]">
        <SectionItem type="Native" name="Czech" />
        <SectionItem type="B2" name="English" />
      </div>
    </div>
    <div className="flex flex-1" />
    <div className="flex flex-col gap-[56px]">
      <div className="h-[17px]">
        <h1 data-cv-reveal="true" className="block font-normal text-[14px] leading-[100%] tracking-[0px] text-white">
          <SplitWords>Locations</SplitWords>
        </h1>
      </div>
      <div className="flex flex-col gap-[19.19px]">
        <SectionItem type="Based in" name="Prague, Czechia" />
        <SectionItem type="Raised in" name="Ostrava, Czechia" />
      </div>
    </div>
  </div>
)

type RevealOptions = {
  root: RefObject<HTMLElement | null>
  enable?: boolean
  skipIntro?: boolean
}

const NODE_SELECTOR = '[data-cv-reveal]'

/** Fraction of the viewport a line has to reach before it reveals. */
const REVEAL_LINE = 0.92
const NODE_STAGGER = 0.05
const INTRO_STAGGER = 0.055

const HIDDEN = {autoAlpha: 0, filter: 'blur(6px)', y: 10}
const SHOWN = {autoAlpha: 1, clearProps: 'filter,transform', filter: 'blur(0px)', y: 0}
const REVEAL = {...SHOWN, duration: 0.6, ease: 'quart.out'}
const WORD_HIDDEN = {opacity: 0, y: 10}
const WORD_SHOWN = {clearProps: 'opacity,transform', opacity: 1, y: 0}
const WORD_REVEAL = {...WORD_SHOWN, duration: 0.6, ease: 'quart.out', force3D: true}
const WORD_STAGGER = 0.06
const WORDS_SPAN = 0.45

const wordsOf = (node: HTMLElement) => gsap.utils.toArray<HTMLElement>(node.querySelectorAll(WORD_SELECTOR))

const hideNode = (node: HTMLElement) => {
  const words = wordsOf(node)

  if (words.length === 0) {
    gsap.set(node, HIDDEN)
    return
  }

  gsap.set(node, {autoAlpha: 0, filter: 'blur(6px)'})
}

const revealNode = (node: HTMLElement, delay: number) => {
  const words = wordsOf(node)

  if (words.length === 0) {
    gsap.to(node, {...REVEAL, delay, overwrite: 'auto'})
    return
  }

  const stagger = Math.min(WORD_STAGGER, WORDS_SPAN / words.length)
  const sweep = stagger * (words.length - 1)

  gsap.to(node, {...SHOWN, delay, duration: 0.5 + sweep, ease: 'power2.out', overwrite: 'auto'})
  gsap.fromTo(words, WORD_HIDDEN, {...WORD_REVEAL, delay, overwrite: 'auto', stagger})
}

const showNode = (node: HTMLElement) => {
  const words = wordsOf(node)
  gsap.set(node, SHOWN)

  if (words.length > 0) {
    gsap.set(words, {clearProps: 'opacity,transform'})
  }
}

export const showCvRevealed = (root: HTMLElement | null) => {
  for (const node of root ? gsap.utils.toArray<HTMLElement>(root.querySelectorAll(NODE_SELECTOR)) : []) {
    gsap.killTweensOf([node, ...wordsOf(node)])
    showNode(node)
  }
}

/**
 * Reveals the CV line by line, as each line arrives.
 *
 * It used to chain every section onto one timeline that started at mount. With
 * this much CV that timeline runs the best part of a minute, so scrolling down
 * landed you on lines still queued behind the ones above — reading exactly like
 * content loading in slowly, when it was already there and nothing was waiting
 * on the scroll at all.
 *
 * Per-line triggers, then. `batch` is what keeps that from turning into sixty
 * separate pops: it collects the lines that cross the line together and gives
 * them one staggered wave, so a screenful arrives in sequence while the
 * sequence itself is still driven by where you have scrolled to.
 *
 * The first screenful is handled apart from it. Everything up there is already
 * past the reveal line on arrival, so `batch` would take it as one wave and
 * drop the whole top of the page in at once — the opposite of the point. It
 * gets its own staggered wave instead, and the batching starts below the fold.
 */
const useCvSequentialReveal = ({root, enable = true, skipIntro = false}: RevealOptions) => {
  useLayoutEffect(() => {
    if (!enable || !root.current) {
      return
    }

    const scroller = findScroller(root.current)

    const ctx = gsap.context(() => {
      const nodes = gsap.utils.toArray<HTMLElement>(NODE_SELECTOR)

      if (!nodes.length) {
        return
      }

      // Both rects are viewport-relative, so this works the same whether the
      // scrolling thing is a container part-way down the screen or the document.
      const bounds = scroller?.getBoundingClientRect()
      const fold = (bounds?.top ?? 0) + (scroller?.clientHeight ?? window.innerHeight)

      const onScreen: HTMLElement[] = []
      const belowFold: HTMLElement[] = []

      nodes.forEach(node => {
        ;(node.getBoundingClientRect().top < fold ? onScreen : belowFold).push(node)
      })

      if (!skipIntro) {
        onScreen.forEach(hideNode)
        onScreen.forEach((node, index) => revealNode(node, index * INTRO_STAGGER))
      }

      if (!belowFold.length) {
        return
      }

      belowFold.forEach(hideNode)

      ScrollTrigger.batch(belowFold, {
        // Caps how long one wave can run: without it, a dense screenful would
        // trail on well after you had scrolled past it.
        batchMax: 8,
        interval: 0.08,
        // A line that has arrived has arrived — replaying it on the way back up
        // would fight the reader.
        once: true,
        onEnter: batch => {
          batch.forEach((node, index) => revealNode(node as HTMLElement, index * NODE_STAGGER))
        },
        scroller,
        start: `top ${REVEAL_LINE * 100}%`,
      })
    }, root)

    return () => ctx.revert()
  }, [root, enable, skipIntro])
}

export type CVProps = {
  children?: ReactNode
  animated?: boolean
  /** Restored rather than opened: show the first screen without replaying it. */
  instant?: boolean
}

export const CV: FC<CVProps> = ({children, animated = false, instant = false}) => {
  const ref = useRef<HTMLDivElement>(null)

  const workExperience = cv.workExperience
  const sideProjects = cv.sideProjects
  const education = cv.education

  useCvSequentialReveal({enable: animated, root: ref, skipIntro: instant})

  return (
    <div className="h-full w-full flex flex-col max-w-[572px]">
      <div ref={ref} className="w-full h-full flex flex-col gap-[44px] md:gap-[56px]">
        <div data-reveal="true" className="h-[17px]">
          <h1 data-cv-reveal="true" className="block font-normal text-[14px] leading-[100%] tracking-[0px] text-white">
            <SplitWords>Work Experience</SplitWords>
          </h1>
        </div>

        <div className="flex flex-col gap-[56px]">
          {workExperience.map((section, index) => (
            <div key={index.toString()} data-reveal="true" className="flex flex-col w-full">
              <Section {...section} />
            </div>
          ))}
        </div>

        <div data-reveal="true" className="flex flex-col gap-[56px]">
          <div className="h-[17px]">
            <h1
              data-cv-reveal="true"
              className="block font-normal text-[14px] leading-[100%] tracking-[0px] text-white"
            >
              <SplitWords>Side Projects</SplitWords>
            </h1>
          </div>
          {sideProjects.map((section, index) => (
            <div key={index.toString()} className="flex flex-col w-full">
              <Section {...section} />
            </div>
          ))}
        </div>

        <div data-reveal="true" className="flex flex-col gap-[56px]">
          <div className="h-[17px]">
            <h1
              data-cv-reveal="true"
              className="block font-normal text-[14px] leading-[100%] tracking-[0px] text-white"
            >
              <SplitWords>Education</SplitWords>
            </h1>
          </div>
          {education.map((section, index) => (
            <div key={index.toString()} className="flex flex-col w-full">
              <Section {...section} />
            </div>
          ))}
        </div>

        <div data-reveal="true" className="flex flex-col gap-[56px]">
          <div className="h-[17px]">
            <h1
              data-cv-reveal="true"
              className="block font-normal text-[14px] leading-[100%] tracking-[0px] text-white"
            >
              <SplitWords>Connect</SplitWords>
            </h1>
          </div>
          <SectionConnect />
        </div>

        <div data-reveal="true">
          <SectionLanguagesAndLocations />
        </div>

        <div data-cv-section="true" data-reveal="true" className="flex justify-center">
          <LinkExternal url="/pdf/cv.pdf">
            <span data-cv-reveal="true" className="inline-block">
              <GradientText>Download CV in PDF</GradientText>
            </span>
          </LinkExternal>
        </div>

        {children && children}
      </div>
    </div>
  )
}
