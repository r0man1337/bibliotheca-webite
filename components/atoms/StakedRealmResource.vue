<template>
  <div class="my-1 flex justify-between">
    <span class="flex">
      <span
        v-if="output"
        :class="findResources(resource).colourClass"
        class="rounded p-1 text-sm mr-2 bg-opacity-75"
        >{{ output[0] }}</span
      >
      <span class="self-center">
        <span v-if="output && !loading.resources"
          >{{ findResources(resource).trait }}: {{ output[1] }}</span
        >
        <span v-else class="flex"
          >{{ findResources(resource).trait }}: <LoadingDots class="w-5"
        /></span>
      </span>
    </span>
    <v-popover
      v-if="output && isAddressPage"
      :content="fetchUpgradeCost(resource, output[0])"
      placement="right"
      trigger="hover"
    >
      <Web3Button
        type="small"
        @click="upgradeResource(realmId, resource, output[0])"
      >
        {{ loading.resources ? 'Upgrading..' : 'Upgrade' }}
      </Web3Button>

      <template slot="popover">
        <div class="bg-gray-300 shadow-xl p-4 rounded text-gray-900">
          <h4 class="text-center mb-1">Upgrade Cost</h4>

          <div v-if="upgradeCosts" class="flex justify-between">
            <div class="flex flex-col">
              <span
                v-for="(cost, index) in upgradeCosts[0]"
                :key="index"
                class="pr-3"
              >
                <span
                  :class="findResources(cost).colourClass"
                  class="rounded-full p-2 mr-1 bg-opacity-75 border"
                ></span
                >{{ findResources(cost).trait }}:</span
              >
            </div>

            <div class="flex flex-col">
              <span v-for="(cost, index) in upgradeCosts[1]" :key="index">{{
                cost
              }}</span>
            </div>
          </div>
        </div>
      </template>
    </v-popover>
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
      type: Number,
      required: true,
    },
    realmId: {
      type: String,
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
      await fetchProductionOutput(props.realmId, props.resource)
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
