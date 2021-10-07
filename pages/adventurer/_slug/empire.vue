<template>
  <div class="container">
    <div class="flex flex-wrap">
      <DataCard>
        <h5 class="uppercase text-red-400">Total Staked Realms</h5>
        <div class="text-4xl p-4 text-center">3</div>
      </DataCard>
    </div>
    <div class="mt-8">
      <h2>Staked Realms</h2>
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
export default defineComponent({
  setup(props, context) {
    const { slug } = context.root.$route.params
    const { getUserSRealms, sRealms } = useRealms()
    const {
      stakeRealm,
      claimResources,
      claimBalance,
      realmBalance,
      loading,
      error,
      result,
    } = useStaking()

    onMounted(async () => {
      await getUserSRealms(slug, 'arbitrumRinkeby')
    })

    return {
      stakeRealm,
      claimResources,
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
