<template>
  <div class="container">
    <div>
      <h3>Select A Realm to Stake</h3>
    </div>
    <div></div>
  </div>
</template>
<script>
import { defineComponent, onMounted } from '@vue/composition-api'
import { useRealms } from '~/composables/web3/useRealms'
export default defineComponent({
  setup() {
    const { getUserRealms, userRealms } = useRealms()

    onMounted(() => {
      getUserRealms()
    })
    return {
      userRealms,
    }
  },
})
</script>
