# Libraries

A standalone Next.js app for Jan Blazej's open-source collection. The visual system follows the portfolio: Inter, dark translucent surfaces, gradient borders, 16px corners, and expanding cards.

```sh
yarn install
yarn dev          # http://localhost:4400
yarn build
yarn lint         # Biome and TypeScript
```

The grid pans freely, by drag, scroll or touch, as the portfolio does, and stops when only one card's worth of it is left on screen at an edge (`KEEP_VISIBLE` in `src/providers/CameraProvider/const`). Pinch and ctrl+wheel zoom. Cards open keyboard-accessible native dialogs with installation commands and project links. Native UI and haptics are represented by decorative web previews. Reduced-motion preferences disable animations.

The grid is a pinwheel around the profile (`src/scene/grid/layout.ts`): every card is one cell or two by two, so each keeps the 4:3 of the modal's media. A `link` entry (the Portfolio card) looks like the others but opens its URL instead of a dialog.

Card artwork in `public/libraries` is drawn by `artwork/render.mjs` from the pages in `artwork/cards`, photographed by headless Chrome at 2x. The Kara card uses the Kara website's iOS component shots, the App Icons card the example app's icons, and the Zoom Transition clip is composited with ffmpeg from the website's iOS and Android recordings, all read from the kara-ui repository checked out beside this one (`../kara-ui`). The Portfolio card draws the portfolio's grid from its own shots, read the same way from `../portfolio`. Only drawing the artwork again needs them, since what it draws is committed. It needs Google Chrome and ffmpeg:

```sh
yarn artwork          # every card
yarn artwork flags    # one card
```

In development Next keeps its optimized copies of the images in `.next/dev/cache/images`: clear it after drawing a card again, or the old picture stays.

SEO lives in `app/layout.tsx` (metadata, Open Graph, Twitter), `app/robots.ts`, `app/sitemap.ts` and `src/components/libraries-seo.tsx` (JSON-LD and a text version for crawlers that do not run the scene). Every absolute URL comes from `Config.site`. The link preview, `public/png/og-image.png`, is drawn by `artwork/cards/og-image.html` from the cards' stills.

Google Analytics (GA4, `G-VKC9021KN1`, in `src/lib/analytics.ts`) loads on production deployments only: not in `next dev` and not on Vercel's previews. `NEXT_PUBLIC_GA_MEASUREMENT_ID` overrides the ID.

Flag artwork is copied from expo-flags-kit (FlagKit); see artwork/flags/LICENSE. Inter is shared with the existing Kara website.
