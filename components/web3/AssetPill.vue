<template>
  <button
    :disabled="disabled"
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
      group
    "
  >
    <span class="self-center">#{{ asset.id }}</span>
    <LoadingRings v-if="loading" />
    <ArrowRight
      class="
        w-4
        h-4
        self-center
        mx-2
        transform
        group-hover:opacity-100
        opacity-0
        duration-150
        transition
      "
    />
  </button>
</template>
<script>
import { defineComponent } from '@vue/composition-api'
import LoadingRings from '~/assets/img/loadingRings.svg?inline'
import ArrowRight from '~/assets/img/arrow-right.svg?inline'
export default defineComponent({
  components: {
    LoadingRings,
    ArrowRight,
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
    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  setup() {},
})
</script>
