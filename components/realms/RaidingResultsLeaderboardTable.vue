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
                  <span v-if="type === 'raid'">Raider</span>
                  <spam v-else>Defender</spam>
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
                  Raids
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
                  Units Killed
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
                  Units Lost
                </th>
                <th scope="col" class="relative px-6 py-3">
                  <span class="sr-only">View</span>
                </th>
              </tr>
            </thead>
            <tbody v-if="results" class="bg-white divide-y divide-gray-200">
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
                      <div class="text-sm text-gray-500">
                        <nuxt-link
                          :to="
                            '/adventurer/' + result.address + '/raid-results'
                          "
                          class="font-semibold text-ocean-blue-pure"
                          >{{ result.address }}
                        </nuxt-link>
                      </div>
                    </div>
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
                    <span v-if="type === 'raid'">{{ result.raidAttacks }}</span>
                    <span v-else>{{ result.raidDefends }}</span>
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-500">
                    <span v-if="type === 'raid'">{{
                      getUnitsKilled(result)
                    }}</span>
                    <span v-else>{{ getUnitsLost(result) }}</span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span v-if="type === 'raid'">{{ getUnitsLost(result) }}</span>
                  <span v-else>{{ getUnitsKilled(result) }}</span>
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
                  <nuxt-link
                    class="text-indigo-600 hover:text-indigo-900"
                    :to="'/adventurer/' + result.address + '/raid-results'"
                    >View
                  </nuxt-link>
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
// import { computed } from '@nuxtjs/composition-api'
export default {
  props: {
    results: {
      type: Array,
      default: null,
    },
    type: {
      type: String,
      default: 'raid',
    },
  },
  setup(props) {
    const getTime = (timestamp) => {
      return dayjs.unix(timestamp).format('DD MMM YYYY HH:mm:ss')
    }
    const typeResult = () => {
      return props.type === 'defend' ? 'defenderResults' : 'raiderResults'
    }
    const getUnitsLost = (result) => {
      return result[typeResult()]?.reduce(function (accumulator, item) {
        return accumulator + parseInt(item.raiderUnitsLost)
      }, 0)
    }
    const getUnitsKilled = (result) => {
      return result[typeResult()]?.reduce(function (accumulator, item) {
        return accumulator + parseInt(item.defenderUnitsLost)
      }, 0)
    }
    return {
      getUnitsLost,
      getUnitsKilled,
      getTime,
    }
  },
}
</script>
