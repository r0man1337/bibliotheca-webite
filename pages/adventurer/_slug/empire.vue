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
    <div class="flex flex-wrap">
      <StakedRealm
        v-for="realm in stakedRealms"
        :key="realm.id"
        :realm="realm"
      />
    </div>
  </div>
</template>
<script>
import { defineComponent, onMounted } from '@vue/composition-api'
import { useRealms } from '~/composables/web3/useRealms'
import { useStaking } from '~/composables/staking/useStaking'
export default defineComponent({
  setup() {
    const { getUserRealms, userRealms } = useRealms()
    const {
      stakeRealm,
      claimResources,
      claimBalance,
      realmBalance,
      loading,
      error,
      result,
    } = useStaking()

    onMounted(() => {
      getUserRealms()
    })

    const stakedRealms = [
      {
        name: 'Solumn',
        id: '1',
        resources: [
          {
            name: 'Dragonhide',
            level: '2',
          },
          {
            name: 'Wood',
            level: '3',
          },
        ],
      },
    ]
    return {
      userRealms,
      stakedRealms,
      stakeRealm,
      claimResources,
      claimBalance,
      realmBalance,
      loading,
      error,
      result,
    }
  },
})
</script>
