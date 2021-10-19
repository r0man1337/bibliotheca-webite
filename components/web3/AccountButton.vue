<template>
  <div class="hidden sm:flex justify-end px-4 py-4">
    <NetworkSwitcher />
    <div v-if="active" v-click-outside="hide" class="flex">
      <div class="px-4 self-center">
        <NuxtLink
          :to="'/adventurer/' + account"
          class="
            w-full
            items-center
            text-white
            flex
            hover:text-red-500
            rounded
            px-5
            py-1
          "
        >
          <Helm class="w-10 h-10 stroke-current fill-current self-center" /> My
          Adventure
        </NuxtLink>
      </div>

      <button
        v-if="!show"
        type="button"
        class="
          border-black border
          bg-black
          rounded
          pl-3
          py-2
          px-10
          text-center
          hover:bg-gray-800
        "
        aria-haspopup="listbox"
        aria-expanded="true"
        aria-labelledby="listbox-label"
        @click="show = !show"
      >
        <span
          class="flex items-center capitalize text-center text-sm font-bold"
        >
          {{ shortenHash(account) }}
        </span>
      </button>
      <button
        v-else
        type="button"
        class="
          border-black border
          bg-black
          rounded
          pl-3
          py-2
          px-10
          text-center
          hover:bg-gray-800
        "
        aria-haspopup="listbox"
        aria-expanded="true"
        aria-labelledby="listbox-label"
        @click="deactivate"
      >
        <span> disconnect? </span>
      </button>

      <!-- <div v-show="show" class="w-auto px-2 absolute z-10 mt-0.5 right-0 mr-2">
        <ul
          class="bg-black text-white shadow-lg max-h-60 rounded-md py-1 text-gray overflow-auto focus:outline-none sm:text-sm"
          tabindex="-1"
          role="listbox"
          aria-labelledby="listbox-label"
          aria-activedescendant="listbox-option-3"
        >
          <li
            id="listbox-option-0"
            class="cursor-pointer select-none relative py-3 pl-3 pr-9 hover:bg-red-200 text-red-400 rounded"
            role="option"
            @click="deactivate"
          >
            <span class="flex items-center">
              Disconnect
            </span>
          </li>
        </ul>
      </div> -->
    </div>
    <BButton v-else type="primary" @click="open">
      Connect to the LootVerse
    </BButton>
  </div>
</template>

<script>
import { defineComponent, ref } from '@nuxtjs/composition-api'
import { useWeb3 } from '@instadapp/vue-web3'
import { useFormatting } from '~/composables/useFormatting'
import Helm from '~/assets/img/helm.svg?inline'
import { useWeb3Modal } from '~/composables/web3/useWeb3Modal'
export default defineComponent({
  components: {
    Helm,
  },
  setup() {
    // const { activeAccount } = useDSA();
    const { account, active, deactivate } = useWeb3()
    const { shortenHash } = useFormatting()
    const { open } = useWeb3Modal()
    const show = ref(false)

    const hide = () => {
      show.value = false
    }

    return {
      hide,
      show,
      account,
      open,
      // activeAccount,
      active,
      deactivate,
      shortenHash,
    }
  },
})
</script>
