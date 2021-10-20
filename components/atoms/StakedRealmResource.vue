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
          >{{ findResources(resource).trait }}: {{ output[1] }}</span
        >
        <span v-else class="flex"
          >{{ findResources(resource).trait }}: <LoadingDots class="w-5"
        /></span>
      </span>
    </span>
    <v-popover
      v-if="output"
      :content="fetchUpgradeCost(resource, output[0])"
      placement="right"
      trigger="hover"
    >
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

      <template slot="popover">
        <div class="bg-gray-300 shadow-xl p-4 rounded text-black">
          <h4 class="text-center mb-1">Upgrade Cost</h4>

          <div v-if="upgradeCosts" class="flex justify-between">
            <div class="flex flex-col">
              <span
                v-for="(cost, index) in upgradeCosts[0]"
                :key="index"
                class="pr-3"
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
    const {
      fetchUpgradeCost,
      fetchProductionOutput,
      upgradeResource,
      upgradeCosts,
      loading,
      output,
    } = useResources()

    const findResources = (resource) => {
      return ResourceData.find((a) => a.id === parseInt(resource))
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
    }
  },
})
</script>
