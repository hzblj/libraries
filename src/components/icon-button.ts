// The round pill every floating control is cut from — expand, collapse, close.
// One frosted glass across the site, so they are visibly the same object, and
// one adaptive glass, so they all turn over together when they pass over
// something bright.
//
// Two sizes, because the pill is reached two different ways. On a desktop it
// sits in a corner under a cursor that can hit 44px exactly; on a phone it sits
// at the bottom of the screen under a thumb, which cannot — so it grows to 56,
// comfortably past the 44px floor once a moving hand is holding the device.
//
// The blur does not survive being snapshotted for a view transition — Chrome
// drops the painting of anything carrying a `backdrop-filter` — so the glass is
// rebuilt on `::view-transition-group(card-toggle)` in app.css for the length of
// the morph. Changing the blur here means changing it there too.
export const iconButtonClassName =
  'glass glass-hover inline-flex size-14 md:size-11 cursor-pointer items-center justify-center rounded-full backdrop-blur-xl active:scale-95'

// The glyph inside it, scaled to the pill it sits in so the ring of glass around
// it stays the same weight at both sizes.
export const iconButtonGlyphClassName = 'size-5 md:size-[18px]'

// The corner a floating control takes from `md` up — the same one whether it is
// the expand pill over an open card or the collapse pill on the page that card
// expands into, so crossing between them only turns the arrows round. On a phone
// the expand pill is laid out by [ModalControlsDock] instead, beside the close
// button, so this half stops at the breakpoint.
export const modalControlClassName = 'z-50 md:fixed md:right-8 md:top-8'

// And where a control that has no dock to sit in goes on a phone: the bottom
// centre, the spot the dock puts the close button in. A page is one card deep
// and dismissed the same way an open card is, so the control that takes you out
// of it belongs in the same place — not in a corner two thumb-lengths away.
export const pageControlClassName = `${modalControlClassName} fixed bottom-6 left-1/2 -translate-x-1/2 md:bottom-auto md:left-auto md:translate-x-0`
