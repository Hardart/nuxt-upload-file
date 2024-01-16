import { defaultWindow, isClient } from '@vueuse/core'

interface IDragOptions {}

export const useDrag = (panArea: MaybeEl, imageElement: MaybeEl) => {
  const position = ref<Point>({ x: 0, y: 0 })
  const delta = { x: 0, y: 0 }
  let isDragging = false

  const start = (e: PointerEvent) => {
    if (e.target !== toValue(panArea)) return
    prevP1.value = eventPositionToPoint(e, { x: 0, y: 0 })
    isDragging = true
    updateBounds(imageElement, panArea)
  }

  const move = (e: PointerEvent) => {
    if (!isDragging) return
    eventPositionToPoint(e, p1)

    const { x, y } = getDelta()

    delta.x += x
    delta.y += y
    correctPanBounds(delta, position)
  }

  const end = (e: PointerEvent) => {
    if (!isDragging) return
    isDragging = false
  }

  if (isClient) {
    const config = { capture: true }
    useEventListener(panArea, 'pointerdown', start, config)
    useEventListener(defaultWindow, 'pointermove', move, config)
    useEventListener(defaultWindow, 'pointerup', end, config)
  }

  return {
    style: computed(() => toTransformString(position.value.x, position.value.y)),
  }
}
