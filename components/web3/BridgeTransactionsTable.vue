<template>
  <div class="flex mx-auto flex-col shadow-sm mt-20">
    <div class="-my-2 overflow-x-auto">
      <div class="py-2 align-middle inline-block min-w-full">
        <div
          class="
            overflow-hidden
            sm:rounded-lg
            text-white
            border-4 border-gray-800
            rounded-2xl
          "
        >
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-700">
              <tr>
                <th
                  scope="col"
                  class="px-6 py-3 text-left uppercase tracking-wider"
                >
                  Action
                </th>
                <th
                  scope="col"
                  class="px-4 py-3 text-left uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  class="px-2 py-3 text-left uppercase tracking-wider"
                >
                  Redeem
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left uppercase tracking-wider"
                >
                  Estimated Arrival Time
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left uppercase tracking-wider"
                >
                  transactionid
                </th>
                <th
                  scope="col"
                  class="px-4 py-3 text-left uppercase tracking-wider"
                >
                  Asset
                </th>
                <th
                  scope="col"
                  class="px-6 py-3 text-left uppercase tracking-wider"
                >
                  Token ID
                </th>
              </tr>
            </thead>
            <tbody
              v-if="mergedTransactionsToShow"
              class="bg-gray-600 text-white divide-y divide-gray-200"
            >
              <tr
                v-for="(transaction, index) in mergedTransactionsToShow"
                :key="index"
              >
                <td
                  class="
                    px-6
                    py-6
                    whitespace-nowrap
                    text-sm
                    leading-5
                    font-normal
                    text-dark-blue
                  "
                >
                  {{
                    transaction.direction === 'outbox'
                      ? 'redeem from outbox'
                      : transaction.direction
                  }}
                </td>
                <td class="px-4 py-6 whitespace-nowrap text-sm">
                  <StatusPill :status="transaction.status" />
                </td>
                <td
                  class="
                    px-2
                    py-6
                    whitespace-nowrap
                    leading-5
                    font-normal
                    text-gray-500
                  "
                >
                  <div
                    v-if="
                      transaction.isWithdrawal &&
                      transaction.status &&
                      transaction.status.toLowerCase() === 'confirmed'
                    "
                    class="relative group"
                  >
                    <v-popover placement="right" trigger="hover">
                      <button
                        :disabled="!isDepositMode"
                        type="submit"
                        class="
                          flex
                          items-center
                          justify-center
                          bg-white
                          border border-gray-300
                          rounded-md
                          shadow-sm
                          hover:bg-gray-100
                          p-2
                          min-w-16
                        "
                        @click="handleTriggerOutbox(transaction)"
                      >
                        Claim
                      </button>
                      <template v-if="!isDepositMode" slot="popover">
                        <div
                          class="
                            bg-gray-300
                            shadow-xl
                            p-4
                            rounded
                            text-black
                            w-72
                            ml-2
                          "
                        >
                          Must be on
                          <span @click="switchToL1Network()"
                            >layer 1 network</span
                          >
                          to claim withdrawal
                        </div>
                      </template>
                    </v-popover>
                  </div>

                  <div v-if="showRedeemRetryableButton" class="relative group">
                    <button
                      :disabled="isDepositMode"
                      :onClick="redeemRetryable(transaction.transactionId)"
                      type="submit"
                      class="
                        flex
                        items-center
                        justify-center
                        bg-white
                        border border-gray-300
                        rounded-md
                        shadow-sm
                        hover:bg-gray-100
                        p-2
                        min-w-16
                      "
                    >
                      Re-execute
                    </button>
                    <!--<Tooltip if="isDepositMode">
                Must be on l2 network to execute your l2 deposit.
              </Tooltip>-->
                  </div>

                  <div
                    v-if="
                      transaction.isWithdrawal &&
                      transaction.status === 'Executed'
                    "
                  >
                    Already claimed
                  </div>
                </td>
                <td
                  class="
                    px-6
                    py-6
                    whitespace-nowrap
                    text-sm
                    leading-5
                    font-normal
                    text-gray-500
                  "
                >
                  <div v-if="!transaction.isWithdrawal" class="text-white">
                    <span
                      v-if="
                        transaction.createdAt &&
                        transaction.status === 'pending'
                      "
                    >
                      <PendingCountdown :transaction="transaction" />
                    </span>
                    <span v-else>
                      <span v-if="transaction.resolvedAt">{{
                        transaction.resolvedAt
                      }}</span>
                      <span v-else>{{
                        transaction.createdAt ? transaction.createdAt : 'N/A'
                      }}</span>
                    </span>
                  </div>
                  <div
                    v-if="
                      transaction.isWithdrawal &&
                      transaction.status === 'Unconfirmed'
                    "
                  >
                    <span
                      >Unconfirmed: ETA:
                      {{ calcEtaDisplay(transaction.blockNum) }}</span
                    >
                  </div>
                </td>
                <td
                  class="
                    px-6
                    py-6
                    whitespace-nowrap
                    text-sm
                    leading-5
                    font-normal
                    text-dark-blue
                  "
                >
                  <span v-if="transaction.uniqueId">
                    {{ transaction.uniqueId.toString() }}</span
                  >

                  <ExplorerLink
                    v-else
                    :hash="transaction.txId"
                    :type="transaction.direction"
                  />
                </td>
                <td
                  class="
                    px-4
                    py-6
                    whitespace-nowrap
                    text-xs
                    leading-4
                    font-medium
                    text-navy
                  "
                >
                  <span class="bg-tokenPill rounded-lg py-1 px-3">{{
                    transaction.asset
                  }}</span>
                </td>
                <td
                  class="
                    px-6
                    py-6
                    whitespace-nowrap
                    text-sm
                    leading-5
                    font-normal
                    text-gray-500
                  "
                >
                  {{ transaction.realmId }}
                </td>
              </tr>
            </tbody>
            <tr v-if="loading.transactions">
              <td colspan="5" class="flex w-100 py-2">
                <LoadingRings />
                <span class="ml-4 py-2">Loading Pending Transactions</span>
              </td>
            </tr>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { defineComponent, ref, computed } from '@vue/composition-api'
import {
  activeNetwork,
  activeNetworkId,
  useNetwork,
} from '~/composables/web3/useNetwork'
import LoadingRings from '~/assets/img/loadingRings.svg?inline'

export default defineComponent({
  components: {
    LoadingRings,
  },
  props: {
    mergedTransactionsToShow: {
      type: Array,
      default: null,
    },
    loading: {
      type: Object,
      default: null,
    },
    currentL1BlockNumber: {
      type: Number,
      default: 0,
    },
  },
  setup(props, context) {
    const { useL1Network, useL2Network } = useNetwork()
    const { confirmPeriodBlocks = 45818 } = useL2Network.value
    const { blockTime = 15 } = useL1Network.value
    const handleTriggerOutbox = (transaction) => {
      console.log(transaction)
      if (transaction.txId === null) {
        return
      }
      context.emit('triggerOutbox', transaction)
    }
    const switchToL1Network = () => {
      activeNetworkId.value = useL1Network.value.id
    }
    const calcEtaDisplay = (blockNum) => {
      const blocksRemaining = Math.max(
        confirmPeriodBlocks - (props.currentL1BlockNumber - blockNum),
        0
      )
      const minutesLeft = Math.round((blocksRemaining * blockTime) / 60)
      const hoursLeft = Math.round(minutesLeft / 60)
      const daysLeft = Math.round(hoursLeft / 24)

      if (daysLeft > 0) {
        return `~${blocksRemaining} blocks (~${daysLeft} day${
          daysLeft === 1 ? '' : 's'
        })`
      }

      if (hoursLeft > 0) {
        return `~${blocksRemaining} blocks (~${hoursLeft} hour${
          hoursLeft === 1 ? '' : 's'
        })`
      }

      if (minutesLeft === 0) {
        return 'about 1 hour'
      }

      return `~${blocksRemaining} blocks (~${minutesLeft} minute${
        minutesLeft === 1 ? '' : 's'
      })`
    }
    const showRedeemRetryableButton = ref()
    const isDepositMode = computed(() => {
      return !activeNetwork.value.isArbitrum
    })

    return {
      handleTriggerOutbox,
      calcEtaDisplay,
      switchToL1Network,
      showRedeemRetryableButton,
      isDepositMode,
    }
  },
})
</script>
