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
    const suffixArray = [
      '',
      'Power',
      'Giants',
      'Titans',
      'Skill',
      'Perfection',
      'Brilliance',
      'Enlightenment',
      'Protection',
      'Anger',
      'Rage',
      'Fury',
      'Vitriol',
      'the Fox',
      'Detection',
      'Reflection',
      'the Twins',
    ]

    const gaOrders = [
      {
        order: '',
        colour: '',
      },
      {
        order: 'Power',
        colour: '#191d7e',
      },
      {
        order: 'Giants',
        colour: '#dac931',
      },
      {
        order: 'Titans',
        colour: '#b45fbb',
      },
      {
        order: 'Skill',
        colour: '#1fad94',
      },
      {
        order: 'Perfection',
        colour: '#2c1a72',
      },
      {
        order: 'Brilliance',
        colour: '#36662a',
      },
      {
        order: 'Enlightenment',
        colour: '#78365e',
      },
      {
        order: 'Protection',
        colour: '#4f4b4b',
      },
      {
        order: 'Anger',
        colour: '#9b1414',
      },
      {
        order: 'Rage',
        colour: '#77ce58',
      },
      {
        order: 'Fury',
        colour: '#c07a28',
      },
      {
        order: 'Vitriol',
        colour: '#511d71',
      },
      {
        order: 'the Fox',
        colour: '#949494',
      },
      {
        order: 'Detection',
        colour: '#db8f8b',
      },
      {
        order: 'Reflection',
        colour: '#318c9f',
      },
      {
        order: 'the Twins',
        colour: '#00ae3b',
      },
    ]

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
