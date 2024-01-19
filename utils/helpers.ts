export function pointsEqual(p1: Point, p2: Point) {
  return p1.x === p2.x && p1.y === p2.y
}

export function setTransform(el: HTMLElement, x: number, y: number, scale?: number) {
  el.style.transform = toTransformString(x, y, scale)
}

export function toTransformString(x: number, y: number, scale?: number) {
  let propValue = `transform: translate3d(${x}px,${y || 0}px,0)`

  if (scale !== undefined) {
    propValue += ` scale3d(${scale},${scale},1)`
  }

  return propValue
}

export function setElementSize(el: HTMLElement, props: ElementProps, isPercents: boolean = false) {
  const ext = isPercents ? '%' : 'px'
  if ('value' in props) {
    el.style[props.name] = `${props.value}${ext}`
  } else {
    el.style.width = `${props.width}${ext}`
    el.style.minWidth = `${props.width}${ext}`
    el.style.height = `${props.height}${ext}`
  }
}

export function clamp(val: number, min: number, max: number) {
  return Math.min(Math.max(val, min), max)
}

export function getElementRect(el: MaybeRefElement): DOMRect {
  el = toValue(el)
  if (!el) throw createError(`Element is null or undefined`)
  return el.getBoundingClientRect()
}

export function notNullGuard<T>(el: T | null): T {
  if (el === null) throw createError('element is NOT defined')
  return el
}

export async function delay(ms: number = 0) {
  return new Promise(res => setTimeout(res, ms))
}

export function roundPoint(p: Point) {
  p.x = Math.round(p.x)
  p.y = Math.round(p.y)
  return p
}
