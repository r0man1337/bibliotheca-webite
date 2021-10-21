<template>
  <div class="container flex">
    <div class="bg-black p-6 rounded-2xl w-1/2 shadow-2xl">
      <h2 class="uppercase text-red-400 text-center">The Iron Bank</h2>
      <!-- <span>
        <span class="text-3xl">
          <span v-if="goldBalance" class="text-yellow-400">{{
            goldBalance
          }}</span>
          <span v-else>...</span>
          Adventurers Gold</span
        >
        <br />
        <span class="text-xl text-gray-400"
          >${{
            (usersGold * goldPrice)
              .toFixed(2)
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
          }}
          USD
        </span>
      </span> -->
      <br />
      <span v-if="lordsBalance" class="text-3xl"
        >LORDS: {{ lordsBalance }} 👑
      </span>
      <table class="table-fixed w-full">
        <thead>
          <tr class="text-xl text-left">
            <th class="w-1/2">Resource</th>
            <th class="w-1/4">Balance</th>
            <th class="w-1/4">Production p/day</th>
          </tr>
        </thead>
        <tbody>
          <ResourceRow
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
