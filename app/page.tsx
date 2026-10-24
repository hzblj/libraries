import {Suspense} from 'react'

import {LibrariesJsonLd, LibrariesNoScript} from '@/components/libraries-seo'
import {IntroProvider, SoundProvider} from '@/providers'
import {NavigationProvider} from '@/providers/NavigationProvider'
import {Scene} from '@/scene'

// The scene only renders in the browser. Behind its own boundary, so that
// bailing out to the client takes the scene alone and the structured data and
// the text version still arrive in the server's HTML.
export default function Home() {
  return (
    <>
      <LibrariesJsonLd />
      <LibrariesNoScript />
      <Suspense fallback={null}>
        <NavigationProvider>
          <SoundProvider>
            <IntroProvider>
              <div id="main" className="relative block h-full w-full bg-black">
                <Scene />
              </div>
            </IntroProvider>
          </SoundProvider>
        </NavigationProvider>
      </Suspense>
    </>
  )
}
