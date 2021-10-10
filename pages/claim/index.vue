<template>
  <section>
    <div>
      <div class="flex">
        <div
          v-for="(claim, index) in claimsList"
          :key="index"
          class="
            bg-black
            p-8
            rounded-xl
            w-80
            h-80
            mt-10
            cursor-pointer
            transform
            hover:-translate-y-2
            transition
            duration-150
            flex flex-col
            hover:bg-gray-1000
            sm:mr-4
          "
        >
          <h2>{{ claim.title }}</h2>
          <div class="flex flex-col text-xl">
            <span>Status: {{ claim.status }}</span>
            <span
              >Requirements:
              <span
                v-for="(requirement, index) in claim.requirements"
                :key="index"
                >{{ requirement }}</span
              >
            </span>
          </div>
          <BButton type="primary" class="mt-auto" :to="'/claim/' + claim.slug"
            >Claim</BButton
          >
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { defineComponent } from '@nuxtjs/composition-api'
import { useClaims } from '~/composables/useClaims'
export default defineComponent({
  setup() {
    const { claimsList } = useClaims()
    return {
      claimsList,
    }
  },
})
</script>
