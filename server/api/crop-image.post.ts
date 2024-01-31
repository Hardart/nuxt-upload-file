import sharp from 'sharp'
interface ImageProps {
  width: number
  height: number
  x: number
  y: number
  crop: number
}
const sizes = [75, 150, 200] as const
export default defineEventHandler(async event => {
  try {
    const body = await readBody(event)
    const file = await useStorage('db').getItemRaw(body.src)
    const { width, height, x, y, crop } = body.props as ImageProps

    const imageID = Date.now()

    const left = Math.floor((width - crop) / 2 - x)
    const top = Math.floor((height - crop) / 2 - y)
    const name = (size: number) => `/images/avatar_${imageID}_${size}.webp`
    const buff = await sharp(file).resize({ width, height }).extract({ left, top, height: crop, width: crop }).toBuffer()
    for (let size of sizes) {
      const image = await sharp(buff).resize({ width: size }).webp({ quality: 70 }).toBuffer()
      await useStorage('db').setItemRaw(name(size), image)
    }

    await useStorage('db').removeItem(body.src)
    return { data: name(200), error: null }
  } catch (error) {
    return { error, data: null }
  }
})
