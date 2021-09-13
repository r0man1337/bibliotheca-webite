<template>
  <button
    class="
      rounded
      border border-gray-400
      px-4
      py-3
      my-4
      flex
      justify-between
      w-full
      hover:bg-gray-600
    "
  >
    <span class="self-center">#{{ asset.id }}</span>
    <LoadingRings v-if="loading" />
  </button>
</template>
<script>
import { defineComponent } from '@vue/composition-api'
import LoadingRings from '~/assets/img/loadingRings.svg?inline'
export default defineComponent({
  components: {
    LoadingRings,
  },
  props: {
    asset: {
      type: Object,
      required: true,
    },
    loading: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  setup() {},
})
</script>
