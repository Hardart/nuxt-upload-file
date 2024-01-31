export function clamp(val: number, min: number, max: number) {
  return Math.min(Math.max(val, min), max)
}

export async function delay(ms: number = 0) {
  return new Promise(res => setTimeout(res, ms))
}

export function toStyleString(rect: MaybeRef<ElementRect>, setTransform: boolean = false) {
  rect = toValue(rect)
  let style = `width: ${rect.width}px; height: ${rect.height}px; min-width: ${rect.width}px;`
  if (setTransform) style += `transform: translate3d(${rect.x}px,${rect.y}px,0)`
  return style
}
