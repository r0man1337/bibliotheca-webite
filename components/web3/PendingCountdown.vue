<template>
  <no-ssr>
    <vac :end-time="endDate">
      <span
        v-if="transaction.direction === 'deposit-l1'"
        slot="process"
        slot-scope="{ timeObj }"
        >{{ `Lefttime: ${timeObj.m}:${timeObj.s} Seconds` }}</span
      >
      <span v-else slot="process" slot-scope="{ timeObj }">{{
        `Lefttime: ${timeObj.h}:${timeObj.m} Mins`
      }}</span>
      <span slot="finish">Any minute now!</span>
    </vac>
  </no-ssr>
</template>
<script>
import { defineComponent, ref } from '@vue/composition-api'
import dayjs from 'dayjs'

export default defineComponent({
  props: {
    transaction: {
      type: Object,
      default: null,
    },
  },
  setup(props) {
    const now = dayjs()
    const whenCreated = dayjs(props.transaction?.createdAt)
    const diffInSeconds = now.diff(whenCreated, 'seconds')
    const endDate = ref()
    endDate.value = now
      .add(
        props.transaction.direction === 'deposit-l2'
          ? Math.max(10 * 60 - diffInSeconds + 2, 0)
          : Math.max(3 * 60 - diffInSeconds + 2, 0),
        'seconds'
      )
      .toDate()

    return {
      endDate,
      whenCreated,
    }
  },
})
</script>
