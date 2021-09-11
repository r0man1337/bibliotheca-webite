<template>
  <section>
    <div class="sm:w-1/2">
      <h1>Mint remaining Realms - 0.1 ETH each</h1>
      <h5>Contract address: 0x7afe30cb3e53dba6801aa0ea647a0ecea7cbe18d</h5>
      <a
        class="hover:underline my-4"
        href="https://etherscan.io/address/0x7afe30cb3e53dba6801aa0ea647a0ecea7cbe18d#code"
        >Etherscan</a
      >

      <div class="py-10">
        <h4>Find Available Realm IDS Here:</h4>
        <a
          target="blank_"
          class="hover:text-white text-lg"
          href="https://www.crudefingers.com/tracker/realms"
          >https://www.crudefingers.com/tracker/realms</a
        >
      </div>

      <div class="my-8">
        <h3>Mint Realm</h3>
        <input
          id="mintId"
          v-model="singleMint"
          class="
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
            bg-black
          "
          type="number"
          label="Realm Id"
          placeholder="Enter Realm Id to mint"
          @input="limitLength(singleMint)"
        />
        <div class="my-4 flex">
          <BButton
            :disabled="!singleMint"
            type="primary"
            @click="mint(singleMint)"
          >
            {{ loading ? 'loading...' : 'Mint Realm' }}
          </BButton>
          <span class="self-center ml-2">{{ etherSingleMintCost }} ETH</span>
        </div>
      </div>
      <div class="text-center">
        <h1>or</h1>
      </div>
      <div class="my-8">
        <h3>Mint Multiple Realms</h3>
        <form class="flex" @submit.prevent="addIds">
          <input
            id="mintIds"
            v-model="multiMintId"
            type="number"
            class="
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
              bg-black
            "
            label="Multimint Realm Ids"
            placeholder="Enter Realm Id and press enter"
            @input="limitMultiLength(multiMintId)"
          />
          <!-- <button class="px-4 h-full self-center" type="submit"> add</button> -->
        </form>
        <div class="flex mt-3">
          <button
            v-for="(id, index) in multiMintIds"
            :key="index"
            class="hover:bg-red-400 px-2 py-1 bg-black mr-2 rounded"
            @click="removeIds(id)"
          >
            {{ id }} <span class="ml-2">X</span>
          </button>
        </div>
        <div class="my-4 flex">
          <BButton
            :disabled="!multiMintIds.length"
            type="primary"
            @click="multiMint(multiMintIds)"
            >{{ loading ? 'loading...' : 'Mint Realms' }}</BButton
          >

          <span class="self-center ml-2">
            {{ (multiMintIds.length * 0.1).toFixed(1) }} ETH</span
          >
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
                    This Realm has already been minted
                  </strong>
                  <strong
                    v-if="
                      error.mint
                        ? error.mint.includes(
                            'One of these tokens have already been minted'
                          )
                        : false
                    "
                  >
                    One of these realms have already been minted. Check here for
                    full list of available Ids.
                    <a
                      target="blank_"
                      class="hover:text-white"
                      href="https://www.crudefingers.com/tracker/realms"
                      >https://www.crudefingers.com/tracker/realms</a
                    >
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
                <div v-if="loading">
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
      <div class="my-4">
        READ: Please take note that this is a beta version feature and is
        provided on an "as is" and "as available" basis. Bibliotheca does not
        give any warranties and will not be liable for any loss, direct or
        indirect through continued use of this feature.
      </div>
      <!-- <div>
        <button @click="ids">get ids</button>
      </div> -->
    </div>
  </section>
</template>

<script>
import { computed, defineComponent, ref } from '@vue/composition-api'
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
    const singleMint = ref()
    const multiMintIds = ref([])
    const multiMintId = ref(null)
    const { mint, result, error, loading, multiMint, loadingModal, ids } =
      useMint()

    const etherSingleMintCost = computed(() => {
      if (singleMint.value) {
        return 0.1
      } else {
        return 0
      }
    })

    const addIds = () => {
      multiMintIds.value.push(multiMintId.value)
      multiMintId.value = ''
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

    // onMounted(async () => {
    //   await ids()
    // })

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
      ids,
    }
  },
})
</script>
