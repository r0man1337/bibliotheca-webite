<template>
  <div class="text-xl">{{ resource.name }}</div>
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
  setup(props) {},
})
</script>
