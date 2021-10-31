<template>
  <section>
    <div>
      <Filters
        class="fixed w-80 min-h-screen"
        :filters-open="filtersOpen"
        @toggleFilter="filtersOpen = !filtersOpen"
        @searchFilter="searchFilter"
      />
      <h1>Settled Realms</h1>
      <form class="flex sm:w-1/3" method="POST" @submit.prevent="submitSearch">
        <input
          v-model="search"
          placeholder="insert realm id"
          class="bg-black rounded-2xl px-4 py-2 text-xl w-2/3"
          type="text"
        />
        <BButton class="ml-3 w-1/3" type="primary">find realm</BButton>
      </form>

      <div class="flex flex-wrap sm:space-x-3 my-3">
        <BButton
          type="primary"
          class="
            px-2
            py-2
            hover:bg-black
            rounded
            capitalize
            hover:text-red-300
            mb-2
            mr-2
          "
          @click="filtersOpen = !filtersOpen"
          >Open Filters +</BButton
        >
      </div>

      <div class="flex flex-wrap sm:space-x-3 my-3">
        <span class="pr-4 self-center">Order By:</span>
        <BButton
          v-for="(data, index) in orderByData"
          :key="index"
          type="primary"
          :class="{ 'bg-black text-red-300': data.data === orderBy }"
          class="
            px-2
            py-2
            hover:bg-black
            rounded
            capitalize
            hover:text-red-300
            mb-2
            mr-2
          "
          @click="setOrderBy(data)"
        >
          {{ data.name }}
        </BButton>
      </div>

      <div v-if="$fetchState.pending || loading" class="flex flex-wrap mt-6">
        <Loader v-for="(loader, index) in 6" :key="index" class="mr-3 mb-3" />
      </div>
      <div v-else class="flex flex-wrap w-full">
        <StakedRealm
          v-for="realm in displayedSRealms"
          :key="realm.id"
          :realm="realm"
        />
        <!--<RealmCard :id="realm.token_id" :realm="realm" />-->
      </div>

      <div v-if="!$fetchState.pending">
        <button
          class="bg-black rounded px-4 py-2 hover:bg-gray-700"
          @click="fetchMoreRealms"
        >
          {{ loading ? 'loading' : 'Load More Realms' }}
        </button>
      </div>
    </div>
  </section>
</template>

<script>
import { defineComponent, ref, useFetch } from '@nuxtjs/composition-api'
// import axios from 'axios'
import { useFormatting } from '~/composables/useFormatting'
import { useRealms } from '~/composables/web3/useRealms'

export default defineComponent({
  setup(props, context) {
    const { shortenHash } = useFormatting()
    const { getSRealms, sRealms, loading } = useRealms()

    const adventurer = ref(null)
    const usersGold = ref(null)
    const search = ref()
    const openSeaData = ref()
    const orderBy = ref()
    const skip = ref(0)
    const displayedSRealms = ref()
    const filtersOpen = ref(false)
    const first = ref(8)
    const orderByData = [
      {
        data: 'sale_date',
        name: 'rarity',
      },
      {
        data: 'sale_price',
        name: 'last staked',
      },
    ]
    const filterByData = [
      {
        data: 'sale_date',
        name: 'resource',
      },
      {
        data: 'sale_price',
        name: 'wonder',
      },
    ]
    const searchFilter = async (resources) => {
      const resourceNumbers = resources.map((item) => {
        return parseInt(item)
      })
      await getSRealms({ resources: resourceNumbers, first: first.value })
      displayedSRealms.value = sRealms.value
    }
    /* const baseAssetAddress =
      'https://api.opensea.io/api/v1/assets?asset_contract_address=0x7afe30cb3e53dba6801aa0ea647a0ecea7cbe18d&limit=50'

    const getOSData = async () => {
      if (orderBy.value) {
        return await axios.get(
          baseAssetAddress +
            '&offset=' +
            offset.value +
            '&order_by=' +
            orderBy.value,
          {
            headers: {
              'X-API-KEY': process.env.OPENSEA,
            },
          }
        )
      } else {
        return await axios.get(baseAssetAddress + '&offset=' + offset.value, {
          headers: {
            'X-API-KEY': process.env.OPENSEA,
          },
        })
      }
    } */

    const { fetch } = useFetch(async () => {
      await getSRealms({ first: first.value })
      displayedSRealms.value = sRealms.value
    })

    const setOrderBy = async (data) => {
      skip.value = 0
      orderBy.value = data.data
      await fetch()
    }

    const submitSearch = () => {
      if (search.value > 0 && search.value <= 8000) {
        context.root.$router.push(`/realms/${search.value}`)
      }
    }

    const fetchMoreRealms = async () => {
      first.value = 8
      skip.value = skip.value + 8
      try {
        await getSRealms({ skip: skip.value, first: first.value })
        displayedSRealms.value = displayedSRealms.value.concat(sRealms.value)
      } catch (e) {
        console.log(e)
      }
    }

    return {
      adventurer,
      searchFilter,
      shortenHash,
      usersGold,
      openSeaData,
      loading,
      submitSearch,
      search,
      displayedSRealms,
      fetchMoreRealms,
      orderByData,
      setOrderBy,
      filterByData,
      orderBy,
      sRealms,
      filtersOpen,
    }
  },
})
</script>
