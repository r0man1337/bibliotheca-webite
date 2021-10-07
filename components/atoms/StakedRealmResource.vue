<template>
  <div class="text-xl my-1">
    <span
      >{{ findResources.trait }}: {{ output }}
      <button
        class="bg-gray-800 px-2 py-1"
        @click="upgradeResource(realmId, resource, [1, 2, 3], [2, 2, 2])"
      >
        Upgrade
      </button></span
    >
  </div>
</template>
<script>
import {
  defineComponent,
  computed,
  onMounted,
  ref,
} from '@nuxtjs/composition-api'
import ResourceData from '~/composables/resource.json'
import { useResources } from '~/composables/resources/useResources'
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
    const { fetchProductionOutput, upgradeResource } = useResources()
    const findResources = computed(() => {
      return ResourceData.find((a) => a.id === parseInt(props.resource))
    })

    const output = ref()

    onMounted(async () => {
      output.value = await fetchProductionOutput(props.realmId, props.resource)
    })
    return {
      findResources,
      fetchProductionOutput,
      upgradeResource,
      output,
    }
  },
})
</script>
