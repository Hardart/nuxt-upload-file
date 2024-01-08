import sharp from 'sharp'
import fs from 'fs'

export default defineEventHandler(async event => {
  // const buff = await sharp(file).resize({ width: elementRect.width, height: elementRect.height })
  const pathsArray = foldersMap('./assets/photos/')

  for (let path of pathsArray) {
    const file = fs.readFileSync(path)
    const { width } = await sharp(file).metadata()
    const webpFile = await toWebp(width, file)
    const newPath = path.replace(/(jpe?g)$/i, 'webp')
    fs.unlinkSync(path)
    try {
      fs.writeFileSync(newPath, webpFile)
    } catch (error) {
      console.log(error)
    }
  }
})

function foldersMap(path: string): string[] {
  const files = fs.readdirSync(path)
  return files
    .flatMap(f => {
      const fullPath = path + f
      if (fs.lstatSync(fullPath).isDirectory()) return foldersMap(fullPath + '/')
      return fullPath
    })
    .filter(item => !item.includes('.DS_Store'))
}

async function toWebp(width: number | undefined, file: any) {
  if (width && width <= 1200) return await sharp(file).webp({ quality: 90 }).toBuffer()
  else return await sharp(file).resize({ width: 1200 }).webp({ quality: 90 }).toBuffer()
}
