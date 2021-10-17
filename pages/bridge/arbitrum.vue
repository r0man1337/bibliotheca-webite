<template>
  <div>
    <div class="text-center">
      <h1>Arbitrum Transfer Bridge</h1>
      <h5 class="text-xl">
        You are currently connected to
        <span class="text-red-400">{{ activeNetwork.displayName }}</span>
      </h5>
    </div>
    <div class="flex mt-8 flex-wrap">
      <div class="sm:w-4/12 flex justify-around top-50">
        <div class="">
          <h4 class="mb-4 flex">
            Ethereum Layer 1
            <Lock v-if="activeNetwork.isArbitrum" class="ml-4" />
          </h4>
          <div
            :class="{
              'opacity-75 bg-gray-800': activeNetwork.isArbitrum,
              'bg-gradient-to-b from-gray-800': !activeNetwork.isArbitrum,
            }"
            class="rounded-2xl w-80 shadow-2xl relative"
          >
            <div
              v-if="activeNetwork.isArbitrum"
              class="absolute bg-black z-20 h-full w-full rounded-xl opacity-25"
            ></div>
            <div class="p-6">
              <h3 class="mb-4">Your Realms</h3>
              <AssetPill
                v-for="(asset, index) in userRealms.l1"
                :key="index"
                :asset="asset"
                :selected="
                  selectedRealm ? selectedRealm.token_id === asset.id : false
                "
                :disabled="activeNetwork.isArbitrum"
                :loading="loading.depositL1"
                @click.native="selectRealmForTransfer(asset)"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="sm:w-4/12 justify-around my-4 sticky top-50 h-full">
        <div class="flex">
          <ArrowLeft
            :class="{
              'rotate-180': !activeNetwork.isArbitrum,
            }"
            class="w-8 h-8 self-center mx-2 transform"
          />
          <div class="text-center w-full">
            <div v-if="loadingBridge">
              Bridging.... You can que multiple Realms. This message will go
              away once all Realms are processed.
            </div>
            <button
              :disabled="selectedRealm == null"
              class="
                rounded-xl
                px-4
                py-2
                bg-gradient-to-r
                from-gray-800
                to-red-700
                w-full
                text-xl
                hover:from-red-700 hover:to-gray-800
                transition-all
                duration-250
              "
              @click="l2Function"
            >
              <span v-if="loading.depositL1" class="flex justify-around">
                <LoadingRings />
              </span>

              <span v-else>
                <span v-if="selectedRealm">
                  {{
                    !activeNetwork.isArbitrum
                      ? 'Transfer To Arbitrum L2'
                      : 'Transfer To Ethereum L1'
                  }}
                </span>
                <span v-else>Please Select a Realm </span>
              </span>
            </button>
          </div>
          <ArrowRight
            :class="{
              'rotate-180': activeNetwork.isArbitrum,
            }"
            class="w-8 h-8 self-center mx-2 transform"
          />
        </div>
        <div class="bg-gray-900 w-full p-4 rounded-xl my-4">
          <h3>
            <span v-if="selectedRealm">Selected</span
            ><span v-else>Select</span> Realm
            <span v-if="selectedRealm">#{{ selectedRealm.token_id }}</span>
          </h3>
          <div v-if="selectedRealm">
            <RealmCard
              v-if="!loadingMeta"
              :id="selectedRealm.token_id"
              :realm="selectedRealm"
            />
            <Loader v-else />
          </div>
        </div>
      </div>
      <div class="sm:w-4/12 flex justify-around sticky top-50 h-full">
        <div>
          <h4 class="mb-4 flex">
            Arbitrum Layer 2
            <Lock v-if="!activeNetwork.isArbitrum" class="ml-4" />
          </h4>
          <div
            :class="{
              'opacity-75 bg-gray-800': !activeNetwork.isArbitrum,
              ' bg-gradient-to-b from-gray-800': activeNetwork.isArbitrum,
            }"
            class="rounded-xl w-80 shadow-2xl relative"
          >
            <div
              v-if="!activeNetwork.isArbitrum"
              class="absolute bg-black z-20 h-full w-full rounded-xl opacity-25"
            ></div>
            <div class="p-6">
              <h3 class="mb-4 text-white">Your Realms</h3>
              <AssetPill
                v-for="(asset, index) in userRealms.l2"
                :key="index"
                inverse
                :disabled="!activeNetwork.isArbitrum"
                :selected="
                  selectedRealm ? selectedRealm.token_id === asset.id : false
                "
                :loading="loadingBridge"
                :asset="asset"
                @click.native="selectRealmForTransfer(asset)"
              />
            </div>
          </div>
        </div>
      </div>
      <BridgeTransactionsTable
        :merged-transactions-to-show="mergedTransactionsToShow"
      />
    </div>
  </div>
</template>
<script>
import {
  defineComponent,
  computed,
  onMounted,
  ref,
} from '@nuxtjs/composition-api'
import axios from 'axios'
import { useWeb3 } from '@instadapp/vue-web3'
import ArrowRight from '~/assets/img/arrow-right.svg?inline'
import ArrowLeft from '~/assets/img/arrow-left.svg?inline'
import Lock from '~/assets/img/lock.svg?inline'
import { activeNetwork } from '~/composables/web3/useNetwork'
import { useTransactions } from '~/composables/bridge/useTransactions'
import { useModal } from '~/composables/useModal'
import { useRealms } from '~/composables/web3/useRealms'
import { useBridge } from '~/composables/bridge/useBridge'
import LoadingRings from '~/assets/img/loadingRings.svg?inline'
export default defineComponent({
  components: {
    ArrowRight,
    ArrowLeft,
    Lock,
    LoadingRings,
  },

  setup() {
    const { showAssetBox } = useModal()
    const { getUserRealms, userRealms } = useRealms()
    const { account, provider, library /*, active */ } = useWeb3()
    const {
      setInitialPendingWithdrawals,
      mergedTransactionsToShow,
      withdrawalsTransformed,
      pendingWithdrawalsMap,
    } = useTransactions()
    const {
      initBridge,
      depositRealm,
      withdrawToL1,
      bridge,
      partnerNetwork,
      result,
      loadingBridge,
      l2TransactionCount,
      loading,
    } = useBridge()

    const networkName = computed(() => {
      return activeNetwork.value.name
    })

    const assetsOnL1 = ref()
    const assetsOnL2 = ref()

    const l2Function = async () => {
      if (!bridge.value) {
        await initBridge()
      }
      if (!activeNetwork.value.isArbitrum) {
        await depositRealm(selectedRealm.value.token_id)
      } else {
        await withdrawToL1(selectedRealm.value.token_id)
      }
    }
    onMounted(async () => {
      if (account.value) {
        await getUserRealms()
        setTimeout(async function () {
          await setInitialPendingWithdrawals(bridge, {
            fromBlock: 4832019,
          })
        }, 2500)
      }
    })
    /* watch(
      account,
      async (val) => {
        if (val) {
          console.log('account change' + val)
          await getUserRealms()
        }
      },
      {
        immediate: true,
      }
    ) 
    watch(
      activeNetwork,
      async (val) => {
        if (val) {
          await initBridge()
          console.log('watch chain id')
        }
      },
      {
        immediate: true,
      }
    ) */
    const selectedRealm = ref()
    const loadingMeta = ref(false)

    const selectRealmForTransfer = async (realm) => {
      loadingMeta.value = true
      try {
        const response = await fetchRealmMetaData(realm.id)
        selectedRealm.value = response.data
      } catch (e) {
        console.log(e)
      } finally {
        loadingMeta.value = false
      }
    }

    const fetchRealmMetaData = async (id) => {
      try {
        return await axios.get(
          'https://api.opensea.io/api/v1/asset/0x7afe30cb3e53dba6801aa0ea647a0ecea7cbe18d/' +
            id
        )
      } catch (e) {
        console.log(e)
      }
    }

    return {
      activeNetwork,
      provider,
      library,
      networkName,
      assetsOnL2,
      assetsOnL1,
      account,
      bridge,
      result,
      userRealms,
      l2TransactionCount,
      depositRealm,
      mergedTransactionsToShow,
      withdrawalsTransformed,
      pendingWithdrawalsMap,
      partnerNetwork,
      showAssetBox,
      selectRealmForTransfer,
      selectedRealm,
      loadingMeta,
      loading,
      loadingBridge,
      l2Function,
    }
  },
})
</script>
