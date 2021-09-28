<template>
  <div
    class="
      border-r border-black
      p-4
      bg-gray-1000
      transform
      duration-300
      ease-in-out
      transition-all
      left-0
      z-30
    "
    :class="
      sideBarOpen ? 'translate-x-0' : '-translate-x-full sm:translate-x-0'
    "
  >
    <div class="sm:sticky top-10 flex flex-col z-30">
      <div class="sm:hidden w-full">
        <button class="ml-auto" @click="toggleSideBar">
          <Close class="w-6 h-6" />
        </button>
      </div>

      <h2>
        <NuxtLink to="/"><Book class="w-12 h-12 mx-auto sm:mt-12" /></NuxtLink>
      </h2>
      <span class="text-xl text-center"
        ><span class="text-yellow-400">${{ goldPrice }}</span> $AGLD</span
      >

      <nav class="flex flex-col p-2 text-center capitalize">
        <NuxtLink
          v-for="(link, i) in adventureLinks"
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
          :to="link.page"
          @click.native="toggleSideBar"
        >
          <span class="flex"
            ><Helm
              class="w-8 h-8 stroke-current fill-current self-center mr-2"
            />
            {{ link.title }}</span
          >
        </NuxtLink>
        <hr class="my-2" />
        <NuxtLink
          v-for="link in assetLinks"
          :key="link.title"
          class="w-full text-xl rounded-xl hover:bg-black p-2"
          :to="link.page"
          @click.native="toggleSideBar"
          >{{ link.title }}</NuxtLink
        >
        <hr class="my-2" />
        <NuxtLink
          v-for="link in utilLinks"
          :key="link.title"
          class="w-full text-xl rounded-xl hover:bg-black p-2"
          :to="link.page"
          @click.native="toggleSideBar"
          >{{ link.title }}</NuxtLink
        >
      </nav>

      <div class="mx-auto my-20">
        <a
          target="blank_"
          class="hover:bg-gracy-700"
          href="https://github.com/BibliothecaForAdventurers/bibliotheca-webite"
          ><Github class="w-8 h-8"
        /></a>
        <a
          target="blank_"
          class="hover:bg-gracy-700"
          href="https://discord.gg/8NS4JxGmUC"
          ><Discord class="w-8 h-8 fill-current mt-4"
        /></a>
        <a
          target="blank_"
          class="hover:bg-gracy-700"
          href="https://twitter.com/lootgraph"
          ><Twitter class="w-8 h-8 fill-current mt-4"
        /></a>
        <a
          target="blank_"
          class="hover:bg-gracy-700"
          href="https://medium.com/@bibliotheca"
        >
          <Medium class="w-8 h-8 fill-current mt-4" />
        </a>
      </div>
      <p class="text-center">Data on this site may be delayed.</p>
    </div>
  </div>
</template>
<script>
import { onMounted } from '@vue/composition-api'
import { useUiState, usePrice } from '~/composables'
import Book from '~/assets/img/book-open.svg?inline'
import Close from '~/assets/img/x-square.svg?inline'
import Github from '~/assets/img/github.svg?inline'
import Discord from '~/assets/img/discord.svg?inline'
import Medium from '~/assets/img/medium.svg?inline'
import Twitter from '~/assets/img/twitter.svg?inline'
import Helm from '~/assets/img/helm.svg?inline'
export default {
  name: 'SideBar',
  components: {
    Book,
    Close,
    Github,
    Discord,
    Medium,
    Twitter,
    Helm,
  },
  setup() {
    const { toggleSideBar, sideBarOpen } = useUiState()
    const { goldPrice, getGoldPrice } = usePrice()

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
        page: '/manas',
        title: 'Genesis Mana',
      },
      {
        page: '/treasure',
        title: 'Treasure',
      },
    ]

    const utilLinks = [
      {
        page: '/realms/mint',
        title: 'Mint realms',
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
        title: 'Adventurers',
      },
    ]

    onMounted(() => {
      getGoldPrice()
      window.setInterval(() => {
        getGoldPrice()
      }, 20000)
    })

    return {
      toggleSideBar,
      sideBarOpen,
      goldPrice,
      getGoldPrice,
      assetLinks,
      utilLinks,
      adventureLinks,
    }
  },
}
</script>
