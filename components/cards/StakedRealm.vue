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
    <img v-if="metaData" class="rounded-xl" :src="metaData.image_url" alt="" />
    <Loader v-else />
    <div class="p-2">
      <h4>#{{ realm.id }}</h4>
      <!-- <h2>{{ realm.name }}</h2> -->
      <div class="my-3">
        <span class="uppercase text-red-400">days unclaimed</span> <br />
        <span>{{ balance / 86400 }} </span>
      </div>
      <div class="my-3">
        <span class="uppercase text-red-400">Resources</span> <br />
        <StakedRealmResource
          v-for="(resource, index) in ids"
          :key="index"
          :resource="resource"
          :realm-id="realm.id"
        />
      </div>
      <div class="my-3">
        <span class="uppercase text-red-400">Buildings</span> <br />
        <span>Aquaducts: {{ aquaducts }}</span>
      </div>
      <button
        class="bg-gray-900 rounded w-full px-4 py-2 mt-4"
        @click="claimResources(realm.id)"
      >
        <LoadingRings v-if="loading.stake" class="mx-auto w-7 h-7" />
        <span v-else>Claim Resources</span>
      </button>
      <button
        class="bg-gray-900 rounded w-full px-4 py-2 mt-4"
        @click="withdraw(realm.id)"
      >
        <LoadingRings v-if="loading.stake" class="mx-auto w-7 h-7" />
        <span v-else>Unstake</span>
      </button>
      <button
        class="bg-gray-900 rounded w-full px-4 py-2 mt-4"
        @click="constructBuilding(realm.id, 1, [1, 2, 3], [2, 2, 2])"
      >
        <LoadingRings v-if="loading.stake" class="mx-auto w-7 h-7" />
        <span v-else>Build Aquaduct</span>
      </button>
      <div
        v-if="error.stake"
        class="text-red-500 py-1 px-3 rounded bg-red-200 mt-2"
      >
        {{ error.stake }}
      </div>
    </div>
  </div>
</template>
<script>
import { defineComponent, onMounted, ref } from '@vue/composition-api'
import axios from 'axios'
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
      claimBalance,
      loading,
      error,
      result,
      withdraw,
    } = useStaking()

    const {
      constructBuilding,
      getAquaducts,
      loading: loadingConstruction,
      error: errorConstruction,
      result: resultConstruction,
    } = useConstruction()

    const balance = ref()
    const ids = ref()
    const metaData = ref()
    const aquaducts = ref()

    onMounted(async () => {
      balance.value = await getRealmsResourceBalance(props.realm.id)
      ids.value = await getRealmsResourceIds(props.realm.id)
      const response = await fetchRealmMetaData(props.realm.id)
      metaData.value = response.data
      aquaducts.value = await getAquaducts(props.realm.id)
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

    return {
      claimResources,
      getRealmsResourceBalance,
      claimBalance,
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
      getAquaducts,
      aquaducts,
    }
  },
})
</script>
