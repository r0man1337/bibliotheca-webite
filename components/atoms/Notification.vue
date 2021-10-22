<template>
  <span :class="type"></span>
</template>

<script>
import { computed, defineComponent } from '@vue/composition-api'
import { Notifications } from '@/validators/Notifications'
export default defineComponent({
  props: {
    statement: {
      type: String,
      required: true,
    },
    notificationType: {
      type: String,
      required: false,
      default: 'warning',
    },
  },
  setup(props) {
    const type = computed(() => {
      return Notifications[props.notificationType]
    })
    return {
      type,
    }
  },
})
</script>
