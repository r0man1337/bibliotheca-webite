<template>
  <span class="px-4 py-2 rounded" :style="'background:' + getOrder.colour">{{
    order
  }}</span>
</template>
<script>
import { computed, defineComponent } from '@vue/composition-api'
import { gaOrders } from '~/composables/ordersData'
export default defineComponent({
  props: {
    order: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const getOrder = computed(() => {
      return gaOrders.find((a) => props.order.includes(a.order))
    })
    return {
      getOrder,
    }
  },
})
</script>
