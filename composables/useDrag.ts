import { defaultWindow, isClient } from '@vueuse/core'
import { toTransformString } from '~/utils/helpers'
type PointerType = 'mouse' | 'touch' | 'pen'
type MaybeEl = MaybeRefOrGetter<HTMLElement | SVGElement | null | undefined>
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
    const containerElement = toValue(container)
    const containerRect = containerElement?.getBoundingClientRect()
    const targetRect = toValue(target)!.getBoundingClientRect()

    const pos = {
      x: e.clientX - (containerElement ? targetRect.left - containerRect!.left + containerElement.scrollLeft : targetRect.left),
      y: e.clientY - (containerElement ? targetRect.top - containerRect!.top + containerElement.scrollTop : targetRect.top),
    }

    pressedDelta.value = pos
  }

  const move = (e: PointerEvent) => {
    if (!pressedDelta.value) return
    const targetRect = toValue(target)!.getBoundingClientRect()
    let { x, y } = position.value
    x = e.clientX - pressedDelta.value.x
    y = e.clientY - pressedDelta.value.y
    position.value = { x, y }
  }

  const end = (e: PointerEvent) => {
    if (!pressedDelta.value) return
    pressedDelta.value = undefined
  }

  if (isClient) {
    const config = { capture: true }
    useEventListener(targetOverlay, 'pointerdown', start, config)
    useEventListener(target, 'pointerdown', start, config)
    useEventListener(defaultWindow, 'pointermove', move, config)
    useEventListener(defaultWindow, 'pointerup', end, config)
  }

  const getPoint = (e: PointerEvent, targetRect: DOMRect, axis: Axis) =>
    e[axis == 'x' ? 'clientX' : 'clientY'] - targetRect[axis == 'x' ? 'left' : 'top']

  return {
    style: computed(() => toTransformString(position.value.x, position.value.y)),
  }
}
