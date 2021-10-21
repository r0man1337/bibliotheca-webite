<template>
  <span
    :class="getColour(resource.value)"
    class="
      px-4
      py-1
      rounded-lg
      text-sm
      mb-1
      mr-2
      bg-opacity-75
      shadow-2xl
      border
    "
    >{{ resource.value }}
    <slot />
  </span>
</template>
<script>
import { defineComponent } from '@vue/composition-api'
import { resources } from '@/composables/utils/resourceColours'
export default defineComponent({
  props: {
    resource: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const getColour = (value) => {
      return resources.find((c) => c.trait === value).colourClass
    }
    return {
      getColour,
    }
  },
})
</script>
