<template>
  <div
    v-if="availableNetworks.length > 1"
    v-click-outside="hide"
    class="relative mr-6"
  >
    <BButton
      type="primary"
      class=""
      aria-haspopup="listbox"
      aria-expanded="true"
      aria-labelledby="listbox-label"
      @click="show = !show"
    >
      <span class="flex items-center">
        <component :is="activeNetwork.icon" class="w-6 h-6 mr-2" />

        {{ activeNetwork.displayName }}
      </span>
      <span
        class="
          absolute
          inset-y-0
          right-0
          flex
          fill-current
          text-gray-500
          items-center
          pr-3
          pointer-events-none
        "
      >
        <svg
          :class="{ 'rotate-180': show }"
          width="11"
          height="7"
          viewBox="0 0 11 7"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M5.5 5.75L6.20711 6.45711C5.81658 6.84763 5.18342 6.84763 4.79289 6.45711L5.5 5.75ZM1.29289 2.95711L0.585786 2.25L2 0.835786L2.70711 1.54289L1.29289 2.95711ZM8.29289 1.54289L9 0.835786L10.4142 2.25L9.70711 2.95711L8.29289 1.54289ZM4.79289 6.45711L1.29289 2.95711L2.70711 1.54289L6.20711 5.04289L4.79289 6.45711ZM4.79289 5.04289L8.29289 1.54289L9.70711 2.95711L6.20711 6.45711L4.79289 5.04289Z"
          />
        </svg>
      </span>
    </BButton>
    <div v-show="show" class="w-full px-2 absolute z-10">
      <ul
        class="
          w-full
          bg-gray-400
          shadow-lg
          max-h-60
          rounded-md
          py-1
          text-base
          overflow-auto
          focus:outline-none
          sm:text-sm
        "
        tabindex="-1"
        role="listbox"
        aria-labelledby="listbox-label"
        aria-activedescendant="listbox-option-3"
      >
        <!--
        Select option, manage highlight styles based on mouseenter/mouseleave and keyboard navigation.

        Highlighted: "text-white bg-indigo-600", Not Highlighted: "text-gray-900"
      -->
        <li
          v-for="network in availableNetworks"
          id="listbox-option-0"
          :key="network.id"
          class="
            cursor-pointer
            select-none
            relative
            py-2
            pl-3
            pr-9
            hover:bg-gray-300 hover:text-white
          "
          role="option"
          @click="setActiveNetwork(network.id)"
        >
          <!-- Selected: "font-semibold", Not Selected: "font-normal" -->
          <span class="flex items-center text-black">
            <!--<component :is="network.icon" class="w-6 h-6 mr-2 text-primary-blue-dark" />-->

            {{ network.displayName }}
          </span>

          <!--
          Checkmark, only display for selected option.

          Highlighted: "text-white", Not Highlighted: "text-indigo-600"
        -->
          <span
            v-if="activeNetwork.id === network.id"
            class="absolute inset-y-0 right-0 flex items-center pr-4"
          >
            <svg
              width="8"
              height="10"
              viewBox="0 0 8 10"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M0.5 5.86603C-0.166667 5.48113 -0.166667 4.51888 0.5 4.13397L6.5 0.669874C7.16667 0.284973 8 0.766099 8 1.5359L8 8.4641C8 9.2339 7.16667 9.71503 6.5 9.33013L0.5 5.86603Z"
                fill="#000"
              />
            </svg>
          </span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { defineComponent, nextTick, ref, watch } from '@nuxtjs/composition-api'
import { useWeb3 } from '@instadapp/vue-web3'
import {
  useNetwork,
  activeNetwork,
  activeNetworkId,
} from '~/composables/web3/useNetwork'
import { useModal } from '~/composables/useModal'

// import { useTenderly } from '~/composables/web3/useTenderly';

export default defineComponent({
  setup() {
    const show = ref(false)
    const { chainId, ethersProviders, account } = useWeb3()
    const {
      availableNetworks,
      checkForNetworkMismatch,
      networkMismatch,
      networkName,
    } = useNetwork()
    const { showNetworksMismatchDialog } = useModal()

    const setActiveNetwork = async (networkId) => {
      // await stopSimulation();
      activeNetworkId.value = networkId
      show.value = false
      await nextTick()
      checkForNetworkMismatch()
    }

    watch(
      chainId,
      (val) => {
        if (val) {
          if ([1, 4, 42161, 421611].includes(val)) {
            checkForNetworkMismatch()
          } else {
            showNetworksMismatchDialog()
          }
        }
      },
      { immediate: true }
    )

    const hide = () => {
      show.value = false
    }

    return {
      chainId,
      hide,
      show,
      availableNetworks,
      networkMismatch,
      networkName,
      activeNetwork,
      setActiveNetwork,
      activeNetworkId,
      account,
      ethersProviders,
    }
  },
})
</script>
