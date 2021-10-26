<template>
  <div
    class="
      border-r border-gray-700
      p-4
      bg-gray-1000
      transform
      duration-300
      ease-in-out
      transition-all
      left-0
      top-0
      z-30
    "
    :class="filtersOpen ? 'translate-x-0' : '-translate-x-full'"
  >
    <div class="top-10 flex flex-col z-30">
      <div class="w-full">
        <button class="ml-auto" @click="$emit('toggleFilter')">
          <Close class="w-6 h-6" />
        </button>
      </div>

      <h2>
        <NuxtLink to="/">Filters</NuxtLink>
      </h2>

      <nav class="flex flex-col p-2 text-center capitalize">
        <BButton
          :key="i"
          class="
            w-full
            text-xl
            rounded-xl
            hover:bg-black
            p-2
            flex
            justify-around
          "
          @click.native="openResources"
        >
          <span class="flex">Resources</span><span class="flex">+</span>
        </BButton>
      </nav>
    </div>
  </div>
</template>
<script>
import { onMounted } from '@vue/composition-api'
import Close from '~/assets/img/x-square.svg?inline'

// import Helm from '~/assets/img/helm.svg?inline'
export default {
  name: 'Filters',
  components: {
    Close,
  },
  props: {
    filtersOpen: {
      default: false,
      type: Boolean,
    },
  },
  setup() {
    const assetLinks = [
      {
        page: '/loot',
        title: 'Loot',
      },
      {
        page: '/realms',
        title: 'Realms',
      },
      {
        page: '/settled-realms',
        title: 'Settled Realms',
      },
      {
        page: '/manas',
        title: 'Genesis Mana',
      },
    ]

    const utilLinks = [
      {
        page: '/bridge/arbitrum',
        title: 'Arbitrum Bridge',
      },
      {
        page: '/claim',
        title: 'Claims & Mints',
      },
      {
        page: '/realms/resources',
        title: 'Realm Resources',
      },
      {
        page: '/roadmap',
        title: 'Staking Roadmap',
      },
    ]

    const adventureLinks = [
      {
        page: '/adventurer',
        title: 'Search All',
      },
    ]

    onMounted(() => {})

    return {
      assetLinks,
      utilLinks,
      adventureLinks,
    }
  },
}
</script>
