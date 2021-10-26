/* eslint-disable max-depth */
import { reactive, ref } from '@nuxtjs/composition-api'
import { getl1Adventurer, getl2Adventurer } from './graphql/queries'
import { useNetwork } from '~/composables/web3/useNetwork'
import { useWeb3Modal } from '~/composables/web3/useWeb3Modal'
import { useGraph } from '~/composables/web3/useGraph'

export function useAdventurer() {
  const loading = ref(false)
  const error = reactive({
    getAdventurer: null,
  })
  const { gqlRequest } = useGraph()
  const { useL1Network, useL2Network } = useNetwork()
  const adventurer = ref({
    l1: null,
    l2: null,
  })

  const fetchAdventurer = async (account, network) => {
    const query = network.isArbitrum ? getl2Adventurer : getl1Adventurer
    const { wallet } = await gqlRequest(
      query,
      { address: account.toLowerCase() },
      network.id
    )
    return wallet
  }

  const getAdventurer = async (account?, network?) => {
    try {
      error.getAdventurer = null
      loading.value = true
      if (!network) {
        Promise.all([
          (adventurer.value.l1 = await fetchAdventurer(account, 'mainnet')),
          /* (adventurer.value.l2 = await fetchAdventurer(
            account,
            useL2Network.value
          )), */
        ])
      } else {
        await fetchAdventurer(account, network)
      }
    } catch (e) {
      error.getAdventurer = e
      console.log(e)
    } finally {
      loading.value = false
    }
  }

  return {
    getAdventurer,
    adventurer,
    error,
    loading,
  }
}
