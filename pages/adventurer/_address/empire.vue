<template>
  <div class="w-full">
    <div class="flex flex-wrap space-x-4">
      <DataCard>
        <h5 class="text-red-200 uppercase text-center">Total Realms Settled</h5>
        <div v-if="sRealms.length" class="text-6xl p-4 text-center">
          {{ adventurer.l2.srealmsHeld }}
        </div>
        <BButton class="mt-auto" type="primary" @click="claimAllResources()"
          >Claim all your resources</BButton
        >
      </DataCard>
      <DataCard class="w-40">
        <h5 class="text-red-200 uppercase text-center">Age</h5>
        <div v-if="worldAge" class="text-6xl text-center p-4">
          {{ worldAge }}
        </div>
        <no-ssr>
          <vac
            v-if="timeNextAge"
            class="text-center"
            :end-time="new Date().getTime() + (86400000 - timeNextAge * 1000)"
          >
            <span slot="process" slot-scope="{ timeObj }">{{
              `Time Left in Age: ${timeObj.h}:${timeObj.m}:${timeObj.s}`
            }}</span>
          </vac>
        </no-ssr>
      </DataCard>
      <DataCard>
        <h5 class="text-red-200 uppercase text-center">Lords</h5>
        <div class="mt-auto">
          <BButton
            :loading="loadingLords.claim"
            type="primary"
            @click="claimLords"
            >Claim all lords</BButton
          >
          <span v-if="lordsError">{{ lordsError.lords }}</span>
        </div>
      </DataCard>
    </div>
    <div class="mt-8">
      <h2>Settled Realms</h2>
    </div>
    <div v-if="sRealms.length" class="flex flex-wrap">
      <StakedRealm
        v-for="realm in adventurer.l2.srealms"
        :key="realm.id"
        :realm="realm"
        @unsettle="popFromArray"
      />
    </div>
    <div v-else-if="loadingSRealms">
      <Loader />
    </div>
    <div v-else>No settled Realms yet</div>
  </div>
</template>
<script>
import { defineComponent, onMounted, computed } from '@vue/composition-api'

import { useWeb3 } from '@instadapp/vue-web3'
import { useLords } from '~/composables/lords/useLords'
import { useStaking } from '~/composables/staking/useStaking'
import { useNetwork } from '~/composables/web3/useNetwork'
import { useAdventurer } from '~/composables/useAdventurer'
// import { useWeb3Modal } from '~/composables/web3/useWeb3Modal'
export default defineComponent({
  setup(props, context) {
    const { address } = context.root.$route.params
    const {
      getAdventurer,
      adventurer,
      loading: loadingSRealms,
    } = useAdventurer()

    const {
      claimLords,
      getWorldAge,
      worldAge,
      error: lordsError,
      getTimeToNextAge,
      loading: loadingLords,
      timeNextAge,
    } = useLords()
    const {
      activeNetworkId,
      checkForNetworkMismatch,
      networkMismatch,
      useL2Network,
    } = useNetwork()
    // const { open } = useWeb3Modal()
    const { account } = useWeb3()

    const {
      stakeRealm,
      claimResources,
      claimAllResources,
      claimBalance,
      realmBalance,
      loading,
      error,
      result,
    } = useStaking()

    const sRealms = computed(() => {
      return adventurer.l2?.srealms || []
    })

    onMounted(async () => {
      await getWorldAge()
      await getAdventurer(address, 'l2')
      await getTimeToNextAge()
      activeNetworkId.value = useL2Network.value.id
      if (account.value) {
        if (networkMismatch.value) {
          checkForNetworkMismatch()
        }
      }
    })

    const popFromArray = (value) => {
      const index = adventurer.l2.srealms.map((e) => e.id).indexOf(value)
      adventurer.l2.srealms.splice(index, 1)
    }

    return {
      adventurer,
      popFromArray,
      stakeRealm,
      claimResources,
      claimAllResources,
      claimBalance,
      realmBalance,
      loading,
      error,
      result,
      sRealms,
      claimLords,
      lordsError,
      getWorldAge,
      worldAge,
      getTimeToNextAge,
      loadingLords,
      timeNextAge,
      loadingSRealms,
    }
  },
})
</script>
