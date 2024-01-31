import { isClient } from '@vueuse/core'
import { setPositionOnMove, useTouch } from '@/utils/drag/useTouch'
import { updateBounds } from '@/utils/drag/bounds'
import { roundPoint } from '~/utils/drag/point'

export function useDrag(panArea: MaybeRefElement, src: string) {
  const zoomValue = ref(0)
  const preloadImage = ref<HTMLImageElement>()
  const imageRect = ref<ElementRect>({ x: 0, y: 0, width: 0, height: 0 })
  const panRect = ref<ElementSize>({ width: 270, height: 270 })
  const preloadImageSource = ref('')
  let imageSize

  if (isClient) {
    preloadImage.value = new Image()
    preloadImage.value.src = src
    preloadImage.value.onload = onLoadImage
  }

  function onLoadImage() {
    imageRect.value.width = preloadImage.value!.naturalWidth
    imageRect.value.height = preloadImage.value!.naturalHeight
    preloadImageSource.value = src
    correctImageSize()
    imageSize = { ...imageRect.value }

    useTouch(panArea, imageRect, panRect)
  }

  const isHorisontal = computed(() => toValue(preloadImage)!.height < toValue(preloadImage)!.width)

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
    roundPoint(imageRect)
  }

  watch(zoomValue, () => {
    const zoom = zoomValue.value / 500
    const { height, width } = imageSize!
    const prop = isHorisontal.value ? height : width
    const v = prop + prop * zoom
    correctImageSize(v)
    updateBounds(imageRect, panRect)
    setPositionOnMove(imageRect)
  })

  return {
    imageRect,
    zoomValue,

    preloadImageSource,
    imageStyle: computed(() => toStyleString(imageRect, true)),
    panStyle: computed(() => `width: ${panRect.value.width}px; height: ${panRect.value.height}px`),
  }
}
