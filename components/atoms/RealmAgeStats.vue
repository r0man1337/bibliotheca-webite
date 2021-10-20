<template>
  <div>
    <span v-if="ageClaimed">
      Age Settled: {{ ageClaimed[0] }} <br />
      Age Last Claimed: {{ ageClaimed[1] }}
    </span>
  </div>
</template>
<script>
import { useFetch } from '@nuxtjs/composition-api'
import { defineComponent } from '@vue/composition-api'
import { useStatistics } from '~/composables/statistics/useStatistics'
export default defineComponent({
  props: {
    realm: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const { getRealmAgeClaimed, ageClaimed } = useStatistics()

    useFetch(async () => {
      await getRealmAgeClaimed(props.realm)
    })

    return {
      ageClaimed,
    }
  },
})
</script>
