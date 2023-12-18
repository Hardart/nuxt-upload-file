export class Slide {
  private root
  private src
  private borders
  private ratio = 0
  private zoomLevel = 1
  element = new Image()
  elementRect: ElementRect = { x: 0, y: 0, width: 0, height: 0 }
  initRect: ElementRect = { x: 0, y: 0, width: 0, height: 0 }
  panAreaSize: Point = { x: 0, y: 0 }
  bounds

  constructor(root: DragZone, src: string) {
    this.root = root
    this.src = src
    this.bounds = new PanBounds(this)
    this.borders = root.border!
  }

  private calculateSize() {
    const { elementRect } = this
    elementRect.width = this.element.naturalWidth
    elementRect.height = this.element.naturalHeight
  }

  private calculateBorder() {
    const { width, height } = getElementRect(this.borders)
    const rootBounds = { x: width, y: height }
    equalizePoints(this.panAreaSize, rootBounds)
  }

  init() {
    this.element.src = this.src
    this.element.onload = this._onImageLoad.bind(this)
  }

  applyTransform() {
    const { x, y } = this.elementRect
    setTransform(this.element, x, y)
  }

  changeZoom(zoom: number) {
    this.zoomLevel = zoom / 500
    const { height, width } = this.initRect
    const prop = this.isHorisontal ? width : height
    const v = prop + prop * this.zoomLevel
    this.customSize(v)
    this.bounds.update()
    this.root.gestures!.change()
  }

  correctRectValues() {
    const keys = Object.keys(this.elementRect) as (keyof typeof this.elementRect)[]
    keys.forEach(key => {
      const value = this.elementRect[key]
      this.elementRect[key] = Math.floor(value)
    })
    this.panAreaSize.x = Math.floor(this.panAreaSize.x)
    this.panAreaSize.y = Math.floor(this.panAreaSize.y)
  }

  private _onImageLoad() {
    this.calculateSize()
    this.correctSize()
    this.initRect = { ...this.elementRect }
    this.borders.classList.add('opacity-100')
    this.element.classList.add('cursor-grab', 'absolute')
    this.borders.insertAdjacentElement('beforebegin', this.element)
    this.root.gestures!.bindEvents()
  }

  private get isHorisontal() {
    const { height, width } = this.elementRect
    return height < width
  }

  private calcRatio() {
    const { height, width } = this.elementRect
    this.ratio = this.isHorisontal ? width / height : height / width
  }

  private customSize(value: number, isHeight: boolean = false) {
    if (isHeight) {
      this.elementRect.height = value
      this.elementRect.width = value * this.ratio
    } else {
      const longSide = this.isHorisontal ? 'width' : 'height'
      const shortSide = this.isHorisontal ? 'height' : 'width'
      this.elementRect[longSide] = value
      this.elementRect[shortSide] = value / this.ratio
    }
    const { width, height } = this.elementRect

    setElementSize(this.element, { width, height })
  }

  private setBorderSize() {
    const { width, height } = this.elementRect
    setElementSize(this.borders, this.isHorisontal ? { height, width: height } : { width, height: width })
  }

  private correctSize() {
    this.calcRatio()
    this.customSize(this.correctImageSize)
    this.setBorderSize()
    this.calculateBorder()
    this.bounds.update()
  }

  private get correctImageSize() {
    let value = this.ratio == 1 ? 370 : 550
    if (this.windowWidth < 550 && this.windowWidth > 450) {
      value = this.ratio == 1 ? this.windowWidth * 0.55 : this.isHorisontal ? 500 : this.windowWidth * 0.85
    } else if (this.windowWidth < 450 && this.windowWidth > 400) {
      value = this.ratio == 1 ? this.windowWidth * 0.7 : this.isHorisontal ? 500 : this.windowWidth * 0.99
    } else if (this.windowWidth < 400) {
      value = this.ratio == 1 ? this.windowWidth * 0.8 : this.isHorisontal ? 500 : this.windowWidth * 1.2
    }
    return value
  }

  private get windowWidth() {
    return window.screen.width
  }
}
