<template>
  <a
    :href="url"
    target="_blank"
    rel="noopener noreferrer"
    className="w-24 relative group"
  >
    <span className="truncate">
      {{ hash.substr(0, 15) }}...{{ hash.substr(hash.length - 4) }}
      <!--<Tooltip>{hash}</Tooltip>-->
    </span>
  </a>
</template>
<script>
import { defineComponent, computed } from '@vue/composition-api'
import { useNetwork } from '~/composables/web3/useNetwork'

export default defineComponent({
  props: {
    hash: {
      type: String,
      required: false,
      default: null,
    },
    type: {
      type: String,
      required: true,
      default: null,
    },
  },
  setup(props) {
    const { useL1Network, useL2Network } = useNetwork()

    const l1Prefix = useL1Network?.value.explorerUrl
    const l2Prefix = useL2Network?.value.explorerUrl

    const url = computed(() => {
      switch (props.type) {
        case 'deposit':
        case 'deposit-l1':
        case 'approve':
        case 'connext-deposit':
        case 'outbox':
          return `${l1Prefix}/tx/${props.hash}`
        case 'deposit-l2':
        case 'withdraw':
        case 'connext-withdraw':
        case 'deposit-l2-auto-redeem':
        case 'deposit-l2-ticket-created':
          return `${l2Prefix}/tx/${props.hash}`

        case 'chain':
          return `${l2Prefix}/chain/${props.hash}`
        case 'address':
          if (props.layer === 1) {
            return `${l1Prefix}/address/${props.hash}`
          }
          return `${l2Prefix}/address/${props.hash}`
        default:
          return '#'
      }
    })

    return {
      url,
    }
  },
})
</script>
