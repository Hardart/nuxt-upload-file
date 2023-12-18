export class PanBounds {
  center: Point = { x: 0, y: 0 }
  max: Point = { x: 0, y: 0 }
  min: Point = { x: 0, y: 0 }
  image

  constructor(image: Slide) {
    this.image = image
  }

  reset() {
    this.resetAxis('x')
    this.resetAxis('y')
  }

  update() {
    if (!this.image.elementRect.width) return this.reset()
    this._updateAxis('x')
    this._updateAxis('y')
  }

  correctPan(axis: Axis, panOffset: number) {
    return clamp(panOffset, this.max[axis], this.min[axis])
  }

  private resetAxis(axis: Axis) {
    this.center[axis] = 0
    this.max[axis] = 0
    this.min[axis] = 0
  }

  private _updateAxis(axis: Axis) {
    const elSize = this.image.elementRect[axis === 'x' ? 'width' : 'height']
    const panAreaSize = this.image.panAreaSize[axis]

    // Default position of element.
    // By default, it is center of viewport:
    // this.center[axis] = Math.round((panAreaSize - elSize) / 2)
    this.center[axis] = 0

    // maximum pan position
    this.max[axis] = elSize > panAreaSize ? Math.round((panAreaSize - elSize) / 2) : 0

    // minimum pan position
    this.min[axis] = elSize > panAreaSize ? Math.round((panAreaSize - elSize) / 2) * -1 : 0
  }
}
