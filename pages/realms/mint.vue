<template>
  <section class="flex flex-wrap">
    <div
      v-if="!$fetchState.pending"
      class="sm:w-1/2 text-center self-center relative"
    >
      <div
        v-if="loading.getAvailableTokenIds"
        class="
          absolute
          bg-black bg-opacity-75
          h-full
          w-full
          flex
          justify-around
          rounded-xl
        "
      >
        <div class="self-center text-center">Fetching Available Ids...</div>
      </div>
      <div class="p-6 bg-black rounded-xl">
        <h5>
          Contract address:
          <a
            class="hover:underline my-4"
            href="https://etherscan.io/address/0x7afe30cb3e53dba6801aa0ea647a0ecea7cbe18d#code"
          >
            0x7afe30cb3e53dba6801aa0ea647a0ecea7cbe18d</a
          >
        </h5>
        <h1 class="mt-8">
          Mint Realms -
          {{ availableTokenIds ? availableTokenIds.length : '' }} / 8000 left
        </h1>
        <h4>0.1 ETH per Realm</h4>
        <p>
          Realm IDs are selected at random to reduce chance of failed
          transaction fees
        </p>
        <div class="my-12 text-center">
          <h3>Mint Realm</h3>
          <div class="flex w-1/2 justify-around mx-auto">
            <button class="mx-4" @click="singleMint--">-</button>
            <input
              id="mintId"
              v-model="singleMint"
              min="1"
              class="
                text-center
                appearance-none
                rounded-md
                shadow-sm
                text-white
                mb-1
                leading-tight
                focus:ring-primary focus:border-primary
                w-full
                px-4
                py-4
                text-lg
                transition-all
                duration-150
                font-semibold
                tracking-wide
                bg-gray-900
              "
              type="number"
              label="Realm Id"
              placeholder="Enter Realm Id to mint"
              @input="limitLength(singleMint)"
            />
            <button class="mx-4" @click="singleMint++">+</button>
          </div>

          <div class="my-4 flex justify-around">
            <div class="flex">
              <BButton
                class="bg-gray-900"
                :disabled="singleMint <= 0"
                type="primary"
                @click="mintRealms"
              >
                {{ loading.mint ? 'loading...' : 'Mint Realm' }}
              </BButton>
              <span class="self-center ml-2">{{ singleMint * 0.1 }} ETH</span>
            </div>
          </div>
        </div>
      </div>
      <div class="text-center my-8 text-2xl">or</div>

      <div class="p-6 bg-black rounded-xl">
        <h2>Advanced Mint - Select Realms</h2>
        <div class="flex mt-3">
          <button
            v-for="(id, index) in multiMintIds"
            :key="index"
            class="hover:bg-red-400 px-2 py-1 bg-gray-900 mr-2 rounded"
            @click="removeIds(id)"
          >
            {{ id }} <span class="ml-2">X</span>
          </button>
        </div>
        <div class="my-4 flex justify-around">
          <div class="flex">
            <BButton
              :disabled="!multiMintIds.length"
              type="primary"
              class="bg-gray-900"
              @click="multiMint(multiMintIds)"
              >{{ loading.mint ? 'loading...' : 'Mint Realms' }}</BButton
            >

            <span class="self-center ml-2">
              {{ (multiMintIds.length * 0.1).toFixed(1) }} ETH</span
            >
          </div>
        </div>
        <h4>Select Realm ids to mint</h4>
        <div class="flex flex-wrap">
          <button
            v-for="(id, index) in availableTokenIds"
            :key="index"
            :disabled="multiMintIds.find((a) => a === id)"
            :class="{ 'bg-gray-600': multiMintIds.find((a) => a === id) }"
            class="bg-black px-2 py-1 hover:bg-gray-800 rounded-xl"
            @click="addIds(id)"
          >
            {{ id }}
          </button>
        </div>
        <div class="my-4 p-6">
          READ: Please take note that this is a beta version feature and is
          provided on an "as is" and "as available" basis. Bibliotheca does not
          give any warranties and will not be liable for any loss, direct or
          indirect through continued use of this feature.
        </div>
      </div>
      <div
        v-if="loadingModal"
        class="fixed z-10 inset-0 overflow-y-auto"
        aria-labelledby="modal-title"
        role="dialog"
        aria-modal="true"
      >
        <div
          class="
            flex
            items-end
            justify-center
            min-h-screen
            pt-4
            px-4
            pb-20
            text-center
            sm:block sm:p-0
          "
        >
          <div
            class="fixed inset-0 bg-gray-700 bg-opacity-75 transition-opacity"
            aria-hidden="true"
            @click="loadingModal = false"
          ></div>
          <span
            class="hidden sm:inline-block sm:align-middle sm:h-screen"
            aria-hidden="true"
            >&#8203;</span
          >
          <div
            class="
              inline-block
              align-bottom
              bg-black
              rounded-lg
              text-left
              overflow-hidden
              shadow-xl
              transform
              transition-all
              sm:my-8 sm:align-middle sm:max-w-lg sm:w-full
            "
          >
            <div class="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div class="flex">
                <button class="ml-auto" @click="loadingModal = false">
                  <Cross class="w-6 h-6" />
                </button>
              </div>
              <div>
                <h2>Minting Realms</h2>
                <div
                  v-if="error.mint"
                  class="
                    border border-red-400
                    text-red-400
                    px-4
                    py-3
                    rounded
                    relative
                    my-3
                    text-lg
                  "
                  role="alert"
                >
                  <strong
                    v-if="
                      error.mint
                        ? error.mint.includes(
                            'This token has already been minted'
                          )
                        : false
                    "
                  >
                    This Realm has already been minted. Please refresh and try
                    again.
                  </strong>

                  <strong
                    v-if="
                      error.mint
                        ? error.mint.includes('insufficient funds for gas')
                        : false
                    "
                  >
                    Insufficient funds for gas</strong
                  >
                </div>
                <div v-if="loading.mint">
                  <Loader class="w-24 h-24" />
                </div>
                <div v-else-if="!error.mint" class="my-8">
                  <BButton
                    type="primary"
                    class="text-2xl"
                    :to="'/adventurer/' + account"
                    >See My Realms</BButton
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="flex justify-around h-screen w-full">
      <div class="self-center mx-auto">
        <h4 class="text-center">Loading Mintable Realms...</h4>
        <Loader class="w-24 h-24 mx-auto" />
      </div>
    </div>

    <div v-if="!$fetchState.pending" class="sm:w-1/2">
      <div class="p-8">
        <h2>Join our Lords & Ladies with their already minted Realms below</h2>
        <div>
          <RealmCard
            v-if="selectedRealm"
            :id="selectedRealm.token_id"
            :realm="selectedRealm"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import {
  computed,
  defineComponent,
  ref,
  useFetch,
  onMounted,
} from '@nuxtjs/composition-api'
import axios from 'axios'
import { useMint } from '~/composables/web3/useMint'
import Loader from '~/assets/img/loadingRings.svg?inline'
import Cross from '~/assets/img/x-square.svg?inline'
import { useWeb3 } from '~/composables/web3'

export default defineComponent({
  components: {
    Loader,
    Cross,
  },
  setup() {
    const { account } = useWeb3()
    const singleMint = ref(1)
    const multiMintIds = ref([])
    const multiMintId = ref(null)
    const {
      mint,
      result,
      error,
      loading,
      multiMint,
      loadingModal,
      getAvailableTokenIds,
      availableTokenIds,
    } = useMint()

    const etherSingleMintCost = computed(() => {
      if (singleMint.value) {
        return 0.1
      } else {
        return 0
      }
    })

    const addIds = (id) => {
      multiMintIds.value.push(id)
    }

    const removeIds = (value) => {
      const index = multiMintIds.value.indexOf(value)
      if (index > -1) {
        multiMintIds.value.splice(index, 1)
      }
    }

    const limitMultiLength = (value) => {
      if (value.length > 4) {
        multiMintId.value = value.slice(0, 4)
      }
    }

    const limitLength = (value) => {
      if (value.length > 4) {
        singleMint.value = value.slice(0, 4)
      }
    }

    const random = (max) => {
      return Math.floor(Math.random() * max)
    }

    const mintRealms = () => {
      if (singleMint.value === 1) {
        const id = random(availableTokenIds.value.length)
        mint(availableTokenIds.value[id])
        console.log(id)
      } else {
        const randomIds = []

        for (let step = 0; step < singleMint.value; step++) {
          randomIds.push(random(availableTokenIds.value.length))
        }
        console.log(randomIds)
        multiMint(randomIds)
      }
    }

    onMounted(() => {
      cycleIds()
      window.setInterval(() => {
        cycleIds()
      }, 3000)
    })

    const openSeaData = ref()
    const selectedRealm = ref()
    const baseAssetAddress =
      'https://api.opensea.io/api/v1/assets?asset_contract_address=0x7afe30cb3e53dba6801aa0ea647a0ecea7cbe18d&limit=50'

    useFetch(async () => {
      await getAvailableTokenIds()
      const response = await axios.get(baseAssetAddress)
      openSeaData.value = response.data.assets
      selectedRealm.value = openSeaData.value[0]
    })

    const cycleIds = () => {
      const num = random(49)
      selectedRealm.value = openSeaData.value ? openSeaData.value[num] : null
    }

    return {
      etherSingleMintCost,
      multiMintIds,
      addIds,
      mint,
      error,
      result,
      multiMintId,
      multiMint,
      singleMint,
      removeIds,
      loading,
      limitMultiLength,
      limitLength,
      loadingModal,
      account,
      availableTokenIds,
      openSeaData,
      cycleIds,
      selectedRealm,
      mintRealms,
    }
  },
})
</script>
