<template>
  <div
    class="my-1 flex justify-between bg-gray-800 roudned p-3"
    :class="findResources.colourClass"
  >
    <span class="flex">
      <span class="self-center">
        <span
          >{{ findResources.trait }}:
          <span v-if="!value">{{ getOutputLevel * vault }}</span>
          <span v-else>{{ value }}</span>
        </span>
      </span>
    </span>
  </div>
</template>
<script>
import { defineComponent, computed } from '@nuxtjs/composition-api'
import { resources } from '@/composables/utils/resourceColours'
import { useResources } from '~/composables/resources/useResources'
import { useConnect } from '~/composables/web3/useConnect'

export default defineComponent({
  props: {
    resource: {
      type: Object,
      required: true,
    },
    vault: {
      type: Number,
      required: true,
    },
    value: {
      type: Object,
      required: false,
      default: null,
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
    } = useResources()

    const resourceId = computed(() => {
      return props.resource
    })

    const findResources = computed(() => {
      return resources.find((a) => a.id === parseInt(resourceId.value))
    })

    return {
      findResources,
      fetchProductionOutput,
      fetchUpgradeCost,
      upgradeResource,
      upgradeCosts,
      loading,
      isAddressPage,
    }
  },
})
</script>
