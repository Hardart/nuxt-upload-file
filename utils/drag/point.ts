export const p1 = ref({ x: 0, y: 0 })
export const p2 = ref({ x: 0, y: 0 })
export const prevP1 = ref({ x: 0, y: 0 })
export const prevP2 = ref({ x: 0, y: 0 })

export function equalizePoints(p1: MaybeRef<Point>, p2: MaybeRef<Point>) {
  p1 = toValue(p1)
  p2 = toValue(p2)
  p1.x = p2.x
  p1.y = p2.y
  if (p2.id !== undefined) p1.id = p2.id

  return p1
}

export function isPointsEqual(p1: MaybeRef<Point>, p2: MaybeRef<Point>) {
  p1 = toValue(p1)
  p2 = toValue(p2)
  return p1.x === p2.x && p1.y === p2.y
}

export function eventPositionToPoint(e: Touch | PointerEvent, p: MaybeRef<Point>) {
  p = toValue(p)
  p.x = e.pageX
  p.y = e.pageY

  if ('pointerId' in e) p.id = e.pointerId
  else if (e.identifier !== undefined) p.id = e.identifier

  return p
}

export function getDelta() {
  const x = p1.value.x - prevP1.value.x
  const y = p1.value.y - prevP1.value.y
  updatePrevPoints()
  return { x, y }
}

export function roundPoint(rect: MaybeRef<ElementRect>) {
  rect = toValue(rect)

  rect.x = Math.round(rect.x)
  rect.y = Math.round(rect.y)
  rect.width = Math.round(rect.width)
  rect.height = Math.round(rect.height)
}

function updatePrevPoints() {
  equalizePoints(prevP1, p1)
  // equalizePoints(prevP2, p2)
}
