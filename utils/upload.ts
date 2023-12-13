export function uploadForm(url: string, formElement: HTMLFormElement) {
  const form = new FormData(formElement)
  const xhr = new XMLHttpRequest()
  xhr.open('post', url, true)
  xhr.upload.onprogress = function ({ total, loaded }) {
    // Upload progress here
    // uploadProgress.value = Math.round((loaded / total) * 100)
  }
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      // Uploaded
      const fileName = xhr.response
      // if (fileName.trim()) src.value = fileName
    }
  }
  xhr.send(form)
}
