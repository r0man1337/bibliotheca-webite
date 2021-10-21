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

        <BButton type="primary" @click="claimLords">Claim all lords</BButton>
        <span v-if="lordsError">{{ lordsError.lords }}</span>
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

import { useWeb3 } from '@instadapp/vue-web3'

import { useRealms } from '~/composables/web3/useRealms'
import { useLords } from '~/composables/lords/useLords'
import { useStaking } from '~/composables/staking/useStaking'
import { useNetwork } from '~/composables/web3/useNetwork'
// import { useWeb3Modal } from '~/composables/web3/useWeb3Modal'
export default defineComponent({
  setup(props, context) {
    const { slug } = context.root.$route.params
    const { getUserSRealms, sRealms } = useRealms()
    const {
      claimLords,
      getWorldAge,
      worldAge,
      error: lordsError,
      getTimeToNextAge,
      timeNextAge,
    } = useLords()
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
      await getWorldAge()
      await getUserSRealms(slug, 'arbitrumRinkeby')
      await getTimeToNextAge()
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
      claimLords,
      lordsError,
      getWorldAge,
      worldAge,
      getTimeToNextAge,

      timeNextAge,
    }
  },
})
</script>
