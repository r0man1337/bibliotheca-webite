<template>
  <div>
    <div class="text-center">
      <h1>Arbitrum Warp Bridge</h1>
      <h5 class="text-xl">
        You are currently connected to
        <span class="text-red-400">{{ networkName }}</span>
      </h5>
    </div>
    <div class="flex mt-8 flex-wrap">
      <div class="sm:w-4/12 flex justify-around top-50">
        <div class="">
          <h4 class="mb-4 flex">
            Ethereum Layer 1
            <Lock v-if="networkChainId === 421611" class="ml-4" />
          </h4>
          <div
            :class="{
              'opacity-75 bg-gray-200 text-black': networkChainId === 421611,
            }"
            class="bg-black rounded-2xl p-4 w-80"
          >
            <h4 class="mb-4">Realms</h4>
            <AssetPill
              v-for="(asset, index) in userRealms.l1"
              :key="index"
              :asset="asset"
              :disabled="networkChainId === 421611"
              @click.native="selectRealmForTransfer(asset)"
            />
          </div>
        </div>
      </div>
      <div class="sm:w-4/12 justify-around my-4 sticky top-50 h-full">
        <div class="bg-black w-full p-4 rounded-xl my-4 border border-white">
          <h3>Selected Realm</h3>
          <div v-if="selectedRealm">
            <RealmCard
              v-if="!loading"
              :id="selectedRealm.token_id"
              :realm="selectedRealm"
            />
            <Loader v-else />
          </div>
        </div>
        <div class="flex">
          <ArrowLeft
            :class="{
              'rotate-180': networkChainId === 4,
            }"
            class="w-8 h-8 self-center mx-2 transform"
          />
          <div class="text-center w-full">
            <button
              class="rounded px-4 py-2 bg-gray-700 w-full text-xl"
              @click="depositRealm(selectedRealm.token_id)"
            >
              {{
                networkChainId === 4
                  ? 'Warp To Arbitrum L2'
                  : 'Warp To Ethereum L1'
              }}
            </button>
          </div>
          <ArrowRight
            :class="{
              'rotate-180': networkChainId === 421611,
            }"
            class="w-8 h-8 self-center mx-2 transform"
          />
        </div>
      </div>
      <div class="sm:w-4/12 flex justify-around sticky top-50 h-full">
        <div>
          <h4 class="mb-4 flex">
            Arbitrum Layer 2 <Lock v-if="networkChainId === 4" class="ml-4" />
          </h4>
          <span>{{ result.realmsOnL2 }} Realms</span>
          <div
            :class="{
              'opacity-75 bg-gray-200 text-black': networkChainId === 4,
            }"
            class="bg-black rounded-2xl p-4 w-80"
          >
            <h4 class="mb-4">Realms</h4>
            <AssetPill
              v-for="(asset, index) in userRealms.l2"
              :key="index"
              :disabled="networkChainId === 4"
              :asset="asset"
              @click.native="selectRealmForTransfer(asset)"
            />
          </div>
        </div>
      </div>
    </div>
    <BridgeTransactionsTable />
  </div>
</template>
<script>
import {
  defineComponent,
  computed,
  onMounted,
  ref,
  watch,
} from '@nuxtjs/composition-api'
import axios from 'axios'
import ArrowRight from '~/assets/img/arrow-right.svg?inline'
import ArrowLeft from '~/assets/img/arrow-left.svg?inline'
import Lock from '~/assets/img/lock.svg?inline'
import { activeNetwork } from '~/composables/web3/useNetwork'
import { useWeb3 } from '~/composables/web3/useWeb3'
import { useModal } from '~/composables/useModal'
import { useRealms } from '~/composables/web3/useRealms'
import { useBridge } from '~/composables/bridge/useBridge'

export default defineComponent({
  components: {
    ArrowRight,
    ArrowLeft,
    Lock,
  },

  setup() {
    const { showAssetBox } = useModal()
    const { getUserRealms, userRealms } = useRealms()
    const { account /*, active */ } = useWeb3()
    const { initBridge, depositRealm, bridge, partnerNetwork, result } =
      useBridge()

    const networkName = computed(() => {
      return activeNetwork.value.name
    })

    const networkChainId = computed(() => {
      return activeNetwork.value.chainId
    })

    const assetsOnL1 = ref()
    const assetsOnL2 = ref()

    onMounted(async () => {
      await initBridge()
      await getUserRealms()
    })

    watch(
      account,
      async (val) => {
        if (val) {
          await getUserRealms()
          console.log('watch account')
        }
      },
      {
        immediate: true,
      }
    )
    watch(
      networkChainId,
      async (val) => {
        if (val) {
          await getUserRealms()
          console.log('watch chain id')
        }
      },
      {
        immediate: true,
      }
    )

    const selectedRealm = ref()
    const loading = ref(false)

    const selectRealmForTransfer = async (realm) => {
      loading.value = true
      try {
        const response = await fetchRealmMetaData(realm.id)
        selectedRealm.value = response.data
      } catch (e) {
        console.log(e)
      } finally {
        loading.value = false
      }
    }

    const fetchRealmMetaData = async (id) => {
      return await axios.get(
        'https://api.opensea.io/api/v1/asset/0x7afe30cb3e53dba6801aa0ea647a0ecea7cbe18d/' +
          id
      )
    }

    return {
      activeNetwork,
      networkChainId,
      networkName,
      assetsOnL2,
      assetsOnL1,
      account,
      bridge,
      result,
      userRealms,
      depositRealm,
      partnerNetwork,
      showAssetBox,
      selectRealmForTransfer,
      selectedRealm,
      loading,
    }
  },
})
</script>
