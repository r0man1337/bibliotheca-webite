<template>
  <div class="container">
    <div class="flex flex-wrap space-x-4">
      <DataCard>
        <h5 class="text-red-200 uppercase text-center">Total Realms Settled</h5>
        <div v-if="sRealms" class="text-6xl p-4 text-center">
          {{ sRealms.length }}
        </div>
        <BButton type="primary" @click="claimAllResources()"
          >Claim all your resources</BButton
        >
      </DataCard>
    </div>
    <div class="mt-8">
      <h2>Settled Realms</h2>
    </div>
    <div v-if="sRealms" class="flex flex-wrap">
      <StakedRealm v-for="realm in sRealms" :key="realm.id" :realm="realm" />
    </div>
    <div v-else>
      <Loader />
    </div>
  </div>
</template>
<script>
import { defineComponent, onMounted } from '@vue/composition-api'

import { useRealms } from '~/composables/web3/useRealms'
import { useStaking } from '~/composables/staking/useStaking'
import { useNetwork } from '~/composables/web3/useNetwork'
// import { useWeb3Modal } from '~/composables/web3/useWeb3Modal'
import { useWeb3 } from '~/composables/web3/useWeb3'
export default defineComponent({
  setup(props, context) {
    const { slug } = context.root.$route.params
    const { getUserSRealms, sRealms } = useRealms()
    const { activeNetworkId, checkForNetworkMismatch, networkMismatch } =
      useNetwork()
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

    onMounted(async () => {
      await getUserSRealms(slug, 'arbitrumRinkeby')
      activeNetworkId.value = 'arbitrumRinkeby'
      if (account.value) {
        if (networkMismatch.value) {
          checkForNetworkMismatch()
        } else {
          await getUserSRealms(slug, 'arbitrumRinkeby')
        }
      }
    })

    return {
      stakeRealm,
      claimResources,
      claimAllResources,
      claimBalance,
      realmBalance,
      loading,
      error,
      result,
      sRealms,
    }
  },
})
</script>
