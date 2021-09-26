<template>
  <span
    :class="getColour(resource.value)"
    class="px-4 py-1 rounded text-sm mb-1 mr-2"
    >{{ resource.value }}
    <slot />
  </span>
</template>
<script>
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  props: {
    resource: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const colour = [
      {
        value: 'Wood',
        colour: 'bg-yellow-900',
      },
      {
        value: 'Stone',
        colour: 'bg-gray-300 text-gray-800',
      },
      {
        value: 'Coal',
        colour: 'bg-gray-600',
      },
      {
        value: 'Copper',
        colour: 'bg-yellow-500',
      },
      {
        value: 'Obsidian',
        colour: 'bg-black',
      },
      {
        value: 'Silver',
        colour: 'bg-gray-200 text-gray-700',
      },
      {
        value: 'Ironwood',
        colour: 'bg-red-700',
      },
      {
        value: 'Cold Iron',
        colour: 'bg-red-300 text-red-700',
      },
      {
        value: 'Gold',
        colour: 'bg-yellow-300 text-yellow-700',
      },
      {
        value: 'Hartwood',
        colour: 'bg-red-300',
      },
      {
        value: 'Diamonds',
        colour: 'bg-purple-100 text-purple-400',
      },
      {
        value: 'Sapphire',
        colour: 'bg-blue-500',
      },
      {
        value: 'Deep Crystal',
        colour: 'bg-blue-300',
      },
      {
        value: 'Ruby',
        colour: 'bg-red-600',
      },
      {
        value: 'Ignium',
        colour: 'bg-red-500 text-yellow-200',
      },
      {
        value: 'Ethereal Silica',
        colour: 'bg-green-500',
      },
      {
        value: 'True Ice',
        colour: 'bg-white text-blue-700',
      },
      {
        value: 'Twilight Quartz',
        colour: 'bg-purple-700',
      },
      {
        value: 'Alchemical Silver',
        colour: 'bg-gray-400',
      },
      {
        value: 'Adamantine',
        colour: 'bg-blue-900',
      },
      {
        value: 'Mithral',
        colour: 'bg-blue-400',
      },
      {
        value: 'Dragonhide',
        colour: 'bg-pink-500',
      },
    ]

    const getColour = (value) => {
      return colour.find((c) => c.value === value).colour
    }
    return {
      getColour,
    }
  },
})
</script>
