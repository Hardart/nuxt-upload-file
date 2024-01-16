const center = ref<Point>({ x: 0, y: 0 })
const maxBoundValue = ref<Point>({ x: 0, y: 0 })
const minBoundValue = ref<Point>({ x: 0, y: 0 })

export function updateBounds(image: MaybeEl, panArea: MaybeEl) {
  // if (!this.image.elementRect.width) return this.reset()
  const imageRect = toValue(image)!.getBoundingClientRect()
  const panAreaRect = toValue(panArea)!.getBoundingClientRect()

  updateAxis('x', imageRect.width, panAreaRect.width)
  updateAxis('y', imageRect.height, panAreaRect.height)
}

export function correctPanBounds(panOffset: Point, position: Ref<Point>) {
  const x = correctPan('x', panOffset.x)
  const y = correctPan('y', panOffset.y)
  position.value = { x, y }
}

function correctPan(axis: Axis, panOffset: number) {
  return clamp(panOffset, maxBoundValue.value[axis], minBoundValue.value[axis])
}

function updateAxis(axis: Axis, sizeValue: number, panAreaSize: number) {
  center.value[axis] = 0

  // maximum pan position
  maxBoundValue.value[axis] = sizeValue > panAreaSize ? Math.round((panAreaSize - sizeValue) / 2) : 0

  // minimum pan position
  minBoundValue.value[axis] = sizeValue > panAreaSize ? Math.round((panAreaSize - sizeValue) / 2) * -1 : 0
}
