<template>
  <div
    class="
      bg-black
      border-4 border-gray-800
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
      <span :style="'color:' + rarityColor(loot.weapon)">{{
        loot.weapon
      }}</span>
      <br />
      <span :style="'color:' + rarityColor(loot.chest)">{{ loot.chest }}</span>
      <br />
      <span :style="'color:' + rarityColor(loot.head)">{{ loot.head }}</span>
      <br />
      <span :style="'color:' + rarityColor(loot.waist)">{{ loot.waist }}</span>
      <br />
      <span :style="'color:' + rarityColor(loot.foot)">{{ loot.foot }}</span
      ><br />
      <span :style="'color:' + rarityColor(loot.hand)">{{ loot.hand }}</span>
      <br />
      <span :style="'color:' + rarityColor(loot.neck)">{{ loot.neck }}</span>
      <br />

      <span :style="'color:' + rarityColor(loot.ring)">{{ loot.ring }}</span>
      <br />
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
import { useLootRarity } from '~/composables/useLootRarity'
export default defineComponent({
  props: {
    loot: {
      type: Object,
      required: true,
    },
    isOG: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  setup(props, context) {
    const { rarityColor } = useLootRarity()
    const { shortenHash } = useFormatting()
    const navigate = () => {
      const url = props.isOG
        ? '0xff9c1b15b16263c61d017ee9f65c50e4ae0113d7'
        : '0x1dfe7ca09e99d10835bf73044a23b73fc20623df'
      window.open(
        'https://opensea.io/assets/' + url + '/' + props.loot.id,
        '_blank'
      )
    }

    return {
      shortenHash,
      navigate,
      rarityColor,
    }
  },
})
</script>
