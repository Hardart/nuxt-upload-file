export {}

import type { Gestures, Slide } from '#imports'

declare global {
  type Gestures = Gestures
  type Slide = Slide

  type Point = {
    x: number
    y: number
    id?: string | number | undefined
  }

  type ElementSize = {
    width: number
    height: number
  }

  type ElementRect = ElementSize & Omit<Point, 'id'>

  type Axis = 'x' | 'y'

  type ElementProps =
    | ElementSize
    | {
        name: 'width' | 'height' | 'left' | 'right'
        value: number
      }

  interface SpringAnimationProps {
    name: string
    start: number
    end: number
    velocity: number
    dampingRatio: number
    naturalFrequency?: number
    isPan: boolean
    onUpdate: (end: number) => void
    onComplete?: () => void
    onFinish?: () => {}
  }
}
