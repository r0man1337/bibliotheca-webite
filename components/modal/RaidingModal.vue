<template>
  <div class="container bg-gray-900 flex p-8">
    <div class="w-1/2">
      <h3>Choose Your Realm</h3>
    </div>
    <div class="w-1/2">
      <h3>Raiding Realm</h3>
      <div class="ml-auto flex">
        <StakedRealm :realm="raidedRealm" />
      </div>
    </div>
  </div>
</template>
<script>
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  props: {
    raidedRealm: {
      type: Object,
      required: true,
    },
  },
  setup() {},
})
</script>
