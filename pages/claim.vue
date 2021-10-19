<template>
  <div>
    <h1 class="mb-4">Claims & Mints</h1>
    <nav class="space-x-4 mb-8">
      <NuxtLink
        v-for="(link, index) in claimsList"
        :key="index"
        class="text-xl rounded-xl px-4 py-3 hover:bg-black hover:text-red-400"
        :to="'/claim/' + link.slug"
        >{{ link.title }}</NuxtLink
      >
    </nav>

    <NuxtChild />
  </div>
</template>
<script>
import { defineComponent } from '@nuxtjs/composition-api'
import { useClaims } from '~/composables/useClaims'
export default defineComponent({
  setup(props, context) {
    // const variables = ref({ slug: slug.toLowerCase() })
    const { claimsList } = useClaims()
    return {
      claimsList,
    }
  },
})
</script>
