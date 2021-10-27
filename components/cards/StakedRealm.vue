<template>
  <div
    class="
      bg-black
      rounded-xl
      mr-8
      my-4
      text-white
      transform
      transition
      duration-150
      min-h-80
      hover:shadow-2xl hover:border-gray-800
      border border-black
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
        <!-- <WarriorStanding /> -->
        <img
          v-if="metaData"
          class="rounded-xl"
          :src="metaData.image_url"
          alt=""
        />

        <Loader v-else class="w-full" />
      </div>

      <div class="p-2 flex flex-col">
        <h1 v-if="metaData" class="flex justify-between">
          <span>{{ metaData.name }}</span>
          <span class="text-gray-500 text-xl">#{{ metaData.token_id }}</span>
        </h1>
        <Ens v-if="realm" :address="realm.currentOwner.address" />

        <div class="flex justify-between">
          <div v-if="metaData && order(metaData.traits)" class="py-4">
            <OrderChip class="text-sm" :order-id="realm.order" />
          </div>
          <Happiness class="self-center" :realm="realm.id" />
          <RealmStatistics class="self-center" :realm="realm.id" />
        </div>
        <RealmAgeStats :realm="realm.id" />
        <span class="uppercase text-red-400 font-display mt-3"
          >days unclaimed</span
        >
        <div class="flex justify-between">
          <div>
            <span
              >Day:
              <span v-if="balance">{{ (balance.day / 3600).toFixed(4) }} </span>
            </span>
            <br />
            <span
              >Month:
              <span v-if="balance"
                >{{ (balance.month / (3600 * 14)).toFixed(4) }}
              </span>
            </span>
          </div>
          <div v-if="isAddressPage">
            <BButton type="small" @click="claimResources(realm.id)">
              <LoadingRings v-if="loading.stake" class="mx-auto w-7 h-7" />
              <span v-else>Claim</span>
            </BButton>
          </div>
        </div>

        <div class="my-3">
          <span class="uppercase text-red-400 font-display">Resources</span>
          <div class="text-xs">
            <span class="uppercase">LVL Resource p/day</span>
          </div>
          <StakedRealmResource
            v-for="(resource, index) in realm.resources"
            :key="index"
            :resource="resource"
            :realm-id="realm.id"
          />
        </div>
        <RaidRealm :raided-realm="realm" class="w-full" />
      </div>

      <div
        v-if="error.stake"
        class="text-red-500 py-1 px-3 rounded bg-red-200 mt-2"
      >
        {{ error.stake }}
      </div>
    </div>
    <div
      class="h-full w-full flex flex-col"
      :class="{ 'bg-white hidden': !active }"
    >
      <div class="flex p-3">
        <button class="bg-gray-900 rounded p-2 ml-auto" @click="active = false">
          Flip
        </button>
      </div>
      <div v-if="raidingArmy" class="my-3 px-2">
        <span class="uppercase text-red-400 font-display">Military</span>
        <RealmMilitary
          v-for="(unit, index) in raidingArmy"
          :key="index"
          :realm-id="realm.id"
          :unit="unit"
          :unit-id="index"
        >
        </RealmMilitary>
      </div>
      <div v-if="buildings" class="my-3 px-2">
        <span class="uppercase text-red-400 font-display">Buildings</span>
        <RealmBuildings
          v-for="(building, index) in buildings"
          :key="index"
          :building-id="index"
          :building="building"
          :realm-id="realm.id"
        />
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
      <BButton
        v-if="isAddressPage"
        class="w-full mt-auto"
        type="primary"
        @click="unsettle(realm.id)"
      >
        <LoadingRings v-if="loading.stake" class="mx-auto w-7 h-7" />
        <span v-else>Unsettle Realm</span>
      </BButton>
    </div>
  </div>
</template>
<script>
import { defineComponent, ref, computed } from '@vue/composition-api'
import axios from 'axios'
import { useFetch } from '@nuxtjs/composition-api'
import { useStaking } from '~/composables/staking/useStaking'
import { useConnect } from '~/composables/web3/useConnect'
import { useConstruction } from '~/composables/construction/useConstruction'
import LoadingRings from '~/assets/img/loadingRings.svg?inline'
import { useMilitary } from '~/composables/military/useMilitary'
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
  setup(props, context) {
    const { isAddressPage } = useConnect()
    const {
      getRealmsResourceBalance,
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

    const {
      //   buildRaiding,
      fetchRaiding,
      //   fetchUnitCost,
      raidingArmy,
    } = useMilitary()

    const metaData = ref()

    const unsettle = async (id) => {
      try {
        await withdraw(id)
      } catch (e) {
        console.log(e)
      } finally {
        context.emit('unsettle', id)
      }
    }

    useFetch(async () => {
      await getRealmsResourceBalance(props.realm.id)
      const response = await fetchRealmMetaData(props.realm.id)
      metaData.value = response.data
      await getBuildings(props.realm.id)
      await fetchRaiding(props.realm.id)
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
      unsettle,
      isAddressPage,
      raidingArmy,
    }
  },
})
</script>
