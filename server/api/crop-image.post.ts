import sharp from 'sharp'
const sizes = [50, 100, 150, 200, 300] as const
export default defineEventHandler(async event => {
  const body = await readBody(event)
  const file = await useStorage('db').getItemRaw(body.src)
  const { elementRect, crop } = body.props
  const imageId = Date.now()
  const { width, height } = elementRect

  const left = Math.floor((width - crop) / 2 - elementRect.x)
  const top = Math.floor((height - crop) / 2 - elementRect.y)
  const name = (size: number) => `/images/avatar_${imageId}_${size}.webp`

  const buff = await sharp(file).resize({ width: elementRect.width, height: elementRect.height }).extract({ left, top, height: crop, width: crop }).toBuffer()
  for (let size of sizes) {
    const image = await sharp(buff).resize({ width: size }).webp({ quality: 75 }).toBuffer()
    await useStorage('db').setItemRaw(name(size), image)
  }

  await useStorage('db').removeItem(body.src)
  return name(300)
})
