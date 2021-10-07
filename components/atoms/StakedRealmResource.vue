<template>
  <div class="my-1 flex justify-between">
    <span
      >{{ findResources.trait }}: {{ output }}
      <span class="text-gray-600">p/day</span>
    </span>
    <button
      class="
        border border-gray-600
        rounded
        px-2
        py-1
        text-sm
        hover:bg-gray-600
        font-body
      "
      @click="upgradeResource(realmId, resource, [1, 2, 3], [1, 1, 1])"
    >
      Upgrade
    </button>
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
      type: String,
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
