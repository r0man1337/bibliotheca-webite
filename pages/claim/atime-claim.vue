<template>
  <section class="flex flex-wrap justify-center">
    <div class="sm:w-1/2 text-center self-center relative">
      <div class="mb-8">
        <h1>Season 1: $ATIME</h1>
        <p class="text-2xl">
          Before claiming please read about the dynamics of $ATIME
          <a
            class="text-red-500 underline"
            href="https://genesisproject.notion.site/Adventure-Time-ATIME-cdc3ff41deb747dd9a04bd1bfc35cb3e"
            >here</a
          >
        </p>
      </div>
      <div class="p-6 bg-black rounded-xl shadow-lg">
        <h2>100 $ATIME per Realm</h2>

        <div class="my-12 text-center">
          <div class="my-4 flex justify-around">
            <div class="flex">
              <BButton
                class="bg-gray-900 text-2xl"
                type="primary"
                @click="claimAllForOwner"
              >
                {{ loading.mint ? 'loading...' : 'Claim all $ATIME' }}
              </BButton>
            </div>
          </div>
        </div>
        <h5>
          Contract address:
          <a
            class="hover:underline my-4"
            href="https://etherscan.io/token/0x810f86eb43ccaacd401ef50dfab87945a514f9cf#writeContract"
          >
            0x810f86eb43ccaacd401ef50dfab87945a514f9cf</a
          >
        </h5>
      </div>
      <div class="text-center my-8 text-2xl">or</div>

      <div class="p-6 bg-black rounded-xl">
        <h2>Claim For Each Realm</h2>
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
        />
        <div class="my-4 flex justify-around">
          <div class="flex">
            <BButton
              :disabled="!singleMint"
              type="primary"
              class="bg-gray-900"
              @click="claimById(singleMint)"
              >{{ loading.mint ? 'loading...' : 'Claim Id' }}</BButton
            >
          </div>
        </div>
        <!-- <h4>Select Realm ids to mint</h4>
        <div class="flex flex-wrap">
          <button
            v-for="(id, index) in availableTokenIds"
            :key="index"
            :disabled="multiMintIds.find((a) => a === id)"
            :class="{ 'bg-gray-600': multiMintIds.find((a) => a === id) }"
            class="bg-black px-2 py-1 hover:bg-gray-800 rounded-xl"
            @click="addIds(id)"
          >
            {{ id.id }}
          </button>
        </div> -->
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
                <h2>Claiming $ATIME</h2>
                <div
                  v-if="error.claim"
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
                      error.claim
                        ? error.claim.includes('ALL_TOKENS_CLAIMED')
                        : false
                    "
                  >
                    All $ATIME Claimed already
                  </strong>
                  <strong
                    v-if="
                      error.claim
                        ? error.claim.includes('MUST_OWN_TOKEN_ID')
                        : false
                    "
                  >
                    You do not own this Realm
                  </strong>
                  <strong
                    v-if="
                      error.claim
                        ? error.claim.includes('insufficient funds for gas')
                        : false
                    "
                  >
                    Insufficient funds for gas</strong
                  >
                </div>
                <div v-if="loading.claim">
                  <Loader class="w-24 h-24" />
                </div>
                <div v-else-if="!error.claim" class="my-8">
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
  </section>
</template>

<script>
import { defineComponent, ref, onMounted } from '@nuxtjs/composition-api'

import { useAtime } from '~/composables/web3/useAtime'
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
    const multiMintIds = ref([])
    const multiMintId = ref(null)
    const singleMint = ref()
    const {
      claimById,
      claimAllForOwner,
      result,
      error,
      loading,
      loadingModal,
      getAvailableTokenIds,
      availableTokenIds,
    } = useAtime()

    onMounted(async () => {
      await getAvailableTokenIds()
    })
    const addIds = (id) => {
      multiMintIds.value.push(id)
    }

    return {
      multiMintIds,
      singleMint,
      addIds,
      claimById,
      claimAllForOwner,
      error,
      result,
      multiMintId,
      loading,
      loadingModal,
      account,
      availableTokenIds,
    }
  },
})
</script>
