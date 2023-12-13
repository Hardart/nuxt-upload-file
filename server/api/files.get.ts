import fs from 'fs'
export default defineEventHandler(event => {
  return foldersMap('../assets/images/')
})

function foldersMap(path: string): string[] {
  const files = fs.readdirSync(path)
  return files.flatMap(f => {
    const fullPath = path + f
    if (fs.lstatSync(fullPath).isDirectory()) return foldersMap(fullPath + '/')
    return fullPath.replace(/^../, '')
  })
}
