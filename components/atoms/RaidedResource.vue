<template>
  <div class="my-1 flex justify-between">
    <span class="flex">
      <span
        v-if="output"
        :class="findResources(resource.id).colourClass"
        class="rounded p-1 text-sm mr-2 bg-opacity-75"
        >{{ output[0] }}</span
      >
      <span class="self-center">
        <span v-if="output && !loading.resources"
          >{{ findResources(resource.id).trait }}:
          {{ output[1] * vault }} units</span
        >
        <span v-else class="flex"
          >{{ findResources(resource.id).trait }}: <LoadingDots class="w-5"
        /></span>
      </span>
    </span>
  </div>
</template>
<script>
import { defineComponent, useFetch } from '@nuxtjs/composition-api'
import { resources } from '@/composables/utils/resourceColours'
import { useResources } from '~/composables/resources/useResources'
import { useConnect } from '~/composables/web3/useConnect'
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
    vault: {
      type: Number,
      required: true,
    },
  },
  setup(props) {
    const { isAddressPage } = useConnect()
    const {
      fetchUpgradeCost,
      fetchProductionOutput,
      upgradeResource,
      upgradeCosts,
      loading,
      output,
    } = useResources()

    const findResources = (resource) => {
      return resources.find((a) => a.id === parseInt(resource))
    }

    useFetch(async () => {
      await fetchProductionOutput(props.realmId, props.resource.id)
    })

    return {
      findResources,
      fetchProductionOutput,
      fetchUpgradeCost,
      upgradeResource,
      upgradeCosts,
      loading,
      output,
      isAddressPage,
    }
  },
})
</script>
