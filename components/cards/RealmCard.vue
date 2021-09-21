<template>
  <div
    class="
      bg-black
      border-4 border-gray-800
      rounded-xl
      mr-8
      my-4
      text-white
      transform
      hover:-translate-y-2
      transition
      duration-150
      min-h-80
      hover:shadow-2xl
      flex flex-col
      group
    "
  >
    <slot> </slot>
    <div class="mt-auto p-4 flex justify-between">
      <span
        class="
          group-hover:text-white
          text-black
          transition
          duration-150
          cursor-pointer
          underline
        "
        @click="navigate"
      >
        See on Opensea
      </span>
      <NuxtLink
        :to="'/realms/' + id"
        class="
          group-hover:text-white
          text-black
          transition
          duration-150
          underline
        "
      >
        See detail
      </NuxtLink>
    </div>
  </div>
</template>
<script>
import { defineComponent } from '@vue/composition-api'
import { useFormatting } from '~/composables/useFormatting'
export default defineComponent({
  props: {
    realm: {
      type: Object,
      required: true,
    },
    id: {
      type: String,
      required: true,
    },
  },
  setup(props, context) {
    const { shortenHash } = useFormatting()

    const navigate = () => {
      window.open(
        'https://opensea.io/assets/0x7afe30cb3e53dba6801aa0ea647a0ecea7cbe18d/' +
          props.id,
        '_blank'
      )
    }

    return {
      shortenHash,
      navigate,
    }
  },
})
</script>
