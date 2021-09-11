<template>
  <div
    class="
      bg-black
      p-4
      rounded-xl
      mr-8
      my-4
      text-white
      transform
      hover:-translate-y-2
      transition
      duration-150
      min-h-80
      cursor-pointer
      hover:shadow-2xl
      flex flex-col
      group
    "
    @click="navigate"
  >
    <div class="mb-4 flex justify-between">
      #{{ loot.id }}
      <slot> </slot>
    </div>
    <div>
      {{ loot.chest }} <br />
      {{ loot.foot }} <br />
      {{ loot.hand }} <br />
      {{ loot.head }} <br />
      {{ loot.neck }} <br />
      {{ loot.ring }} <br />
      {{ loot.waist }} <br />
      {{ loot.weapon }}
    </div>
    <div class="mt-auto">
      <span
        class="
          group-hover:text-white
          text-black
          transition
          duration-150
          underline
        "
      >
        See on Opensea
      </span>
    </div>
  </div>
</template>
<script>
import { defineComponent } from '@vue/composition-api'
import { useFormatting } from '~/composables/useFormatting'
export default defineComponent({
  props: {
    loot: {
      type: Object,
      required: true,
    },
  },
  setup(props, context) {
    const { shortenHash } = useFormatting()
    const navigate = () => {
      window.open(
        'https://opensea.io/assets/0xff9c1b15b16263c61d017ee9f65c50e4ae0113d7/' +
          props.loot.id,
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
