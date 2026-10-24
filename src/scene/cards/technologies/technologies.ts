import {INK, INK_BLUE, type TextStyle} from '../../graphics'

export const WIDTH = 596
export const HEIGHT = 218
export const GAP = 43.33
export const ICON = {height: 84, width: 96}
export const COLUMN_HEIGHT = ICON.height + 12 + 14
export const TOP = (HEIGHT - COLUMN_HEIGHT) / 2
export const LIFT_EASE = 'cubic-bezier(0.22, 1, 0.36, 1)'

export const TECHNOLOGIES = [
  {image: '/svg/react-native.svg', ink: INK_BLUE, title: 'React Native', url: 'https://reactnative.dev'},
  {image: '/svg/expo.svg', ink: INK, title: 'Expo', url: 'https://expo.dev'},
  {image: '/svg/react.svg', ink: INK_BLUE, title: 'React', url: 'https://react.dev'},
  {image: '/svg/next-js.svg', ink: INK, title: 'Next.js', url: 'https://nextjs.org'},
] as const

export type Technology = (typeof TECHNOLOGIES)[number]

export const titleStyle = (ink: readonly [string, string]): TextStyle => ({
  gradient: ink,
  lineHeight: 14,
  shadow: true,
  size: 14,
})
