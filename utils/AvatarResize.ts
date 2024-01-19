import { isClient } from '@vueuse/core'
import { setPositionOnMove, useTouch } from './drag/useTouch'
import { updateBounds } from './drag/bounds'

export function avatarResize(panArea: MaybeRefElement, src: string) {
  const isLoading = ref(false)
  const imageTransform = ref<Point>({ x: 0, y: 0 })
  const zoomValue = ref(0)
  const preloadImage = ref<HTMLImageElement>()
  const imageRect = ref<ElementSize>({ width: 0, height: 0 })
  const panRect = ref<ElementSize>({ width: 270, height: 270 })
  const imageSrc = ref('')
  let imageSize

  if (isClient) {
    preloadImage.value = new Image()
    preloadImage.value.src = src
    preloadImage.value.onload = onLoadImage
  }

  function onLoadImage() {
    imageRect.value.width = preloadImage.value!.naturalWidth
    imageRect.value.height = preloadImage.value!.naturalHeight
    imageSrc.value = src
    correctImageSize()
    imageSize = { ...imageRect.value }
    isLoading.value = true
    useTouch(panArea, imageTransform, imageRect, panRect)
  }

  const isHorisontal = computed(() => {
    return toValue(preloadImage)!.height < toValue(preloadImage)!.width
  })

  const ratio = computed(() => {
    const image = toValue(preloadImage)!
    const { height, width } = image
    return isHorisontal ? width / height : height / width
  })

  const correctImageSize = (value?: number) => {
    const { width, height } = panRect.value
    switch (true) {
      case isHorisontal.value && ratio.value !== 1:
        imageRect.value.height = value ? value : height
        imageRect.value.width = imageRect.value.height * ratio.value
        break
      case !isHorisontal.value && ratio.value !== 1:
        imageRect.value.width = value ? value : width
        imageRect.value.height = imageRect.value.width / ratio.value
        break

      default:
        imageRect.value.width = value ? value : width
        imageRect.value.height = value ? value : width
        break
    }
  }

  watch(zoomValue, () => {
    const zoom = zoomValue.value / 500
    const { height, width } = imageSize!
    const prop = isHorisontal ? width : height
    const v = prop + prop * zoom
    correctImageSize(v)
    updateBounds(imageRect, panRect)
    setPositionOnMove(imageTransform)
  })

  return {
    zoomValue,
    isLoading,
    imageSrc,
    imageStyle: computed(() => toStyleString(imageRect, imageTransform)),
    panStyle: computed(() => `width: ${panRect.value.width}px; height: ${panRect.value.height}px`),
  }
}

function toStyleString(rect: MaybeRef<ElementSize>, transform?: MaybeRef<Point>) {
  rect = toValue(rect)
  let style = `width: ${rect.width}px; height: ${rect.height}px; min-width: ${rect.width}px`
  if (transform) {
    transform = toValue(transform)
    style += `;transform: translate3d(${transform.x}px,${transform.y}px,0)`
  }

  return style
}
