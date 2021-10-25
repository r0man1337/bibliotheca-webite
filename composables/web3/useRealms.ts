/* eslint-disable max-depth */
import {
  computed,
  reactive,
  onMounted,
  useContext,
  ref,
  watch,
} from '@nuxtjs/composition-api'
import { useWeb3 } from '@instadapp/vue-web3'
import { L1ArbitrumExtendedGateway } from 'arb-ts/dist/lib/abi'
import { useNetwork, activeNetwork } from './useNetwork'
import { usersRealms, usersSRealms } from './../graphql/queries'
import { useWeb3Modal } from '~/composables/web3/useWeb3Modal'
import { useGraph } from '~/composables/web3/useGraph'

export enum Layers {
  l1,
  l2,
}
export function useRealms() {
  const loading = ref(false)
  const error = reactive({
    getUserRealms: null,
  })
  const { account } = useWeb3()
  const { gqlRequest } = useGraph()
  const { useL1Network, useL2Network } = useNetwork()
  const { open } = useWeb3Modal()
  const userRealms = ref({
    l1: null,
    l2: null,
  })
  const sRealms = ref()

  const fetchUserRealms = async (account, layer) => {
    let network
    if (layer === 'l1') {
      network = useL1Network.value.id
    } else {
      network = useL2Network.value.id
    }
    const { realms } = await gqlRequest(
      usersRealms,
      { address: account.toLowerCase() },
      network
    )
    return realms
  }

  const getUserRealms = async (address?: null, layer?: Layers) => {
    try {
      error.getUserRealms = null
      loading.value = true

      const userAddress = address || account.value
      if (!layer) {
        Promise.all([
          (userRealms.value.l1 = await fetchUserRealms(userAddress, 'l1')),
          (userRealms.value.l2 = await fetchUserRealms(userAddress, 'l2')),
        ])
      } else {
        userRealms.value[layer] = await fetchUserRealms(userAddress, layer)
      }
    } catch (e) {
      console.log(e)
    } finally {
      loading.value = false
    }
  }

  const fetchUserSRealms = async (account, network) => {
    const { srealms } = await gqlRequest(
      usersSRealms,
      { address: account.toLowerCase() },
      network
    )
    return srealms
  }

  const getUserSRealms = async (address, network?) => {
    try {
      error.getUserRealms = null
      loading.value = true
      if (!address) {
        sRealms.value = await fetchUserSRealms(address, useL2Network.value.id)
      } else {
        sRealms.value = await fetchUserSRealms(address, network)
      }
    } catch (e) {
      console.log(e)
    } finally {
      loading.value = false
    }
  }

  return {
    getUserRealms,
    getUserSRealms,
    error,
    loading,
    userRealms,
    sRealms,
  }
}
