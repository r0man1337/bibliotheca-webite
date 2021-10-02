<template>
  <div class="container flex">
    <div class="bg-black p-6 rounded-2xl w-1/2">
      <h2 class="uppercase text-red-400 text-center">The Iron Bank</h2>
      <table class="table-fixed w-full">
        <thead>
          <tr class="text-xl text-left">
            <th class="w-1/2">Resource</th>
            <th class="w-1/4">Balance</th>
            <th class="w-1/4">Production p/day</th>
          </tr>
        </thead>
        <tbody>
          <ResourceRow
            v-for="(resource, index) in sortedResources"
            :key="index"
            class="even:bg-gray-900 rounded-lg"
            :resource="resource"
          />
        </tbody>
      </table>
    </div>
  </div>
</template>
<script>
import { defineComponent } from '@vue/composition-api'
import ResourceData from '~/composables/resource.json'
export default defineComponent({
  setup() {
    const filteredResources = ResourceData.filter((d) => {
      return d.value > 1
    })

    const sortedResources = filteredResources.sort((a, b) => {
      return b.value - a.value
    })
    return {
      sortedResources,
    }
  },
})
</script>
