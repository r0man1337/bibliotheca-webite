<template>
  <div class="bg-gray-900 min-h-screen flex flex-wrap sm:flex-nowrap">
    <div class="sm:hidden w-full mt-12 flex justify-between px-10">
      <div>
        <button class="text-xl" @click="toggleSideBar">Menu</button>
      </div>

      <NuxtLink to="/"><Book class="w-12 h-12 mx-auto" /></NuxtLink>
    </div>

    <SideBar class="fixed sm:relative w-80 min-h-screen" />
    <div class="w-full">
      <AccountButton />
      <NetworkSwitcher />
      <Nuxt class="p-3 sm:p-8" />
      <Modal />
    </div>
  </div>
</template>
<script>
import { useUiState } from '~/composables'
import Book from '~/assets/img/book-open.svg?inline'
export default {
  components: {
    Book,
  },
  setup() {
    const { toggleSideBar, sideBarOpen } = useUiState()
    return {
      toggleSideBar,
      sideBarOpen,
    }
  },
}
</script>
