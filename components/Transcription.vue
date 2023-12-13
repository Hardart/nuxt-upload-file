<script setup lang="ts">
const alphavite: { [key: string]: string } = {
  а: 'a',
  б: 'b',
  в: 'v',
  г: 'g',
  д: 'd',
  е: 'e',
  ё: 'e',
  ж: 'zh',
  з: 'z',
  и: 'i',
  й: 'y',
  к: 'k',
  л: 'l',
  м: 'm',
  н: 'n',
  о: 'o',
  п: 'p',
  р: 'r',
  с: 's',
  т: 't',
  у: 'u',
  ф: 'f',
  х: 'kh',
  ц: 'ts',
  ч: 'ch',
  ш: 'sh',
  щ: 'shch',
  ы: 'y',
  ь: '',
  ъ: '',
  э: 'e',
  ю: 'yu',
  я: 'ya',
}
const str = ref('')
const convertStr = computed(() =>
  str.value
    .toLowerCase()
    .trim()
    .replace(/ь([е])/gm, 'y$1')
    .split('')
    .map(l => {
      return l in alphavite ? alphavite[l] : l
    })
    .join('')
    .replace(/[^a-zA-Z0-9 ]/gm, '')
    .replace(/\s+/gm, '-')
)
</script>

<template>
  <div class="bg-stone-200 h-40 px-20">
    <input class="h-10 py-2 px-5 rounded-xl mt-10 w-1/2" type="text" v-model="str" />
    <input class="h-10 py-2 px-5 rounded-xl mt-10 w-1/2" type="text" :value="convertStr" />
  </div>
</template>

<style></style>
