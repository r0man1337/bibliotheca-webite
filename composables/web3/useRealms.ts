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
import { buildSRealmsWhere } from '../graphql/helpers/search'
import { useNetwork, activeNetwork } from './useNetwork'
import { getRealms, getSRealmsQuery } from './../graphql/queries'
import { useWeb3Modal } from '~/composables/web3/useWeb3Modal'
import { useGraph } from '~/composables/web3/useGraph'
export enum Layers {
  l1,
  l2,
}
export function useRealms() {
  const loading = ref(false)
  const error = reactive({
    getWalletRealms: null,
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
      getRealms,
      { address: account.toLowerCase() },
      network
    )
    return realms
  }

  const getWalletRealms = async (address?: null, layer?: Layers) => {
    try {
      error.getWalletRealms = null
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

  const defaultVariables = (params?) => {
    return {
      address: params?.address?.toLowerCase() || '',
      first: params?.first || 12,
      skip: params?.skip || 0,
    }
  }

  const fetchSRealms = async (params?) => {
    console.log(defaultVariables(params))
    const { srealms } = await gqlRequest(
      getSRealmsQuery,
      defaultVariables(params),
      useL2Network.value.id
    )
    return srealms
  }

  const getSRealms = async (params) => {
    try {
      error.getWalletRealms = null
      loading.value = true
      sRealms.value = await fetchSRealms(params)
    } catch (e) {
      console.log(e)
    } finally {
      loading.value = false
    }
  }

  return {
    getWalletRealms,
    getSRealms,
    error,
    loading,
    userRealms,
    sRealms,
  }
}
