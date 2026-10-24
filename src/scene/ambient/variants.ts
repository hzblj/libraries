export type AmbientVariant = 'shot' | 'cv'

type Variant = {
  vignettes: readonly [string, string]
}

export const AMBIENT_VARIANTS: Record<AmbientVariant, Variant> = {
  cv: {
    vignettes: [
      'bg-[radial-gradient(52%_60%_at_50%_50%,rgba(0,0,0,0.86)_0%,transparent_82%)]',
      'bg-[radial-gradient(92%_80%_at_50%_45%,transparent_38%,rgba(0,0,0,0.6)_100%)]',
    ],
  },
  shot: {
    vignettes: [
      'bg-[radial-gradient(46%_38%_at_50%_50%,rgba(0,0,0,0.8)_0%,transparent_80%)]',
      'bg-[radial-gradient(88%_74%_at_50%_45%,transparent_34%,rgba(0,0,0,0.62)_100%)]',
    ],
  },
}

export const variantOfPath = (pathname: string): AmbientVariant => (pathname === '/cv' ? 'cv' : 'shot')
