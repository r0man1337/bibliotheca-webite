<template>
  <div class="container">
    <div>
      <h3>Select Realm to Stake</h3>
    </div>
    <div class="flex flex-wrap">
      <div class="bg-black rounded-xl p-5 w-80">
        <h3>#1</h3>
        <button class="bg-gray-900 rounded w-full p-4">Stake Realm</button>
      </div>
    </div>
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
