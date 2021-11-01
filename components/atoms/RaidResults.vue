<template>
  <div class="w-full text-2xl">
    <span v-if="raidResults.resourcesIdsPillaged.length" class="text-green-400"
      >Raid successful!!</span
    >
    <span v-else class="text-red-400">You have failed</span>
    <h2>Raid Results</h2>

    <h3 class="mt-4">{{ attackingRealm.name }}</h3>
    <div>Units Lost: {{ raidResults.raidingUnitsLost }}</div>
    <div>Units Captured: {{ raidResults.unitsCaptured }}</div>
    <div v-if="raidResults.resourcesIdsPillaged.length">
      <SuccessfulRaidedResource
        v-for="(resource, index) in raidResults.resourcesIdsPillaged"
        :key="index"
        :resource="resource"
        vault="1"
        :value="raidResults.resourcesValuesPillaged[index]"
      />
      <!-- <div
        v-for="(resource, index) in raidResults.resourcesIdsPillaged"
        :key="index"
        class="flex flex-col"
      >
        <div class="w-full">{{ resource }}</div>
      </div>
      <div
        v-for="(resource, index) in raidResults.resourcesValuesPillaged"
        :key="index"
        class="flex flex-col"
      >
        {{ resource }}
      </div> -->
    </div>
    <div v-else>No resources pillaged</div>
    <h3 class="mt-4">{{ defendingRealm.name }}</h3>
    <div>Units Lost: {{ raidResults.defendingUnitsLost }}</div>

    <br />
  </div>
</template>
<script>
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  props: {
    raidResults: {
      type: Array,
      required: true,
    },
    defendingRealm: {
      type: Object,
      required: true,
    },
    attackingRealm: {
      type: Object,
      required: true,
    },
  },
  setup() {},
})
</script>
