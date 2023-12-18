type PointerType = 'up' | 'down' | 'move'

export class Gestures {
  private p1: Point = this.zeroPoint
  private p2: Point = this.zeroPoint
  private previousP1: Point = this.zeroPoint
  private previousP2: Point = this.zeroPoint
  private startP1: Point = this.zeroPoint
  private startP2: Point = this.zeroPoint

  private numActivePoints = 0

  private isMultitouch = false
  private isDragging = false
  private isZooming = false

  private activePointers: Point[] = []

  private touchEventEnabled = 'ontouchstart' in window
  private pointerEventEnabled = !!window.PointerEvent
  private supportsTouch = this.touchEventEnabled || (this.pointerEventEnabled && navigator.maxTouchPoints > 1)
  root

  private down: ((e: PointerEvent) => void) | null = null
  private move: ((e: PointerEvent) => void) | null = null
  private up: ((e: PointerEvent) => void) | null = null

  constructor(rootClass: DragZone) {
    this.root = rootClass
  }

  bindEvents() {
    const { image, border } = this.root
    if (!border || !image) return
    this.down = this.onPointerDown.bind(this)
    this.move = this.onPointerMove.bind(this)
    this.up = this.onPointerUp.bind(this)

    image.element.addEventListener('pointerdown', this.down)
    image.element.addEventListener('pointermove', this.move)
    border.addEventListener('pointerdown', this.down)
    border.addEventListener('pointermove', this.move)
    document.addEventListener('pointerup', this.up)
  }

  onPointerDown(e: PointerEvent) {
    const isMousePointer = e.type === 'mousedown' || e.pointerType === 'mouse'

    // Allow dragging only via left mouse button.
    if (isMousePointer && e.button > 0) return

    if (isMousePointer) e.preventDefault()
    if (this.numActivePoints === 1) return

    this.updatePoints(e, 'down')
    if (this.numActivePoints === 1) equalizePoints(this.startP1, this.p1)
    this.updateStartPoints()
  }

  onPointerMove(e: PointerEvent) {
    if (!this.numActivePoints) return
    this.updatePoints(e, 'move')
    if (this.numActivePoints === 1 && !this.isDragging) {
      this.change()
      this.updatePrevPoints()
    }
  }

  onPointerUp(e: PointerEvent) {
    if (!this.numActivePoints) return
    this.updatePoints(e, 'up')
    if (this.numActivePoints === 0) {
      this.end()
    }
  }

  end() {
    this.root.image!.correctRectValues()

    if (!this.isDragging) return

    this.isDragging = false
    // Try to calculate velocity,
    // if it wasn't calculated yet in drag.change
    // if (!this.velocityCalculated) this.updateVelocity(true)

    // this.drag.end()
    // this.dragAxis = null;
  }

  change() {
    const { image } = this.root

    this.setNewPan('x')
    this.setNewPan('y')
    image!.applyTransform()
  }

  setNewPan(axis: Axis) {
    const { image } = this.root
    if (!image) return
    const { elementRect, bounds } = image
    const potentialPan = this.p1[axis] - this.previousP1[axis]

    elementRect[axis] += potentialPan
    const correctedPan = bounds.correctPan(axis, elementRect[axis])
    elementRect[axis] = correctedPan
  }

  private eventPositionToPoint(e: Touch | PointerEvent, p: Point) {
    p.x = e.pageX
    p.y = e.pageY

    if ('pointerId' in e) {
      p.id = e.pointerId
    } else if (e.identifier !== undefined) {
      p.id = e.identifier
    }

    return p
  }

  private updatePrevPoints() {
    equalizePoints(this.previousP1, this.p1)
    equalizePoints(this.previousP2, this.p2)
  }

  private updateStartPoints() {
    equalizePoints(this.startP1, this.p1)
    equalizePoints(this.startP2, this.p2)
    this.updatePrevPoints()
  }

  private updatePoints(e: PointerEvent | TouchEvent, type: PointerType) {
    if (this.pointerEventEnabled && 'pointerId' in e) this.pointerEventEnable(e, type)
    else this.pointerEventDisable(e, type)
  }

  private pointerEventEnable(event: PointerEvent, type: PointerType) {
    // Try to find the current pointer in ongoing pointers by its ID
    const pointerIndex = this.activePointers.findIndex(p => p.id === event.pointerId)

    switch (true) {
      case type === 'up' && pointerIndex > -1:
        this.activePointers.splice(pointerIndex, 1)
        break
      case type === 'down' && pointerIndex === -1:
        this.activePointers.push(this.eventPositionToPoint(event, this.zeroPoint))
        break
      case type === 'move' && pointerIndex > -1:
        this.eventPositionToPoint(event, this.activePointers[pointerIndex])
        break
    }

    this.numActivePoints = this.activePointers.length

    // update points that PhotoSwipe uses
    // to calculate position and scale
    if (this.numActivePoints > 0) equalizePoints(this.p1, this.activePointers[0])

    if (this.numActivePoints > 1) equalizePoints(this.p2, this.activePointers[1])
  }

  private pointerEventDisable(event: TouchEvent | PointerEvent, type: PointerType) {
    this.numActivePoints = 0
    if (event.type.indexOf('touch') > -1 && 'touches' in event) {
      // Touch Event
      if (event.touches.length <= 0) return
      this.eventPositionToPoint(event.touches[0], this.p1)
      this.numActivePoints++

      if (event.touches.length <= 1) return
      // zoom action
      this.eventPositionToPoint(event.touches[1], this.p2)
      this.numActivePoints++
    } else if ('pointerId' in event) {
      // Mouse Event

      this.eventPositionToPoint(event, this.p1)
      if (type === 'up') this.numActivePoints = 0 // clear all points on mouseup
      else this.numActivePoints++
    }
  }

  private get zeroPoint(): Point {
    return { x: 0, y: 0 }
  }
}
