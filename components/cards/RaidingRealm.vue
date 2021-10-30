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
    <div class="group flex flex-col h-full">
      <div class="p-2 flex flex-col">
        <h1 class="flex justify-between">
          <span>{{ realm.name }}</span>
          <span class="text-gray-500 text-xl">#{{ realm.id }}</span>
        </h1>
        <Ens v-if="realm" :address="realm.currentOwner.address" />

        <div class="flex justify-between">
          <div class="py-4">
            <OrderChip class="text-sm" :order-id="realm.order" />
          </div>
          <Happiness class="self-center" :realm="realm.id" />
          <RealmStatistics class="self-center" :realm="realm.id" />
        </div>
        <!-- <RealmAgeStats :realm="realm.id" /> -->
        <div v-if="raidingArmy" class="my-3">
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
        <span v-if="!attacking" class="uppercase text-red-400 font-display mt-3"
          >days unclaimed</span
        >
        <div v-if="!attacking" class="flex justify-between">
          <div>
            <span
              >Day:
              <span v-if="balance">{{ (balance.day / 3600).toFixed(4) }} </span>
            </span>
            <br />
            <span
              >Vault:
              <span v-if="balance"
                >{{ (balance.month / 3600).toFixed(4) }}
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

        <div v-if="!attacking" class="my-3">
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
        <BButton
          v-if="attacking"
          type="primary"
          @click="selectAttackingRealm(realm)"
          >Select Realm</BButton
        >
      </div>
    </div>
  </div>
</template>
<script>
import { defineComponent, onMounted, watch } from '@vue/composition-api'

import { useStaking } from '~/composables/staking/useStaking'
import { useConnect } from '~/composables/web3/useConnect'

import LoadingRings from '~/assets/img/loadingRings.svg?inline'
import { useRaiding } from '~/composables/military/useRaiding'
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
    attacking: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  setup(props, context) {
    const { selectAttackingRealm, selectedAttackingRealm } = useRaiding()
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
      //   buildRaiding,
      fetchRaiding,
      //   fetchUnitCost,
      raidingArmy,
    } = useMilitary()

    onMounted(async () => {
      await getRealmsResourceBalance(props.realm.id)
      await fetchRaiding(props.realm.id)
    })

    watch(selectedAttackingRealm, async () => {
      await getRealmsResourceBalance(props.realm.id)
      await fetchRaiding(props.realm.id)
    })

    return {
      claimResources,
      getRealmsResourceBalance,
      balance,
      loading,
      error,
      result,
      withdraw,
      isAddressPage,
      raidingArmy,
      selectAttackingRealm,
      selectedAttackingRealm,
    }
  },
})
</script>
