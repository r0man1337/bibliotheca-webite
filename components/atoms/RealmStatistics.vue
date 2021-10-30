<template>
  <div class="flex space-x-2">
    <v-popover v-if="realmStatistics" trigger="hover">
      <button>
        <span class="text-2xl">⚔️</span>
      </button>

      <template slot="popover">
        <div
          class="
            bg-gray-300
            shadow-xl
            p-4
            rounded
            text-black
            flex
            justify-between
          "
        >
          <div class="flex flex-col pr-2">
            <span>Defence:</span>
            <span>Offence:</span>
            <span>Magic:</span>
          </div>
          <div class="flex flex-col">
            <span>{{ realmStatistics[0] }}</span>
            <span>{{ realmStatistics[1] }}</span>
            <span>{{ realmStatistics[2] }}</span>
          </div>
        </div>
      </template>
    </v-popover>
    <v-popover v-if="realmStatistics" trigger="hover">
      <button>
        <span class="text-2xl">🍎</span>
      </button>

      <template slot="popover">
        <div
          class="
            bg-gray-300
            shadow-xl
            p-4
            rounded
            text-black
            flex
            justify-between
          "
        >
          <div class="flex flex-col pr-2">
            <span>Population:</span>
            <span>Food Supply:</span>
          </div>
          <div class="flex flex-col">
            <span>{{ realmStatistics[4] }}</span>
            <span>{{ realmStatistics[3] }}</span>
          </div>
        </div>
      </template>
    </v-popover>
  </div>
</template>
<script>
import { defineComponent, onMounted } from '@vue/composition-api'
import { useStatistics } from '~/composables/statistics/useStatistics'
export default defineComponent({
  props: {
    realm: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const { getStatistics, realmStatistics } = useStatistics()

    onMounted(async () => {
      await getStatistics(props.realm)
    })

    return {
      getStatistics,
      realmStatistics,
    }
  },
})
</script>
