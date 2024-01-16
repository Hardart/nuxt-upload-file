import { zeroPoint } from './dragPoint'

const center = ref<Point>(zeroPoint)
const max = ref<Point>(zeroPoint)
const min = ref<Point>(zeroPoint)

function updateAxis(axis: Axis, sizeValue: number, panAreaSize: number) {
  center.value[axis] = 0

  // maximum pan position
  max.value[axis] = sizeValue > panAreaSize ? Math.round((panAreaSize - sizeValue) / 2) : 0

  // minimum pan position
  min.value[axis] = sizeValue > panAreaSize ? Math.round((panAreaSize - sizeValue) / 2) * -1 : 0
}

export function updateBounds(image: MaybeEl, panArea: MaybeEl) {
  // if (!this.image.elementRect.width) return this.reset()
  const imageRect = toValue(image)!.getBoundingClientRect()
  const panAreaRect = toValue(panArea)!.getBoundingClientRect()

  updateAxis('x', imageRect.width, panAreaRect.width)
  updateAxis('y', imageRect.height, panAreaRect.height)
}

export function correctPan(axis: Axis, panOffset: number) {
  return clamp(panOffset, max.value[axis], min.value[axis])
}
