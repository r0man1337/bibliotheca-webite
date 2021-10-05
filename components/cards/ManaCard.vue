<template>
  <div
    class="
      bg-black
      border-2 border-gray-800
      p-4
      rounded-xl
      mr-8
      my-4
      text-white
      transform
      hover:-translate-y-2
      transition
      duration-150
      min-h-80
      cursor-pointer
      hover:shadow-2xl
      flex flex-col
      group
      hover:border-green-300
      h-64
    "
    @click="navigate"
  >
    <span class="text-2xl"> #{{ mana.id }} </span>
    <span
      :style="'color:' + rarityColor(mana.itemName)"
      class="text-2xl mt-4"
      >{{ mana.itemName }}</span
    >
    <div class="mt-auto">
      <!-- <span>Distilled from Loot bag #{{ mana.lootTokenId.id }}</span> -->
      <div
        class="px-3 py-1 w-full rounded text-xl"
        :style="'background:' + orderGA.colour"
      >
        {{ orderGA.order }}
      </div>
    </div>
  </div>
</template>
<script>
import { defineComponent, computed } from '@vue/composition-api'
import { useFormatting } from '~/composables/useFormatting'
import { useLootRarity } from '~/composables/useLootRarity'
import { gaOrders, suffixArray } from '~/composables/ordersData'
export default defineComponent({
  props: {
    mana: {
      type: Object,
      required: true,
    },
  },
  setup(props, context) {
    const { rarityColor } = useLootRarity()
    const { shortenHash } = useFormatting()
    const navigate = () => {
      const url = '0xf4b6040a4b1b30f1d1691699a8f3bf957b03e463'
      window.open(
        'https://opensea.io/assets/' + url + '/' + props.mana.id,
        '_blank'
      )
    }

    const orderGA = computed(() => {
      return gaOrders[props.mana.suffixId]
    })

    return {
      shortenHash,
      navigate,
      rarityColor,
      suffixArray,
      orderGA,
    }
  },
})
</script>
