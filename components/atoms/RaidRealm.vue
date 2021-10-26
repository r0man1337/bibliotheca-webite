<template>
  <div>
    <Web3Button type="primary" @click.native="open(raidedRealm)">
      Raid Realm
    </Web3Button>
  </div>
</template>
<script>
import { defineComponent } from '@vue/composition-api'
import { useRaidingModal } from '~/composables/web3/useRaidingModal'
export default defineComponent({
  props: {
    raidedRealm: {
      type: Object,
      required: true,
    },
  },
  setup() {
    const { open } = useRaidingModal()
    return {
      open,
    }
  },
})
</script>
