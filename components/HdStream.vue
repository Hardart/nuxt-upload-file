<script setup lang="ts">
interface ItunesSong {
  artistName: string
  artworkUrl60: string
  artworkUrl100: string
}

interface ItunesResponse {
  resultCount: number
  results: ItunesSong[]
}
import { IcecastReadableStream } from 'icecast-metadata-js'

const url = 'https://drh-connect.dline-media.com/onair'
const data = ref('')
const imageData = ref('')

const options = {
  metadataTypes: ['icy'],
  icyCharacterEncoding: 'utf-8',
  icyMetaInt: 16000,
  icyDetectionTimeout: 2000,
  enableLogging: true,
  onStream: (value: any) => {},
  onMetadata,
  onError: () => {},
}

fetch(url, { headers: { 'Icy-MetaData': '1' } }).then(async res => {
  const icecast = new IcecastReadableStream(res, options)
  await icecast.startReading()
})

async function onMetadata({ metadata }: any) {
  data.value = metadata.StreamTitle
  const { resultCount, results } = await $fetch<ItunesResponse>('https://itunes.apple.com/search', {
    params: { term: data.value.split(' - ').join(' '), limit: 1, entity: 'song' },
    parseResponse: responseText => JSON.parse(responseText),
  })

  imageData.value = resultCount == 1 ? results[0].artworkUrl100 : ''
}
</script>

<template>
  <div>
    <img :src="imageData" alt="" />
    <h1>{{ data }}</h1>
  </div>
</template>

<style></style>
