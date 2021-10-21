import Vue from 'vue'
import VueCompositionAPI, { reactive, computed } from '@vue/composition-api'

// We need to register it again because of Vue instance instantiation issues
Vue.use(VueCompositionAPI)

const state = reactive({
  sideBarOpen: false,
})

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
const useUiState = () => {
  const sideBarOpen = computed(() => state.sideBarOpen)
  const toggleSideBar = () => {
    state.sideBarOpen = !state.sideBarOpen
  }

  return {
    sideBarOpen,
    toggleSideBar,
  }
}

export default useUiState
