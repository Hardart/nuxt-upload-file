import fs from 'fs'
export default defineEventHandler(async event => {
  const { folder } = getQuery(event)

  return foldersMap(`../assets/${folder}/`)
})

function foldersMap(path: string): string[] {
  const files = fs.readdirSync(path)
  return files
    .flatMap(f => {
      const fullPath = path + f
      if (fs.lstatSync(fullPath).isDirectory()) return foldersMap(fullPath + '/')
      return fullPath.replace(/^..\/assets/, '')
    })
    .filter(item => !item.includes('.DS_Store'))
}
