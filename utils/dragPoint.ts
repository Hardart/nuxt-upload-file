const zeroPoint: Point = { x: 0, y: 0 }

export const p1 = ref(zeroPoint)
export const startP1 = ref(zeroPoint)
export const prevP1 = ref(zeroPoint)
const p2 = ref(zeroPoint)
const prevP2 = ref(zeroPoint)

export function startPoint() {
  startP1.value.x = p1.value.x
  startP1.value.y = p1.value.y
  if (p1.value.id !== undefined) startP1.value.id = p1.value.id
}

export function equalizePoints(p1: Ref<Point>, p2: Ref<Point>) {
  p1.value.x = p2.value.x
  p1.value.y = p2.value.y
  if (p2.value.id !== undefined) p1.value.id = p2.value.id

  return p1
}

export function isPointsEqual(p1: Point, p2: Point) {
  return p1.x === p2.x && p1.y === p2.y
}

export function roundPoint(p: Point) {
  p.x = Math.round(p.x)
  p.y = Math.round(p.y)
  return p
}

export function eventPositionToPoint(e: Touch | PointerEvent, p: Ref<Point> | Point) {
  p = toValue(p)
  p.x = e.pageX
  p.y = e.pageY

  if ('pointerId' in e) p.id = e.pointerId
  else if (e.identifier !== undefined) p.id = e.identifier

  return p
}

export function updatePrevPoints() {
  equalizePoints(prevP1, p1)
  // equalizePoints(prevP2, p2)
}

export function updateStartPoints() {
  equalizePoints(startP1, p1)
  // equalizePoints(startP2, p2)
  updatePrevPoints()
}

export function setNewPoint() {
  const potentialX = p1.value.x - prevP1.value.x
  console.log(potentialX)
}
