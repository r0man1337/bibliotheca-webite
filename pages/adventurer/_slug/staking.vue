<template>
  <div class="container">
    <div>
      <h2>Select Realm to Settle</h2>
    </div>
    <div v-if="!realmsLoading" class="flex flex-wrap">
      <div
        v-for="(realm, index) in userRealms.l2"
        :key="index"
        class="p-2 w-80"
      >
        <div class="mx-2 bg-black rounded-xl p-4">
          <h3>#{{ realm.id }}</h3>
          <button
            class="bg-gray-900 rounded w-full px-4 py-2"
            @click="stakeRealm(realm.id)"
          >
            Settle Realm
          </button>
        </div>
      </div>
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
    const { getUserRealms, userRealms, loading: realmsLoading } = useRealms()
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
      await getUserRealms(slug, 'arbitrumRinkeby')
    })

    const stakedRealms = {
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
    }

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
      realmsLoading,
    }
  },
})
</script>
