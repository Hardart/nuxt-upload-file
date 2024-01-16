import { defaultWindow, isClient } from '@vueuse/core'
import { setNewPoint, startPoint } from '~/utils/dragPoint'
import { toTransformString } from '~/utils/helpers'
type PointerType = 'mouse' | 'touch' | 'pen'
type MaybeEl = MaybeRefOrGetter<HTMLElement | undefined>

interface DragOptions {
  container?: MaybeEl
  targetOverlay?: MaybeEl
}

export const useDrag = (target: MaybeEl, options: DragOptions = {}) => {
  const { container, targetOverlay } = options
  const position = ref<Point>({ x: 0, y: 0 })
  const pressedDelta = ref<Point>()

  const start = (e: PointerEvent) => {
    if (e.target !== toValue(target)) return
    pressedDelta.value = eventPositionToPoint(e, { x: 0, y: 0 })
    updateStartPoints()
  }

  const move = (e: PointerEvent) => {
    if (!pressedDelta.value) return
    eventPositionToPoint(e, p1)
    // setNewPoint()
    const x = p1.value.x - pressedDelta.value.x
    const y = p1.value.y - pressedDelta.value.y
    pressedDelta.value.x = p1.value.x
    pressedDelta.value.y = p1.value.y
    // updatePrevPoints()
    position.value.x += x
    position.value.y += y
  }

  const end = (e: PointerEvent) => {
    if (!pressedDelta.value) return

    pressedDelta.value = undefined
  }

  if (isClient) {
    const config = { capture: true }
    // useEventListener(targetOverlay, 'pointerdown', start, config)
    useEventListener(target, 'pointerdown', start, config)
    useEventListener(defaultWindow, 'pointermove', move, config)
    useEventListener(defaultWindow, 'pointerup', end, config)
  }

  const getPoint = (e: PointerEvent, targetRect: DOMRect, axis: Axis) => e[axis == 'x' ? 'clientX' : 'clientY'] - targetRect[axis == 'x' ? 'left' : 'top']

  return {
    style: computed(() => toTransformString(position.value.x, position.value.y)),
  }
}
