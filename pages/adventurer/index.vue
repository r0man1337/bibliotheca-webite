<template>
  <section>
    <div>
      <h2>All Adventurers</h2>
      <form method="POST" @submit.prevent="submitSearch">
        <input
          v-model="search"
          placeholder="insert wallet address"
          class="bg-black rounded px-4 py-2 text-xl"
          type="text"
        />
        <button class="px-4" type="submit">find adventurer</button>
      </form>

      <div v-if="!$fetchState.pending" class="flex flex-wrap">
        <div
          v-for="(adventurer, index) in adventurers"
          :key="index"
          class="w-80"
        >
          <AdventurerCard :adventurer="adventurer" />
        </div>
        <BButton :loading="loading" type="primary" @click.native="fetchMore"
          >Load more</BButton
        >
      </div>
      <div v-else class="flex flex-wrap mt-4">
        <Loader v-for="(loader, index) in 6" :key="index" class="mr-3 mb-3" />
      </div>
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
import AdventurerCard from '~/components/cards/AdventurerCard.vue'

export default defineComponent({
  components: { AdventurerCard },
  setup(props, context) {
    const { $graphql } = useContext()
    const search = ref()
    const offset = ref(1)
    const query = ref(gql`
      query walletQuery($offset: Int!) {
        wallets(
          orderBy: bagsHeld
          orderDirection: desc
          first: 100
          skip: $offset
          where: { bagsHeld_not: null }
        ) {
          id
          address
          realmsHeld
          bagsHeld
          treasuresHeld
        }
      }
    `)

    const adventurers = ref(null)

    const submitSearch = () => {
      if (search.value.length === 42) {
        context.root.$router.push(`/adventurer/${search.value}`)
      }
    }

    useFetch(async () => {
      const response = await $graphql.default.request(query.value, {
        offset: offset.value,
      })
      adventurers.value = response.wallets
    })

    const loading = ref(false)

    const fetchMore = async () => {
      loading.value = true

      offset.value = offset.value + 100

      try {
        const response = await $graphql.default.request(query.value, {
          offset: offset.value,
        })
        adventurers.value = adventurers.value.concat(response.wallets)
      } catch (e) {
        console.log(e)
      } finally {
        loading.value = false
      }
    }

    return {
      adventurers,
      search,
      submitSearch,
      fetchMore,
      loading,
    }
  },
})
</script>
