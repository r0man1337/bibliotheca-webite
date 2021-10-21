<template>
  <span :class="statusColour(status)" class="rounded-xl px-3 py-1">{{
    status
  }}</span>
</template>
<script>
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  props: {
    status: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const statusColour = (status) => {
      if (status === 'success') {
        return 'bg-green-200 text-green-800'
      } else if (status === 'pending') {
        return 'bg-blue-200 text-blue-800'
      } else if (status === 'failed') {
        return 'bg-red-200 text-red-800'
      } else {
        return 'bg-yellow-200 text-yellow-800'
      }
    }
    return {
      statusColour,
    }
  },
})
</script>
