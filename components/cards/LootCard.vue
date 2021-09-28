<template>
  <div
    class="
      bg-black
      border-2 border-gray-800
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
      hover:border-green-300
    "
    @click="navigate"
  >
    <div class="mb-4 flex justify-between">
      <div class="flex flex-col">
        <span class="text-2xl">#{{ loot.id }}</span>
        <span v-if="isOG">Rarity: {{ getRarity.rarest }}</span>
        <span v-if="isOG">Score: {{ getRarity.score }}</span>
      </div>
      <hr />
      <div>
        <div
          v-if="isOG"
          :class="{
            'bg-green-600': loot.manasClaimed == totalManasAvailable(loot),
          }"
          class="
            px-2
            py-1
            rounded-xl
            text-green-200
            border-green-400 border
            bg-opacity-75
          "
        >
          Mana: {{ loot.manasClaimed }} / {{ totalManasAvailable(loot) }}
        </div>
      </div>
    </div>

    <div class="text-xl">
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
import { computed, defineComponent } from '@vue/composition-api'
import { useFormatting } from '~/composables/useFormatting'
import { useLootRarity } from '~/composables/useLootRarity'
import db from '~/serverMiddleware/db.json'
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

    const getRarity = computed(() => {
      return props.isOG
        ? db.rare.find((a) => a.id === parseInt(props.loot.id))
        : null
    })

    const totalManasAvailable = (loot) => {
      const totalManas = []
      if (props.loot.chestSuffixId > 0) {
        totalManas.push(props.loot.chestSuffixId)
      }
      if (props.loot.footSuffixId > 0) {
        totalManas.push(props.loot.footSuffixId)
      }
      if (props.loot.handSuffixId > 0) {
        totalManas.push(props.loot.handSuffixId)
      }
      if (props.loot.headSuffixId > 0) {
        totalManas.push(props.loot.headSuffixId)
      }
      if (props.loot.neckSuffixId > 0) {
        totalManas.push(props.loot.neckSuffixId)
      }
      if (props.loot.ringSuffixId > 0) {
        totalManas.push(props.loot.ringSuffixId)
      }
      if (props.loot.waistSuffixId > 0) {
        totalManas.push(props.loot.waistSuffixId)
      }
      if (props.loot.weaponSuffixId > 0) {
        totalManas.push(props.loot.weaponSuffixId)
      }
      return totalManas.length
    }

    return {
      shortenHash,
      navigate,
      rarityColor,
      totalManasAvailable,
      getRarity,
    }
  },
})
</script>
