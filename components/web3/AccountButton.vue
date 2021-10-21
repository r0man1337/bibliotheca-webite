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
            font-display
            py-1
            text-xl
          "
        >
          <Helm class="w-10 h-10 stroke-current fill-current self-center" />
          My Empire
        </NuxtLink>
      </div>

      <button
        v-if="!show"
        type="button"
        class="
          border-black border
          bg-gray-700
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
          bg-gray-700
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
    </div>
    <BButton v-else class="" type="primary" @click="open">
      Connect to the Lootverse
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
