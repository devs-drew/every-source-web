<script setup>
useHead({
  script: [
    {
      innerHTML: `(function(){var t=localStorage.getItem('es-theme')||'light';document.documentElement.setAttribute('data-theme',t)})()`,
      tagPriority: 'critical'
    }
  ],
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' }
  ],
  link: [
    { rel: 'icon', href: '/favicon.ico' },
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap' }
  ],
  htmlAttrs: { lang: 'en' }
})

const title = 'EverySource'
const description = 'The single source of truth for every project\'s documentation.'

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
