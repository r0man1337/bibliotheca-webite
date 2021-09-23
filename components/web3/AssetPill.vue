<template>
  <button
    :disabled="disabled"
    :class="{ 'bg-gray-400 text-black': selected }"
    class="
      rounded-xl
      border border-gray-600
      px-4
      py-3
      my-4
      flex
      justify-between
      w-full
      hover:bg-gray-400 hover:text-black
      duration-150
      transition
      group
      shadow-2xl
    "
  >
    <span :class="{ 'order-2': inverse }" class="self-center text-lg"
      >#{{ asset.id }}
    </span>
    <slot />
    <LoadingRings v-if="loading && selected" />
    <ArrowRight
      v-if="!loading"
      :class="{ 'rotate-180': inverse, 'opacity-100': selected }"
      class="
        w-4
        h-4
        self-center
        mx-2
        transform
        group-hover:opacity-100
        opacity-0
        duration-150
        text-black
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
    inverse: {
      type: Boolean,
      required: false,
      default: false,
    },
    selected: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  setup() {},
})
</script>
