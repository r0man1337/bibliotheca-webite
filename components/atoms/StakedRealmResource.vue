<template>
  <div class="my-1 flex justify-between">
    <span class="flex">
      <span
        v-if="output"
        class="border border-gray-800 rounded p-1 text-xs mr-2"
        >{{ output[0] }}</span
      >
      <span class="self-center">
        <span v-if="output && !loading.resources"
          >{{ findResources.trait }}: {{ output[1] }}</span
        >
        <span v-else class="flex"
          >{{ findResources.trait }}: <LoadingDots class="w-5"
        /></span>
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
import { defineComponent, computed, useFetch } from '@nuxtjs/composition-api'
import ResourceData from '~/composables/resource.json'
import { useResources } from '~/composables/resources/useResources'
import LoadingDots from '~/assets/img/threeDots.svg?inline'
export default defineComponent({
  components: {
    LoadingDots,
  },
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
    const { fetchProductionOutput, upgradeResource, loading, output } =
      useResources()
    const findResources = computed(() => {
      return ResourceData.find((a) => a.id === parseInt(props.resource))
    })

    useFetch(async () => {
      await fetchProductionOutput(props.realmId, props.resource)
    })

    return {
      findResources,
      fetchProductionOutput,
      upgradeResource,
      loading,
      output,
    }
  },
})
</script>
