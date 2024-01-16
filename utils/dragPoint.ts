const zeroPoint: Point = { x: 0, y: 0 }

export const p1 = ref(zeroPoint)
const p2 = ref(zeroPoint)
export const prevP1 = ref(zeroPoint)
const prevP2 = ref(zeroPoint)

export function equalizePoints(p1: Ref<Point> | Point, p2: Ref<Point> | Point) {
  p1 = toValue(p1)
  p2 = toValue(p2)
  p1.x = p2.x
  p1.y = p2.y
  if (p2.id !== undefined) p1.id = p2.id

  return p1
}

export function isPointsEqual(p1: Point, p2: Point) {
  return p1.x === p2.x && p1.y === p2.y
}

export function eventPositionToPoint(e: Touch | PointerEvent, p: Ref<Point> | Point) {
  p = toValue(p)
  p.x = e.pageX
  p.y = e.pageY

  if ('pointerId' in e) p.id = e.pointerId
  else if (e.identifier !== undefined) p.id = e.identifier

  return p
}

function updatePrevPoints() {
  equalizePoints(prevP1, p1)
  // equalizePoints(prevP2, p2)
}

export function getDelta() {
  const x = p1.value.x - prevP1.value.x
  const y = p1.value.y - prevP1.value.y
  updatePrevPoints()
  return { x, y }
}
