<template>
  <div class="container mx-auto">
    <div class="w-full text-center">
      <h1>Raiding Leaderboard</h1>
      <p class="text-2xl">Find the top Raiders, & the most raided Realms.</p>

      <h2 class="mt-8">Top Raiders</h2>
      <RaidingResultsLeaderboardTable type="raid" :results="raiderResults" />

      <h2 class="mt-8">Top Defenders</h2>
      <RaidingResultsLeaderboardTable
        type="defend"
        :results="defenderResults"
      />
    </div>
  </div>
</template>
<script>
import { defineComponent, useFetch, ref } from '@nuxtjs/composition-api'
import { useRaiding } from '~/composables/military/useRaiding'

export default defineComponent({
  setup() {
    const { getAdventurerRaidResults } = useRaiding()
    const raiderResults = ref([])
    const defenderResults = ref([])
    const raiderFilters = ref({
      orderBy: 'raidAttacks',
      orderDirection: 'desc',
    })
    const defenderFilters = ref({
      orderBy: 'raidDefends',
      orderDirection: 'desc',
    })
    useFetch(async () => {
      raiderResults.value = await getAdventurerRaidResults(raiderFilters)
      defenderResults.value = await getAdventurerRaidResults(defenderFilters)
    })
    return {
      raiderResults,
      defenderResults,
    }
  },
})
</script>
