<template>
  <div class="container flex">
    <div class="bg-black p-6 rounded-2xl w-1/2 shadow-2xl">
      <h2 class="uppercase text-red-400 text-center">Resource Market</h2>

      <br />
      <table class="table-fixed w-full">
        <thead>
          <tr class="text-xl text-left">
            <th class="w-1/3">Resource</th>
            <th class="w-1/4">Rate</th>
            <th class="w-1/2">Pool</th>
            <th class="w-1/4">Your Share</th>
          </tr>
        </thead>
        <tbody>
          <LiquidityInfoRow
            v-for="(resource, index) in sortedResources"
            :key="index"
            class="even:bg-gray-900 rounded-lg"
            :resource="resource"
          />
        </tbody>
      </table>
    </div>
  </div>
</template>
<script>
import { useFetch, defineComponent } from '@nuxtjs/composition-api'
import { resources } from '@/composables/utils/resourceColours'
import { useLords } from '~/composables/lords/useLords'
import { usePrice } from '~/composables'
export default defineComponent({
  setup(props, context) {
    const { goldPrice } = usePrice()
    const { slug } = context.root.$route.params
    const {
      getAdventurersLords,
      lordsBalance,
      worldAge,
      error,
      goldBalance,
      getAdventurersGold,
    } = useLords()
    const filteredResources = resources.filter((d) => {
      return d.value > 1
    })

    const sortedResources = filteredResources.sort((a, b) => {
      return b.value - a.value
    })
    useFetch(async () => {
      await getAdventurersLords(slug)
      // await getAdventurersGold(slug)
    })
    return {
      getAdventurersLords,
      lordsBalance,
      worldAge,
      sortedResources,
      error,
      goldBalance,
      getAdventurersGold,
      goldPrice,
    }
  },
})
</script>
