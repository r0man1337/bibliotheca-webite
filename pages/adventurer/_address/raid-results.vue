<template>
  <div v-if="adventurer" class="w-full">
    <div class="flex flex-wrap space-x-4">
      <div v-if="adventurer.l2 && adventurer.l2.raiderResults">
        <h3>Raiding Results</h3>
        <RaidingResultsTable :results="adventurer.l2.raiderResults" />
      </div>
    </div>
    <div class="flex flex-wrap space-x-4">
      <div v-if="adventurer.l2 && adventurer.l2.defenderResults" class="mt-8">
        <h3>Defensive Results</h3>
        <RaidingResultsTable :results="adventurer.l2.defenderResults" />
      </div>
    </div>
  </div>
</template>
<script>
import { defineComponent, onMounted } from '@vue/composition-api'

import { useAdventurer } from '~/composables/useAdventurer'
// import { useWeb3Modal } from '~/composables/web3/useWeb3Modal'
export default defineComponent({
  setup(props, context) {
    const { address } = context.root.$route.params
    const { getAdventurer, adventurer, loading } = useAdventurer()

    onMounted(async () => {
      if (!adventurer.value?.l2) {
        await getAdventurer(address, 'l2')
      }
    })
    return { adventurer, loading }
  },
})
</script>
