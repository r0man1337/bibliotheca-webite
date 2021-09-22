<template>
  <section>
    <h1>Treasure</h1>
    <div v-if="!$fetchState.pending">
      <!-- <form  method="POST" @submit.prevent="submitSearch">
        <input v-model="search" placeholder="insert wallet address" class="bg-black rounded px-4 py-2 text-xl" type="text">
        <button class="px-4" type="submit">find adventurer</button>
      </form> -->

      <div class="flex flex-wrap">
        <div v-for="(treasure, index) in treasures" :key="index" class="w-80">
          <TreasureCard owner :treasure="treasure" />
        </div>
      </div>
      <BButton :loading="loading" type="primary" @click.native="fetchMore"
        >Load more</BButton
      >
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

export default defineComponent({
  setup(props, context) {
    const { $graphql } = useContext()
    const search = ref()
    const offset = ref(1)
    const query = ref(gql`
      query treasureQuery($offset: Int!) {
        treasures(first: 100, skip: $offset) {
          id
          asset1
          asset2
          asset3
          asset4
          asset5
          asset6
          asset7
          asset8
          currentOwner {
            address
            bagsHeld
            joined
          }
        }
      }
    `)

    const treasures = ref(null)

    const submitSearch = () => {
      if (search.value.length === 42) {
        context.root.$router.push(`/adventurer/${search.value}`)
      }
    }

    useFetch(async () => {
      const response = await $graphql.mainnet.request(query.value, {
        offset: offset.value,
      })
      treasures.value = response.treasures
    })

    const loading = ref(false)

    const fetchMore = async () => {
      loading.value = true

      offset.value = offset.value + 100

      try {
        const response = await $graphql.mainnet.request(query.value, {
          offset: offset.value,
        })
        treasures.value = treasures.value.concat(response.treasures)
      } catch (e) {
        console.log(e)
      } finally {
        loading.value = false
      }
    }

    return {
      treasures,
      search,
      submitSearch,
      fetchMore,
      loading,
    }
  },
})
</script>
