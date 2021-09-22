<template>
  <div
    class="
      inline-block
      w-full
      max-w-sm
      px-4
      py-6
      overflow-hidden
      text-left
      align-bottom
      transition-all
      transform
      bg-white
      border border-opacity-50
      rounded-lg
      shadow-xl
      dark:bg-dark-400
      sm:my-8 sm:align-middle sm:p-6
      border-green-light
    "
    role="dialog"
    aria-modal="true"
    aria-labelledby="modal-headline"
  >
    <div class="mt-3 text-center text-black sm:mt-5">
      <h3 id="modal-headline" class="font-semibold text-19 dark:text-light">
        Switch to
        <span class="capitalize">{{ activeNetwork.displayName }}</span>
      </h3>
      <!-- eslint-disable-next-line vue/no-v-html -->
      <p class="px-6 mt-6 font-medium">
        Change the wallet network to
        <span class="capitalize">{{ activeNetwork.displayName }}</span> to
        proceed.
      </p>
    </div>

    <div class="flex justify-center mt-4 sm:mt-6">
      <b-button type="primary" class="px-8" @click="switchAndClose">
        Switch to {{ activeNetwork.displayName }}
      </b-button>
    </div>
  </div>
</template>

<script>
import { defineComponent } from '@nuxtjs/composition-api'
import { useModal } from '~/composables/useModal'
import { useNetwork, activeNetwork } from '~/composables/web3/useNetwork'

export default defineComponent({
  setup() {
    const { close } = useModal()
    const { switchNetwork } = useNetwork()

    async function switchAndClose() {
      try {
        await switchNetwork()

        close()
      } catch (error) {}
    }

    return { switchAndClose, activeNetwork }
  },
})
</script>
