<template>
  <div
    class="
      bg-black
      border-2 border-gray-800
      rounded-xl
      mr-8
      my-4
      text-white
      transform
      hover:-translate-y-2
      transition
      duration-150
      min-h-80
      hover:shadow-2xl
      flex flex-col
      group
      p-4
      w-80
    "
  >
    <h4>#{{ realm.id }}</h4>
    <h2>{{ realm.name }}</h2>
    <div class="my-3">
      <span class="uppercase text-red-400">days unclaimed</span> <br />
      <span>{{ balance / 86400 }} </span>
    </div>
    <div class="my-3">
      <span class="uppercase text-red-400">Resources</span> <br />
      <StakedRealmResource
        v-for="(resource, index) in realm.resources"
        :key="index"
        :resource="resource"
      />
    </div>
    <button
      class="bg-gray-900 rounded w-full px-4 py-2 mt-4"
      @click="claimResources(1)"
    >
      Claim Resources
    </button>
  </div>
</template>
<script>
import { defineComponent, onMounted, ref } from '@vue/composition-api'
import { useStaking } from '~/composables/staking/useStaking'
export default defineComponent({
  props: {
    realm: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const {
      getRealmsResourceBalance,
      getRealmsResourceIds,
      claimResources,
      claimBalance,
      loading,
      error,
      result,
    } = useStaking()

    const balance = ref()
    const ids = ref()

    onMounted(async () => {
      balance.value = await getRealmsResourceBalance(props.realm.id)
      ids.value = await getRealmsResourceIds(props.realm.id)
    })

    return {
      claimResources,
      getRealmsResourceBalance,
      claimBalance,
      balance,
      loading,
      error,
      result,
      ids,
    }
  },
})
</script>
