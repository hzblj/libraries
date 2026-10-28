# Libraries

A standalone Next.js app for Jan Blazej's open-source collection. The visual system follows the portfolio: Inter, dark translucent surfaces, gradient borders, 16px corners, and expanding cards.

```sh
yarn install
yarn dev          # http://localhost:4400
yarn build
yarn lint         # Biome and TypeScript
```

The grid pans freely, by drag, scroll or touch, as the portfolio does, and stops when only one card's worth of it is left on screen at an edge (`KEEP_VISIBLE` in `src/providers/CameraProvider/const`). Pinch and ctrl+wheel zoom. Cards open keyboard-accessible native dialogs with installation commands and project links. The install command is the one each library's README gives, peers and all, with a copy button, and a library listed on React Native Directory links to its page there (`directory` in `src/db/index.ts`). The platforms, the first row of a library's list, are the ones its native modules and web files cover: iOS and Android for each, the web too for Flags Kit and Zyplot. Native UI and haptics are represented by decorative web previews. Reduced-motion preferences disable animations.

The grid puts the profile in the middle, two columns by one row as on the portfolio, and the collection round it (`src/scene/grid/layout.ts`). Its tile is ten columns wide, so the profile sits a column off the tile's centre and the camera starts on the profile, not the tile: every library is one cell or two by two, so each keeps the 4:3 of the modal's media. A `link` entry (the Portfolio card) looks like the others but opens its URL instead of a dialog. The examples card runs down the left edge, four rows tall over Install Attribution, with a row for every library's example app, each a link to its `apps/example` on GitHub.

Card artwork in `public/libraries` is drawn by `artwork/render.mjs` from the pages in `artwork/cards`, photographed by headless Chrome at 2x. The Kara card uses the Kara website's iOS component shots, the App Icons card the example app's icons, the Native Icons card its icon SVGs, and the Zoom Transition clip is composited with ffmpeg from the website's iOS and Android recordings, all read from the kara-ui repository checked out beside this one (`../kara-ui`). The Portfolio card draws the portfolio's grid from its own shots, read the same way from `../portfolio`, and the Airgap card's QR codes are drawn by `qrcode-generator`, the encoder its example uses, read from `../crypto-airgap`. The Clear Sign card's bytes, sentences and warnings are three of its example's samples as the packages read them, written into the page, and the Install Attribution card's referrer and Apple Ads campaign are its example's samples, written in the same way. The examples card's icons in `public/examples` are the example apps' own, read from their repositories beside this one, or drawn in `artwork/examples` for the examples that have none. Only drawing the artwork again needs them, since what it draws is committed. It needs Google Chrome and ffmpeg:

```sh
yarn artwork          # every card
yarn artwork flags    # one card
```

The icons (`app/favicon.ico` and the PNGs in `public`) are drawn from `artwork/favicon.svg`, an "h" in Kara's orange on a transparent ground, by `yarn favicon`.

In development Next keeps its optimized copies of the images in `.next/dev/cache/images`: clear it after drawing a card again, or the old picture stays.

SEO lives in `app/layout.tsx` (metadata, Open Graph, Twitter), `app/robots.ts`, `app/sitemap.ts` and `src/components/libraries-seo.tsx` (JSON-LD and a text version for crawlers that do not run the scene). Every absolute URL comes from `Config.site`. The link preview, `public/png/og-image.png`, is drawn by `artwork/cards/og-image.html` from the cards' stills.

Google Analytics (GA4, `G-VKC9021KN1`, in `src/lib/analytics.ts`) loads on production deployments only: not in `next dev` and not on Vercel's previews. `NEXT_PUBLIC_GA_MEASUREMENT_ID` overrides the ID.

Flag artwork is copied from expo-flags-kit (FlagKit); see artwork/flags/LICENSE. The Apple and Android marks on the platform pills are Simple Icons' (CC0); they are their owners' trademarks. The PayPal logos are the vector drawables from PayPal's Android SDK (`payment-buttons`, Apache 2.0, see artwork/paypal/LICENSE), converted to SVG; they are PayPal's trademarks. Inter is shared with the existing Kara website.
