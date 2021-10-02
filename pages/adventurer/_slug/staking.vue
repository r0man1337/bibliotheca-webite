<template>
  <div class="container">
    <div>
      <h3>Select Realm to Stake</h3>
    </div>
    <div class="flex flex-wrap">
      <div class="bg-black rounded-xl p-5 w-80">
        <h3>#1</h3>
        <button class="bg-gray-900 rounded w-full p-4" @click="stakeRealm(1)">
          Stake Realm
        </button>
      </div>
      <div class="bg-black rounded-xl p-5 w-80">
        <h3>#2</h3>
        <button class="bg-gray-900 rounded w-full p-4" @click="stakeRealm(2)">
          Stake Realm
        </button>
      </div>
    </div>
    <div class="mt-8">
      <h3>Staked Realms</h3>
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
      getRealmsResourceBalance,
      claimResources,
      claimBalance,
      realmBalance,
      loading,
      error,
      result,
    } = useStaking()

    onMounted(() => {
      getUserRealms()
      getRealmsResourceBalance(1)
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
      getRealmsResourceBalance,
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
