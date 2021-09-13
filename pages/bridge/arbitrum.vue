<template>
  <div>
    <div class="text-center">
      <h1>Arbitrum Warp Bridge</h1>
      <h5 class="text-xl">
        You are currently connected to
        <span class="tex">{{ activeNetwork.name }}</span>
      </h5>
    </div>
    <div class="flex mt-8 flex-wrap">
      <div class="sm:w-5/12 flex justify-around">
        <div>
          <h4 class="mb-4">Layer 1</h4>
          <div class="bg-black rounded-2xl p-4 w-80">
            <h4 class="mb-4">Realms</h4>
            <div class="rounded border border-gray-400 p-2 my-4">#1242</div>
            <div class="rounded border border-gray-800 bg-gray-800 p-2 my-2">
              #122
            </div>
          </div>
        </div>
      </div>
      <div class="sm:w-2/12 flex flex-col justify-around my-4">
        <div class="flex">
          <ArrowLeft class="w-8 h-8 self-center mx-2 rotate-180 transform" />
          <div class="text-center w-full">
            <button class="rounded px-4 py-2 bg-gray-700 w-full">
              Warp To Arbitrum
            </button>
          </div>
          <ArrowRight class="w-8 h-8 self-center mx-2" />
        </div>
      </div>
      <div class="sm:w-5/12 flex justify-around">
        <div>
          <h4 class="mb-4">Layer 2</h4>
          <div class="bg-black rounded-2xl p-4 w-80">
            <h4 class="mb-4">Realms</h4>
            <div class="rounded border border-gray-400 p-2 my-4">#1242</div>
            <div class="rounded border border-gray-800 bg-gray-800 p-2 my-2">
              #122
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { defineComponent } from '@vue/composition-api'
import ArrowRight from '~/assets/img/arrow-right.svg?inline'
import ArrowLeft from '~/assets/img/arrow-left.svg?inline'
import { useNetwork } from '~/composables/web3/useNetwork'
export default defineComponent({
  components: {
    ArrowRight,
    ArrowLeft,
  },

  setup() {
    const { activeNetwork } = useNetwork()
    return {
      activeNetwork,
    }
  },
})
</script>
