<template>
  <section>
    <div>
      <h1>Realms</h1>

      <form class="flex sm:w-1/3" method="POST" @submit.prevent="submitSearch">
        <input
          v-model="search"
          placeholder="insert realm id"
          class="bg-black rounded px-4 py-2 text-xl w-2/3"
          type="text"
        />
        <BButton class="ml-3 w-1/3 text-sm" type="primary">find realm</BButton>
      </form>

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
      <div>
        <span
          >Final rarity is still being determined until mint finishes. Higher
          numbers are more rare, and range between 5 and 8300.</span
        >
      </div>

      <div v-if="!$fetchState.pending" class="flex flex-wrap w-full">
        <div v-for="realm in openSeaData" :key="realm.id" class="w-80">
          <RealmCard :id="realm.token_id" :realm="realm">
            <div class="relative">
              <img
                v-if="realm.image_url"
                class="rounded-xl p-1"
                :src="realm.image_url"
              />
              <div
                v-else
                class="
                  bg-gray-100
                  text-black
                  p-2
                  rounded
                  flex
                  self-center
                  h-48
                  w-full
                  justify-between
                "
              >
                no image yet
              </div>
              <RealmRarity
                class="absolute top-10 right-10"
                :traits="realm.traits"
              />
            </div>

            <div class="p-2 flex flex-wrap text-xs">
              <ResourceChip
                v-for="(resource, index) in resources(realm.traits)"
                :key="index"
                class="mr-2 my-1"
                :resource="resource"
              />
            </div>
            <div
              v-if="wonder(realm.traits)"
              class="
                px-2
                text-center
                border-white
                rounded
                py-1
                border
                mx-2
                mb-2
              "
            >
              {{ wonder(realm.traits).value }}
            </div>
            <div class="px-4">
              <h4>{{ realm.name }} - #{{ realm.token_id }}</h4>
              <h6 class="text-gray-500">Realm sales: {{ realm.num_sales }}</h6>
              <h6 v-if="realm.last_sale" class="text-gray-500">
                Last sale price:
                {{ intRoundFloor(realm.last_sale.total_price) / 10 ** 18 }} ETH
              </h6>
            </div>
          </RealmCard>
        </div>
      </div>
      <div v-else class="flex flex-wrap mt-6">
        <Loader v-for="(loader, index) in 6" :key="index" class="mr-3 mb-3" />
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
import axios from 'axios'
import { useFormatting } from '~/composables/useFormatting'
import { useBigNumber } from '~/composables/web3/useBigNumber'
export default defineComponent({
  setup(props, context) {
    const { shortenHash } = useFormatting()
    const { intRoundFloor } = useBigNumber()
    const adventurer = ref(null)
    const usersGold = ref(null)
    const search = ref()
    const openSeaData = ref()
    const loading = ref()
    const orderBy = ref()
    const offset = ref(0)

    const orderByData = [
      {
        data: 'sale_date',
        name: 'sale date',
      },
      {
        data: 'sale_count',
        name: 'sale count',
      },
      {
        data: 'sale_price',
        name: 'sale price',
      },
    ]

    const baseAssetAddress =
      'https://api.opensea.io/api/v1/assets?asset_contract_address=0x7afe30cb3e53dba6801aa0ea647a0ecea7cbe18d&limit=50'

    const getOSData = async () => {
      if (orderBy.value) {
        return await axios.get(
          baseAssetAddress +
            '&offset=' +
            offset.value +
            '&order_by=' +
            orderBy.value
        )
      } else {
        return await axios.get(baseAssetAddress + '&offset=' + offset.value)
      }
    }

    const { fetch } = useFetch(async () => {
      const response = await getOSData()
      openSeaData.value = response.data.assets
    })

    const setOrderBy = async (data) => {
      offset.value = 0
      orderBy.value = data.data
      await fetch()
    }

    const submitSearch = () => {
      if (search.value > 0 && search.value <= 8000) {
        context.root.$router.push(`/realms/${search.value}`)
      }
    }

    const resources = (traits) => {
      return traits.filter((resource) => resource.trait_type === 'Resource')
    }

    const wonder = (traits) => {
      return traits.find(
        (resource) => resource.trait_type === 'Wonder (translated)'
      )
    }

    const fetchMoreRealms = async () => {
      loading.value = true
      offset.value = offset.value + 50
      try {
        const response = await getOSData()
        const newRealms = response.data.assets
        openSeaData.value = openSeaData.value.concat(newRealms)
      } catch (e) {
        console.log(e)
      } finally {
        loading.value = false
      }
    }

    return {
      adventurer,
      shortenHash,
      usersGold,
      openSeaData,
      loading,
      submitSearch,
      search,
      resources,
      fetchMoreRealms,
      wonder,
      orderByData,
      setOrderBy,
      orderBy,
      intRoundFloor,
    }
  },
})
</script>
