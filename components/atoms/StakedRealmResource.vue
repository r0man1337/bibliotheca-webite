<template>
  <div class="text-xl my-1">
    <span>{{ findResources.trait }}</span>
  </div>
</template>
<script>
import { defineComponent, computed } from '@nuxtjs/composition-api'
import ResourceData from '~/composables/resource.json'
export default defineComponent({
  props: {
    resource: {
      type: Object,
      required: true,
    },
    realmId: {
      type: Number,
      required: true,
    },
  },
  setup(props) {
    const findResources = computed(() => {
      return ResourceData.find((a) => a.id === parseInt(props.resource))
    })
    return {
      findResources,
    }
  },
})
</script>
