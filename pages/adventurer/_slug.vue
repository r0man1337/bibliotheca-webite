<template>
  <div>
    <h3 class="text-gray-400">
      <span v-if="ensName">{{ ensName }}</span>
      <span v-else>{{ shortenHash(slug) }}</span>
    </h3>
    <h1 class="mb-8">Sir, your vast empire</h1>
    <div class="flex">
      <nav class="space-x-4 mb-8 bg-gray-900 px-3 py-5 rounded-2xl">
        <NuxtLink
          v-for="(link, index) in menuLinks"
          :key="index"
          class="
            text-xl
            rounded-xl
            px-6
            py-3
            text-gray-400
            hover:bg-black hover:text-red-200
            uppercase
          "
          :to="'/adventurer/' + slug + '/' + link.slug"
          >{{ link.title }}</NuxtLink
        >
      </nav>
    </div>

    <NuxtChild />
  </div>
</template>
<script>
import { defineComponent, onMounted } from '@nuxtjs/composition-api'
import { useFormatting } from '~/composables/useFormatting'
export default defineComponent({
  setup(props, context) {
    const { shortenHash, returnEns, ensName } = useFormatting()
    const { slug } = context.root.$route.params
    // const variables = ref({ slug: slug.toLowerCase() })

    const menuLinks = [
      {
        title: 'Empire',
        slug: 'empire',
      },
      {
        title: 'Realm Settling',
        slug: 'settling',
      },
      {
        title: 'Iron Bank',
        slug: 'iron-bank',
      },
      {
        title: 'Assets',
        slug: '',
      },
    ]
    onMounted(async () => {
      await returnEns(slug)
    })
    return {
      slug,
      menuLinks,
      ensName,
      shortenHash,
    }
  },
})
</script>
