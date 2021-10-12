<template>
  <div
    class="
      bg-black
      rounded-xl
      mr-8
      my-4
      text-white
      transform
      hover:-translate-y-2
      transition
      duration-150
      min-h-80
      hover:shadow-2xl
      flex flex-col
      group
      p-2
      w-80
    "
  >
    <div
      class="group flex flex-col h-full"
      :class="{ 'bg-white hidden': active }"
    >
      <div class="relative">
        <div
          class="
            absolute
            right-10
            opacity-0
            top-10
            group-hover:opacity-100
            transition-all
            duration-250
          "
        >
          <button
            class="bg-gray-900 rounded p-2 ml-auto"
            @click="active = true"
          >
            Flip
          </button>
        </div>
        <img
          v-if="metaData"
          class="rounded-xl"
          :src="metaData.image_url"
          alt=""
        />
        <Loader v-else class="w-full" />
      </div>

      <div class="p-2 flex flex-col">
        <h4></h4>
        <h1 v-if="metaData" class="flex justify-between">
          <span>{{ metaData.name }}</span>
          <span class="text-gray-500 text-xl">#{{ metaData.token_id }}</span>
        </h1>
        <div v-if="metaData && order(metaData.traits)" class="py-4">
          <OrderChip class="text-sm" :order="order(metaData.traits).value" />
        </div>
        <div class="my-3">
          <span class="uppercase text-red-400 font-display"
            >days unclaimed</span
          >
          <br />
          <span
            >Day:
            <span v-if="balance">{{ (balance.day / 3600).toFixed(4) }} </span>
          </span>
          <br />
          <span
            >Month:
            <span v-if="balance"
              >{{ (balance.month / (3600 * 30)).toFixed(4) }}
            </span>
          </span>
        </div>
        <div class="my-3">
          <span class="uppercase text-red-400 font-display">Resources</span>
          <div class="text-xs">
            <span class="uppercase">LVL Resource p/day</span>
          </div>
          <StakedRealmResource
            v-for="(resource, index) in ids"
            :key="index"
            :resource="resource"
            :realm-id="realm.id"
          />
        </div>
        <div v-if="buildings" class="my-3">
          <span class="uppercase text-red-400 font-display">Buildings</span>
          <br />
          <div>Markets: {{ buildings[0] }}</div>
          <div>Aquaducts: {{ buildings[1] }}</div>
          <div>Castles: {{ buildings[2] }}</div>
          <div>Ports: {{ buildings[3] }}</div>
        </div>
      </div>
      <button
        class="
          bg-gray-900
          rounded
          w-full
          px-4
          py-2
          mt-auto
          hover:bg-gray-600
          transition-all
          duration-300
        "
        @click="claimResources(realm.id)"
      >
        <LoadingRings v-if="loading.stake" class="mx-auto w-7 h-7" />
        <span v-else>Claim Resources</span>
      </button>
      <div
        v-if="error.stake"
        class="text-red-500 py-1 px-3 rounded bg-red-200 mt-2"
      >
        {{ error.stake }}
      </div>
    </div>
    <div class="h-full w-full" :class="{ 'bg-white hidden': !active }">
      <div class="flex p-3">
        <button class="bg-gray-900 rounded p-2 ml-auto" @click="active = false">
          Flip
        </button>
      </div>
      <div v-if="metaData" class="px-2">
        <Levels
          flex
          :cities="cities"
          :harbours="harbours"
          :regions="regions"
          :rivers="rivers"
        />
      </div>
      <button
        class="bg-gray-900 rounded w-full px-4 py-2 mt-4"
        @click="withdraw(realm.id)"
      >
        <LoadingRings v-if="loading.stake" class="mx-auto w-7 h-7" />
        <span v-else>Unsettle</span>
      </button>
      <button
        class="bg-gray-900 rounded w-full px-4 py-2 mt-4"
        @click="constructBuilding(realm.id, 1, [1, 2, 3], [2, 2, 2])"
      >
        <LoadingRings v-if="loading.stake" class="mx-auto w-7 h-7" />
        <span v-else>Build Aquaduct</span>
      </button>
    </div>
  </div>
</template>
<script>
import { defineComponent, ref, computed } from '@vue/composition-api'
import axios from 'axios'
import { useFetch } from '@nuxtjs/composition-api'
import { useStaking } from '~/composables/staking/useStaking'
import { useConstruction } from '~/composables/construction/useConstruction'
import LoadingRings from '~/assets/img/loadingRings.svg?inline'
export default defineComponent({
  components: {
    LoadingRings,
  },
  props: {
    realm: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const {
      getRealmsResourceBalance,
      getRealmsResourceIds,
      claimResources,
      balance,
      loading,
      error,
      result,
      withdraw,
    } = useStaking()

    const {
      constructBuilding,
      getBuildings,
      buildings,
      loading: loadingConstruction,
      error: errorConstruction,
      result: resultConstruction,
    } = useConstruction()

    const ids = ref()
    const metaData = ref()

    useFetch(async () => {
      await getRealmsResourceBalance(props.realm.id)
      ids.value = await getRealmsResourceIds(props.realm.id)
      const response = await fetchRealmMetaData(props.realm.id)
      metaData.value = response.data
      await getBuildings(props.realm.id)
    })

    const fetchRealmMetaData = async (id) => {
      try {
        return await axios.get(
          'https://api.opensea.io/api/v1/asset/0x7afe30cb3e53dba6801aa0ea647a0ecea7cbe18d/' +
            id
        )
      } catch (e) {
        console.log(e)
      }
    }

    const active = ref(false)

    const cities = computed(() => {
      return metaData.value.traits.length
        ? metaData.value.traits.find(
            (resource) => resource.trait_type === 'Cities'
          )
        : null
    })
    const harbours = computed(() => {
      return metaData.value.traits.length
        ? metaData.value.traits.find(
            (resource) => resource.trait_type === 'Harbors'
          )
        : null
    })
    const regions = computed(() => {
      return metaData.value.traits.length
        ? metaData.value.traits.find(
            (resource) => resource.trait_type === 'Regions'
          )
        : null
    })
    const rivers = computed(() => {
      return metaData.value.traits.length
        ? metaData.value.traits.find(
            (resource) => resource.trait_type === 'Rivers'
          )
        : null
    })
    const wonder = (traits) => {
      return traits.find(
        (resource) => resource.trait_type === 'Wonder (translated)'
      )
    }
    const order = (traits) => {
      return traits.find((resource) => resource.trait_type === 'Order')
    }
    return {
      claimResources,
      getRealmsResourceBalance,
      balance,
      loading,
      error,
      result,
      ids,
      metaData,
      withdraw,
      loadingConstruction,
      errorConstruction,
      resultConstruction,
      constructBuilding,
      getBuildings,
      buildings,
      active,
      cities,
      harbours,
      regions,
      rivers,
      wonder,
      order,
    }
  },
})
</script>
