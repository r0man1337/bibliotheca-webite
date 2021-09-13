<template>
  <div>
    <div class="text-center">
      <h1>Arbitrum Warp Bridge</h1>
      <h5 class="text-xl">
        You are currently connected to
        <span class="tex">{{ networkName }}</span>
      </h5>
    </div>
    <div class="flex mt-8 flex-wrap">
      <div class="sm:w-5/12 flex justify-around">
        <div>
          <h4 class="mb-4 flex">
            Ethereum Layer 1 <Lock v-if="networkId === 4" class="ml-4" />
          </h4>
          <div
            :class="{ 'opacity-75 bg-gray-200 text-black': networkId === 4 }"
            class="bg-black rounded-2xl p-4 w-80"
          >
            <h4 class="mb-4">Realms</h4>
            <AssetPill
              v-for="(asset, index) in assetsOnL1"
              :key="index"
              :asset="asset"
            />
          </div>
        </div>
      </div>
      <div class="sm:w-2/12 flex flex-col justify-around my-4">
        <div class="flex">
          <ArrowLeft
            :class="{
              'rotate-180': networkId === 1,
            }"
            class="w-8 h-8 self-center mx-2 transform"
          />
          <div class="text-center w-full">
            <button class="rounded px-4 py-2 bg-gray-700 w-full">
              {{
                networkId === 1 ? 'Warp To Arbitrum L2' : 'Warp To Ethereum L1'
              }}
            </button>
          </div>
          <ArrowRight
            :class="{
              'rotate-180': networkId === 4,
            }"
            class="w-8 h-8 self-center mx-2 transform"
          />
        </div>
      </div>
      <div class="sm:w-5/12 flex justify-around">
        <div>
          <h4 class="mb-4 flex">
            Arbitrum Layer 2 <Lock v-if="networkId === 1" class="ml-4" />
          </h4>
          <div
            :class="{ 'opacity-75 bg-gray-200 text-black': networkId === 1 }"
            class="bg-black rounded-2xl p-4 w-80"
          >
            <h4 class="mb-4">Realms</h4>
            <AssetPill
              v-for="(asset, index) in assetsOnL2"
              :key="index"
              :asset="asset"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {
  defineComponent,
  computed,
  onUpdated,
  ref,
} from '@nuxtjs/composition-api'
import ArrowRight from '~/assets/img/arrow-right.svg?inline'
import ArrowLeft from '~/assets/img/arrow-left.svg?inline'
import Lock from '~/assets/img/lock.svg?inline'
import { useNetwork } from '~/composables/web3/useNetwork'
import { useWeb3 } from '~/composables/web3/useWeb3'

import { useGraph } from '~/composables/web3/useGraph'

export default defineComponent({
  components: {
    ArrowRight,
    ArrowLeft,
    Lock,
  },

  setup() {
    const { activeNetwork } = useNetwork()
    const { getUsersRealms } = useGraph()
    const { account } = useWeb3()

    const networkName = computed(() => {
      return activeNetwork.value.name
    })

    const networkId = computed(() => {
      return activeNetwork.value.chainId
    })

    const assetsOnL1 = ref()

    onUpdated(async () => {
      assetsOnL1.value = await getUsersRealms()
    })

    const assetsOnL2 = [
      {
        id: 232,
      },
      {
        id: 2222,
      },
    ]

    return {
      activeNetwork,
      networkId,
      networkName,
      assetsOnL2,
      assetsOnL1,

      account,
    }
  },
})
</script>
