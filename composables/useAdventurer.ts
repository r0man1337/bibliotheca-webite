/* eslint-disable max-depth */
import {
  computed,
  reactive,
  onMounted,
  useContext,
  ref,
  watch,
} from '@nuxtjs/composition-api'
import {
  getl1Adventurer,
  getl2Adventurer,
  usersSRealms,
} from './graphql/queries'
import { useWeb3 } from '~/composables/web3/useWeb3'
import {
  useNetwork,
  activeNetwork,
  Network,
} from '~/composables/web3/useNetwork'
import { useWeb3Modal } from '~/composables/web3/useWeb3Modal'
import { useGraph } from '~/composables/web3/useGraph'

export function useAdventurer() {
  const loading = ref(false)
  const error = reactive({
    getAdventurer: null,
  })
  const { gqlRequest } = useGraph()
  const { useL1Network, useL2Network } = useNetwork()
  const { open } = useWeb3Modal()
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
          (adventurer.value.l1 = await fetchAdventurer(
            account,
            useL1Network.value
          )),
          (adventurer.value.l2 = await fetchAdventurer(
            account,
            useL2Network.value
          )),
        ])
        console.log(adventurer.value)
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
