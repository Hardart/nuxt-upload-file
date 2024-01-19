const maxBoundValue = ref<Point>({ x: 0, y: 0 })
const minBoundValue = ref<Point>({ x: 0, y: 0 })

export function updateBounds(imageRect: MaybeRef<ElementSize>, panRect: MaybeRef<ElementSize>) {
  imageRect = toValue(imageRect)
  panRect = toValue(panRect)

  updateAxis('x', imageRect.width, panRect.width)
  updateAxis('y', imageRect.height, panRect.height)
}

export function correctPanBounds(position: Ref<Point>) {
  const x = correctPan('x', toValue(position).x)
  const y = correctPan('y', toValue(position).y)
  position.value = { x, y }
}

function correctPan(axis: Axis, panOffset: number) {
  return clamp(panOffset, maxBoundValue.value[axis], minBoundValue.value[axis])
}

function updateAxis(axis: Axis, sizeValue: number, panAreaSize: number) {
  maxBoundValue.value[axis] = sizeValue > panAreaSize ? Math.round((panAreaSize - sizeValue) / 2) : 0
  minBoundValue.value[axis] = sizeValue > panAreaSize ? Math.round((panAreaSize - sizeValue) / 2) * -1 : 0
}
