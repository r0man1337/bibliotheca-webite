<template>
  <div class="container bg-gray-900 flex p-8">
    <div class="w-4/12">
      <h3 class="uppercase">Choose Your Realm</h3>
      <div class="flex justify-between flex-wrap">
        <div v-if="sRealms" class="overflow-scroll h-screen">
          <RaidingRealm
            v-for="(realm, index) in sRealms"
            :key="index"
            :realm="realm"
          />
        </div>
      </div>
    </div>
    <div class="w-4/12 flex flex-col self-center">
      <div class="w-full flex">
        <WarriorFighting
          v-if="loading.raidingRealm"
          class="self-center mx-auto"
        />
        <WarriorStanding v-else-if="raiding" class="self-center mx-auto" />
        <WarriorRunning v-else class="self-center mx-auto" />
        <BButton
          class="self-center mx-auto text-xl flex"
          type="primary"
          @click.native="raidingRealm(sRealms[0].id, raidedRealm.id)"
          @mouseenter.native="raiding = false"
          @mouseleave.native="raiding = true"
        >
          <span class="text-3xl">⚔️</span>
          <span class="self-center ml-3">{{
            loading.raidingRealm ? 'RAIDING!!!' : 'Raid'
          }}</span>
        </BButton>
        <WarriorFighting
          v-if="loading.raidingRealm"
          inverse
          class="self-center mx-auto"
        />
        <WarriorStanding
          v-else-if="raiding"
          inverse
          class="self-center mx-auto"
        />
        <WarriorRunning v-else inverse class="self-center mx-auto" />
      </div>
      <div class="text-center bg-gray-800 rounded-xl shadow p-6">
        <div class="text-4xl font-display mb-3">
          Vault:
          <span v-if="balance">{{ balanceRounded }} units </span>
        </div>

        <div class="flex justify-around">
          <div v-if="balance" class="flex flex-col text-left text-2xl">
            <RaidedResource
              v-for="(resource, index) in raidedRealm.resources"
              :key="index"
              :resource="resource"
              :realm-id="raidedRealm.id"
              :vault="balanceRounded"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="w-4/12">
      <h3 class="uppercase text-center">Raiding Realm</h3>
      <div class="flex justify-between flex-wrap">
        <RaidingRealm class="ml-auto" :realm="raidedRealm" />
      </div>
    </div>
  </div>
</template>
<script>
import { useWeb3 } from '@instadapp/vue-web3'
import {
  useFetch,
  defineComponent,
  computed,
  ref,
} from '@nuxtjs/composition-api'
import { useAdventurer } from '~/composables/useAdventurer'
import { useStaking } from '~/composables/staking/useStaking'
import { useRaiding } from '~/composables/military/useRaiding'
export default defineComponent({
  props: {
    raidedRealm: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const { raidingRealm, loading, raidResults } = useRaiding()
    const { getAdventurer, adventurer } = useAdventurer()
    const { account } = useWeb3()

    const { getRealmsResourceBalance, balance } = useStaking()
    useFetch(async () => {
      await getRealmsResourceBalance(props.raidedRealm.id)
      await getAdventurer(account.value, 'l2')
    })
    const sRealms = computed(() => {
      return adventurer.value.l2?.srealms || []
    })

    const balanceRounded = computed(() => {
      return Math.floor((balance.value.month / 3600).toFixed(0))
    })

    const raiding = ref(true)
    return {
      raiding,
      raidResults,
      adventurer,
      sRealms,
      balance,
      balanceRounded,
      raidingRealm,
      loading,
    }
  },
})
</script>
