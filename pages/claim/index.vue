<template>
  <section>
    <div>
      <h2>All Claims</h2>

      <div v-for="(claim, index) in claimsList" :key="claim.title">
        <NuxtLink
          :key="index"
          class="text-xl rounded-xl px-4 py-3 hover:bg-black hover:text-red-400"
          :to="'/claim/' + claim.slug"
        >
          <div
            class="
              bg-black
              p-4
              rounded-xl
              mr-8
              my-4
              text-white
              transform
              hover:-translate-y-2
              transition
              duration-150
              h-80
              cursor-pointer
              hover:shadow-2xl
              flex flex-col
              border-2 border-gray-800
              shadow-2xl
              group
            "
            @click="navigate"
          >
            {{ claim.title }}
          </div>
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script>
import { defineComponent } from '@nuxtjs/composition-api'
import { useClaims } from '~/composables/useClaims'
export default defineComponent({
  setup(props, context) {
    const { claimsList } = useClaims()
    return {
      claimsList,
    }
  },
})
</script>
