<template>
  <div class="flex justify-between my-1" @mouseover="fetchUnitCost(unitId)">
    <div>
      {{ unitValues.name }}: <span class="font-semibold">{{ unit }}</span>
      <span class="text-gray-400"
        >{{ unitValues.offence * unit }} | {{ unitValues.defence * unit }}</span
      >
    </div>
    <v-popover placement="right" trigger="hover">
      <div v-if="isAddressPage" class="flex">
        <div class="mr-2">
          <span>qty:</span>
          <input
            v-model="qty"
            class="w-4 rounded bg-gray-800 text-center"
            type="text"
          />
        </div>

        <Web3Button
          type="small"
          :disabled="!unitCost"
          @click="buildRaiding(realmId, unitId, qty, unitCost[0], unitCost[1])"
        >
          {{ loading.buildRaiding ? 'Building..' : 'Build' }}
        </Web3Button>
      </div>

      <template slot="popover">
        <div class="bg-gray-300 shadow-xl p-4 rounded text-black z-50">
          <h4 class="text-center mb-1">Unit Cost</h4>

          <div v-if="unitCost" class="flex justify-between capitalize">
            <div class="flex flex-col capitalize">
              <span
                v-for="(cost, index) in unitCost[0]"
                :key="index"
                class="pr-3 capitalize"
                ><span
                  :class="findResources(cost).colourClass"
                  class="rounded-full p-2 mr-1 bg-opacity-75"
                ></span
                >{{ findResources(cost).trait }}:</span
              >
            </div>
            <div class="flex flex-col">
              <span v-for="(cost, index) in unitCost[1]" :key="index">{{
                cost * qty
              }}</span>
              <hr class="my-2" />
            </div>
          </div>
        </div>
      </template>
    </v-popover>
  </div>
</template>
<script>
// import { useFetch } from '@nuxtjs/composition-api'
import { computed, defineComponent, ref } from '@vue/composition-api'
import { militaryUnits } from '@/composables/utils/militaryUnits'
import { useMilitary } from '~/composables/military/useMilitary'
import { resources } from '@/composables/utils/resourceColours'
import { useConnect } from '~/composables/web3/useConnect'
export default defineComponent({
  props: {
    unit: {
      type: Object,
      required: true,
    },
    realmId: {
      type: String,
      required: true,
    },
    unitId: {
      type: Number,
      required: true,
    },
    time: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const {
      buildRaiding,
      fetchUnitCost,
      unitCost,
      raidingArmy,
      error,
      loading,
      result,
    } = useMilitary()
    const { isAddressPage } = useConnect()
    const unitValues = computed(() => {
      return militaryUnits.find((a) => a.id === parseInt(props.unitId))
    })
    const findResources = (resource) => {
      return resources.find((a) => a.id === parseInt(resource))
    }
    const qty = ref(1)

    return {
      qty,
      unitCost,
      fetchUnitCost,
      buildRaiding,
      findResources,
      raidingArmy,
      error,
      loading,
      result,
      unitValues,
      isAddressPage,
    }
  },
})
</script>
