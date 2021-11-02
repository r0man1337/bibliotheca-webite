<template>
  <div class="flex flex-col">
    <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
      <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
        <div
          class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg"
        >
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  class="
                    px-6
                    py-3
                    text-left text-xs
                    font-medium
                    text-gray-500
                    uppercase
                    tracking-wider
                  "
                >
                  Raiding Realm
                </th>
                <th
                  scope="col"
                  class="
                    px-6
                    py-3
                    text-left text-xs
                    font-medium
                    text-gray-500
                    uppercase
                    tracking-wider
                  "
                >
                  Defending Realm
                </th>
                <th
                  scope="col"
                  class="
                    px-6
                    py-3
                    text-left text-xs
                    font-medium
                    text-gray-500
                    uppercase
                    tracking-wider
                  "
                >
                  Dice Roll
                </th>
                <th
                  scope="col"
                  class="
                    px-6
                    py-3
                    text-left text-xs
                    font-medium
                    text-gray-500
                    uppercase
                    tracking-wider
                  "
                >
                  Time
                </th>
                <th
                  scope="col"
                  class="
                    px-6
                    py-3
                    text-left text-xs
                    font-medium
                    text-gray-500
                    uppercase
                    tracking-wider
                  "
                >
                  Resources Pillaged
                </th>
                <th scope="col" class="relative px-6 py-3">
                  <span class="sr-only">View</span>
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="result in results" :key="result.id">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <!--<div class="flex-shrink-0 h-10 w-10">
                      <img
                        class="h-10 w-10 rounded-full"
                        :src="person.image"
                        alt=""
                      />
                    </div>-->
                    <div class="">
                      <div class="text-sm font-medium text-gray-900">
                        Realm ID: {{ result.raiderRealm.id }}
                      </div>
                      <div class="text-sm text-gray-500">
                        Raider: {{ result.raider.id }}
                      </div>
                      <div class="text-sm text-red-400">
                        Units Lost: {{ result.raiderUnitsLost }}
                      </div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">
                    Realm ID: {{ result.defenderRealm.id }}
                  </div>
                  <div class="text-sm text-gray-500">
                    {{ result.defender.id }}
                  </div>
                  <div class="text-sm text-red-400">
                    Units Lost: {{ result.defenderUnitsLost }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    class="
                      px-2
                      inline-flex
                      text-xs
                      leading-5
                      font-semibold
                      rounded-full
                      bg-green-100
                      text-green-800
                    "
                  >
                    {{ result.result }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ getTime(result.timestamp) }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-gray-500">
                  <div v-if="result.resourcesPillaged.length">
                    <SuccessfulRaidedResource
                      v-for="(resource, index) in result.resourcesPillaged"
                      :key="index"
                      :resource="resource.id"
                      vault="1"
                      :value="result.resourcesValuesPillaged[index]"
                      class="my-1 flex justify-between rounded font-semibold"
                    />
                  </div>
                  <div v-else class="px-6 py-4 whitespace-nowrap text-red-500">
                    Raid Unsuccessful
                  </div>
                </td>
                <td
                  class="
                    px-6
                    py-4
                    whitespace-nowrap
                    text-right text-sm
                    font-medium
                  "
                >
                  <a href="#" class="text-indigo-600 hover:text-indigo-900"
                    >View</a
                  >
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs'

export default {
  props: {
    results: {
      type: Object,
      default: null,
    },
  },
  setup() {
    const getTime = (timestamp) => {
      return dayjs.unix(timestamp).format('DD MMM YYYY HH:mm:ss')
    }
    return {
      getTime,
    }
  },
}
</script>
