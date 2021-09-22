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
                  Value
                </th>
              </tr>
            </thead>
            <tbody class="bg-gray-600 text-white divide-y divide-gray-200">
              <tr v-for="(transaction, index) in transactions" :key="index">
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
                  <!-- <StatusBadge
          variant={
            transaction.status === 'success'
              ? 'green'
              : transaction.status === 'failure'
              ? 'red'
              : transaction.status === 'pending'
              ? 'blue'
              : 'yellow'
          }
        >
          {transaction.status}
        </StatusBadge>-->
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
                      transaction.status.toLowerCase() === 'confirmed'
                    "
                    class="relative group"
                  >
                    <button
                      :disabled="!isDepositMode"
                      :onClick="handleTriggerOutbox"
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
                      Claim
                    </button>
                    <Tooltip v-if="!isDepositMode"
                      >Must be on l1 network to claim withdrawal.</Tooltip
                    >
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
                  <!--{!transaction.isWithdrawal && (
          <>
            {transaction.createdAt && transaction.status === 'pending' ? (
              <PendingCountdown transaction={transaction} />
            ) : (
              <span>{transaction.resolvedAt ?? transaction.createdAt ?? 'N/A'}</span>
            )}
          </>
        )}
        {transaction.isWithdrawal && transaction.status === 'Unconfirmed' && (
          <>
            <span>Unconfirmed: ETA: {calcEtaDisplay()}</span>
          </>
        )}-->
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
                    :hash="transaction.transactionId"
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
                  {{ transaction.value }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  setup() {
    return {
      transactions: [
        {
          direction: 'deposit-l1',
          status: 'success',
          createdAtTime: 42422,
          createdAt: 42422,
          resolvedAt: 42422,
          transactionId:
            '0x1a3991bb5c63225e9a58612843cca36a088fa702c57c3762974a054f8768b313',
          asset: 'LootRealm',
          value: '',
          uniqueId: null,
          isWithdrawal: false,
          blockNum: 404554,
          tokenAddress: '0x2a8Bd12936BD5fC260314a80D51937E497523FCC',
          seqNum: 1,
        },
      ],
    }
  },
})
</script>
