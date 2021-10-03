<template>
  <section>
    <div v-if="!$fetchState.pending">
      <h1>Loot #{{ id }}</h1>
      <h3 class="mt-3">
        Owner:
        <NuxtLink
          class="hover:underline"
          :to="'/adventurer/' + loot[0].currentOwner.address"
          >{{ shortenHash(loot[0].currentOwner.address) }}</NuxtLink
        >
      </h3>
      <div class="sm:text-2xl w-96">
        <LootCard is-o-g :loot="loot[0]" />
      </div>
    </div>
    <div v-else>
      <Loader />
    </div>
  </section>
</template>
<script>
import { gql } from 'nuxt-graphql-request'
import {
  defineComponent,
  ref,
  useContext,
  useFetch,
} from '@nuxtjs/composition-api'
import { useFormatting } from '~/composables/useFormatting'

export default defineComponent({
  setup(props, context) {
    const { $graphql } = useContext()
    const search = ref()
    const { shortenHash } = useFormatting()

    const { id } = context.root.$route.params
    const variables = ref({ id })
    const query = ref(gql`
      query bagsQuery($id: String!) {
        bags(where: { id: $id }) {
          id
          head
          neck
          chest
          hand
          ring
          weapon
          waist
          foot
          chestSuffixId
          footSuffixId
          handSuffixId
          headSuffixId
          neckSuffixId
          ringSuffixId
          waistSuffixId
          weaponSuffixId
          manasClaimed
          currentOwner {
            address
            bagsHeld
            joined
          }
        }
      }
    `)

    const loot = ref(null)

    useFetch(async () => {
      const response = await $graphql.mainnet.request(
        query.value,
        variables.value
      )
      loot.value = response.bags
    })

    const loading = ref(false)

    return {
      loot,
      search,
      loading,
      id,
      shortenHash,
    }
  },
})
</script>
