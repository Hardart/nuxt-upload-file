import fs from 'fs'
export default defineEventHandler(async event => {
  const { folder } = getQuery(event)
  const startFolder = process.dev ? `./assets/${folder}/` : `../assets/${folder}/`
  const files = foldersMap(startFolder)
  return files
})

function foldersMap(path: string): string[] {
  const stringToFind = process.dev ? new RegExp(/^./) : new RegExp(/^..\/assets/)
  const stringToChange = process.dev ? '_nuxt' : ''

  const files = fs.readdirSync(path)
  return files
    .flatMap(f => {
      const fullPath = path + f
      if (fs.lstatSync(fullPath).isDirectory()) return foldersMap(fullPath + '/')
      return fullPath.replace(stringToFind, stringToChange)
    })
    .filter(item => !item.includes('.DS_Store'))
}
