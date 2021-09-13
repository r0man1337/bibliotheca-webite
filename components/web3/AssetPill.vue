<template>
  <div class="rounded border border-gray-400 p-2 my-4">#{{ asset.id }}</div>
</template>
<script>
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  props: {
    asset: {
      type: Object,
      required: true,
    },
  },
  setup() {},
})
</script>
