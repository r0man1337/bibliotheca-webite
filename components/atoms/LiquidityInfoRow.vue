<template>
  <tr class="text-xl font-semibold bg-opacity-85">
    <td class="p-2">
      {{ resource.trait }}
    </td>
    <td class="p-2">
      <span v-if="loading.resources"><LoadingDots class="w-8 h-2" /></span
      ><span v-else>{{ 1 }}👑 = {{ reserve / supply }}</span>
    </td>
    <td class="p-2">{{ reserve }}👑 + {{ supply }}</td>
    <td class="p-2">{{ lbalance }}</td>
  </tr>
</template>
<script>
import { useFetch, defineComponent, ref } from '@nuxtjs/composition-api'
import { useMarket } from '~/composables/market/useMarket'
import LoadingDots from '~/assets/img/threeDots.svg?inline'
export default defineComponent({
  components: {
    LoadingDots,
  },
  props: {
    resource: {
      type: Object,
      required: true,
    },
  },

  setup(props, context) {
    // const { slug } = context.root.$route.params
    // const { fetchResource, loading } = useResources()
    const {
      fetchResourceSupply,
      fetchCurrencyReserve,
      fetchLiquidityBalance,
      loading,
    } = useMarket()

    const reserve = ref()
    const supply = ref()
    const lbalance = ref()

    useFetch(async () => {
      reserve.value = await fetchCurrencyReserve(props.resource.id)
      supply.value = await fetchResourceSupply(props.resource.id)
      lbalance.value = await fetchLiquidityBalance(props.resource.id)
    })
    return {
      reserve,
      supply,
      lbalance,
      loading,
    }
  },
})
</script>
