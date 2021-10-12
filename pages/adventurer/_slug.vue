<template>
  <div>
    <h1 class="mb-4">Hello Sir</h1>
    <nav class="space-x-4 mb-8">
      <NuxtLink
        v-for="(link, index) in menuLinks"
        :key="index"
        class="text-xl rounded-xl px-4 py-3 hover:bg-black hover:text-red-400"
        :to="'/adventurer/' + slug + '/' + link.slug"
        >{{ link.title }}</NuxtLink
      >
    </nav>

    <NuxtChild />
  </div>
</template>
<script>
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  setup(props, context) {
    const { slug } = context.root.$route.params
    // const variables = ref({ slug: slug.toLowerCase() })

    const menuLinks = [
      {
        title: 'Empire',
        slug: 'empire',
      },
      {
        title: 'Loot Assets',
        slug: '',
      },
      {
        title: 'Realm Settling',
        slug: 'settling',
      },
      {
        title: 'Iron Bank',
        slug: 'iron-bank',
      },
    ]
    return {
      slug,
      menuLinks,
    }
  },
})
</script>
