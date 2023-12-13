import { type MultiPartData } from 'h3'
import sharp from 'sharp'
const exts = ['webp', 'avif'] as const

export default defineEventHandler(async event => {
  const formData = await readMultipartFormData(event)
  if (!formData) return
  const body = formData.reduce(reduceBody, {} as Record<string, any>)
  const fileName = await saveFile(body.image, body.title)

  return fileName
})

async function saveFile(file: Buffer, folder: string) {
  folder = folder == '' ? 'default' : folder
  const path = (ext: string = 'jpg', size?: number) => `/images/blog/${folder}/blog_img${size ? '_' + size : ''}.${ext}`
  // if (ext === 'heic') {
  //   const buffer = await convert({ buffer: file.data, format: 'JPEG' })
  //   name = `avatar.jpg`
  //   await useStorage('db').setItemRaw(name, buffer)
  // } else {
  //   name = `avatar.${ext}`
  //   await useStorage('db').setItemRaw(name, file.data)
  // }

  // const screenWidth = [372, 672, 744, 972, 1272, 1344]
  // const sizes = [300, 600]
  // const sizes = [300, 600, 730, 800, 960, 1200]
  const image = await sharp(file).resize({ width: 1200 }).jpeg().toBuffer()
  await useStorage('db').setItemRaw(path(), image)

  // for (let ext of exts) {
  //   for (let size of sizes) {
  //     const image = await sharp(file)
  //       .resize({ width: size })
  //       [ext]({ quality: ext === 'webp' ? 75 : 45 })
  //       .toBuffer()

  //     await useStorage('db').setItemRaw(path(ext, size), image)
  //   }
  // }

  // const imageThumb = await sharp(file.data).resize({ fit: 'cover', width: 150, height: 150 }).toFormat('jpg').toBuffer()
  // await useStorage('db').setItemRaw('name_thumb.jpg', imageThumb)

  return path()
}

function reduceBody(acc: Record<string, any>, curr: any): Record<string, any> {
  const key = curr.name
  if (!key) return acc
  acc[key] = key == 'title' ? curr.data.toString('utf-8') : curr.data
  return acc
}
