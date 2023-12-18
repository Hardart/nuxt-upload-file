export class DragZone {
  root: HTMLElement | null = null
  wrap: HTMLElement | null = null
  border: HTMLElement | null = null
  offset: Point = { x: 0, y: 0 }
  wrapRect: ElementRect = { x: 0, y: 0, width: 0, height: 0 }
  gestures: Gestures | null = null
  image: Slide | null = null

  init(src: string) {
    this.root = this.elementGuard<HTMLElement>('[avatar-container]')
    this.border = this.elementGuard<HTMLElement>('[avatar-borders]', this.root)
    this.wrap = this.elementGuard<HTMLElement>('[avatar-wrap]', this.root)
    this.image = new Slide(this, src)
    this.image.init()
    this.gestures = new Gestures(this)
  }

  onChangeZoom(zoom: number) {
    this.image.changeZoom(zoom)
  }

  get imageProps() {
    this.image.correctRectValues()
    const { elementRect, panAreaSize } = this.image

    return { elementRect, panAreaSize }
  }

  private elementGuard<T extends Element>(elClass: string, parentElement?: HTMLElement) {
    const parent = parentElement ? parentElement : document
    const el = parent.querySelector<T>(elClass)

    if (!el) throw createError(`Can't find element with class ${elClass}`)
    return el
  }
}
