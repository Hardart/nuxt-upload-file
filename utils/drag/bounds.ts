const maxBoundValue = ref<Point>({ x: 0, y: 0 })
const minBoundValue = ref<Point>({ x: 0, y: 0 })

export function updateBounds(imageRect: MaybeRef<ElementRect>, panRect: MaybeRef<ElementSize>) {
  imageRect = toValue(imageRect)
  panRect = toValue(panRect)

  updateAxis('x', imageRect.width, panRect.width)
  updateAxis('y', imageRect.height, panRect.height)
}

export function correctPanBounds(rect: MaybeRef<ElementRect>) {
  rect = toValue(rect)
  rect.x = correctPan('x', rect.x)
  rect.y = correctPan('y', rect.y)
}

function correctPan(axis: Axis, panOffset: number) {
  return clamp(panOffset, maxBoundValue.value[axis], minBoundValue.value[axis])
}

function updateAxis(axis: Axis, sizeValue: number, panAreaSize: number) {
  maxBoundValue.value[axis] = sizeValue > panAreaSize ? (panAreaSize - sizeValue) / 2 : 0
  minBoundValue.value[axis] = sizeValue > panAreaSize ? ((panAreaSize - sizeValue) / 2) * -1 : 0
}
