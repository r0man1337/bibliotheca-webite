<template>
  <div class="my-1 flex justify-between">
    <span>
      <span v-if="output" class="border border-gray-800 rounded p-1 text-xs">{{
        output[0]
      }}</span>
      <span
        >{{ findResources.trait }}: <span v-if="output">{{ output[1] }}</span>
      </span>
    </span>

    <button
      class="
        border border-gray-800
        rounded
        px-2
        py-1
        text-xs
        hover:bg-gray-800 hover:shadow
        font-body
      "
      @click="upgradeResource(realmId, resource, output[0])"
    >
      {{ loading.resources ? 'Upgrading..' : 'Upgrade' }}
    </button>
  </div>
</template>
<script>
import {
  defineComponent,
  computed,
  ref,
  useFetch,
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
    const { fetchProductionOutput, upgradeResource, loading } = useResources()
    const findResources = computed(() => {
      return ResourceData.find((a) => a.id === parseInt(props.resource))
    })

    const output = ref()

    useFetch(async () => {
      output.value = await fetchProductionOutput(props.realmId, props.resource)
    })

    return {
      findResources,
      fetchProductionOutput,
      upgradeResource,
      output,
      loading,
    }
  },
})
</script>
