<template>
  <section class="flex flex-wrap justify-center">
    <div class="sm:w-1/2 text-center self-center relative">
      <div class="p-6 bg-black rounded-xl shadow-lg">
        <h2>Public minting on realms is finished!</h2>
        <p>Purchase Realms on the secondary market.</p>
        <div class="my-8">
          <a
            href="https://opensea.io/collection/lootrealms"
            class="text-2xl bg-gray-600 rounded px-4 py-2"
            >Buy on Opensea</a
          >
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { defineComponent, ref } from '@nuxtjs/composition-api'

import { useMint } from '~/composables/web3/useMint'

import { useWeb3 } from '~/composables/web3'

export default defineComponent({
  setup() {
    const { account } = useWeb3()
    const singleMint = ref(1)
    const multiMintIds = ref([])
    const multiMintId = ref(null)
    const {
      mint,
      result,
      error,

      multiMint,
      loadingModal,
      availableTokenIds,
    } = useMint()

    return {
      multiMintIds,
      mint,
      error,
      result,
      multiMintId,
      multiMint,
      singleMint,
      loadingModal,
      account,
      availableTokenIds,
    }
  },
})
</script>
