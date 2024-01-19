import { defaultWindow, isClient } from '@vueuse/core'
import { p1, prevP1, eventPositionToPoint, getDelta } from '~/utils/drag/point'
import { updateBounds, correctPanBounds } from '~/utils/drag/bounds'

export function useTouch(panArea: MaybeRefElement, imageTransform: Ref<Point>, imageRect: Ref<ElementSize>, panRect: Ref<ElementSize>) {
  const delta = { x: 0, y: 0 }
  let isDragging = false

  const start = (e: PointerEvent) => {
    if (e.target !== toValue(panArea)) return
    isDragging = true
    prevP1.value = eventPositionToPoint(e, { x: 0, y: 0 })
    updateBounds(imageRect, panRect)
  }

  const move = (e: PointerEvent) => {
    if (!isDragging) return
    eventPositionToPoint(e, p1)
    setPositionOnMove(imageTransform)
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
}

export function setPositionOnMove(imageTransform: Ref<Point>) {
  const { x, y } = getDelta()
  imageTransform.value.x += x
  imageTransform.value.y += y
  correctPanBounds(imageTransform)
}
