import type {FC, ReactNode} from 'react'

/**
 * Where an open card's controls live on a phone: one cluster, centred on the
 * bottom edge, within a thumb's reach. The top corners are not — a card fills
 * the screen on a phone, and reaching over it to dismiss it means letting go of
 * the device.
 *
 * On a desktop the cluster dissolves. `contents` leaves no box behind, so each
 * control falls back to the corner it owns — the close button is not rendered at
 * all there, and the expand pill goes back to the top right, where it lines up
 * with the collapse pill on the page it expands into.
 *
 * Layout only: nothing here fades. The controls inside are tweened one by one,
 * on the same curve as the backdrop — and an opacity set here would not reach
 * them anyway, since `contents` generates nothing to apply it to.
 */
export const ModalControlsDock: FC<{children: ReactNode}> = ({children}) => (
  <div className="fixed inset-x-0 bottom-6 z-[999] flex items-center justify-center gap-3 md:contents">{children}</div>
)
