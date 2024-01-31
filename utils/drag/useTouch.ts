import { defaultWindow, isClient } from '@vueuse/core'
import { p1, prevP1, eventPositionToPoint, getDelta, roundPoint } from '~/utils/drag/point'
import { updateBounds, correctPanBounds } from '~/utils/drag/bounds'

export function useTouch(panArea: MaybeRefElement, imageRect: Ref<ElementRect>, panRect: Ref<ElementSize>) {
  let isDragging = false
  let isMultitouch = false

  const start = (e: PointerEvent) => {
    if (e.target !== toValue(panArea)) return
    isDragging = true
    prevP1.value = eventPositionToPoint(e, { x: 0, y: 0 })
    updateBounds(imageRect, panRect)
  }

  const move = (e: PointerEvent) => {
    if (!isDragging) return
    eventPositionToPoint(e, p1)
    setPositionOnMove(imageRect)
  }

  const end = (e: PointerEvent) => {
    if (!isDragging) return
    isDragging = false
  }

  const config = { capture: true }
  useEventListener(panArea, 'pointerdown', start, config)
  useEventListener(defaultWindow, 'pointermove', move, config)
  useEventListener(defaultWindow, 'pointerup', end, config)
}

export function setPositionOnMove(rect: MaybeRef<ElementRect>) {
  const { x, y } = getDelta()
  rect = toValue(rect)
  rect.x += x
  rect.y += y
  correctPanBounds(rect)
}
