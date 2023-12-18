import sharp from 'sharp'

export default defineEventHandler(async event => {
  const body = await readBody(event)
  const file = await useStorage('db').getItemRaw(body.src)
  const { elementRect, crop } = body.props

  const { width, height } = elementRect

  const left = Math.floor((width - crop) / 2 - elementRect.x)
  const top = Math.floor((height - crop) / 2 - elementRect.y)

  const buff = await sharp(file)
    .resize({ width: elementRect.width, height: elementRect.height })
    .extract({ left, top, height: crop, width: crop })
    .toBuffer()
  const image = await sharp(buff).resize({ width: 100 }).webp({ quality: 75 }).toBuffer()
  const name = `/images/avatar_${Date.now()}.webp`
  await useStorage('db').setItemRaw(name, image)
  await useStorage('db').removeItem(body.src)
  return name
})
