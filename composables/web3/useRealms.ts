/* eslint-disable max-depth */
import {
  computed,
  reactive,
  onMounted,
  useContext,
  ref,
  watch,
} from '@nuxtjs/composition-api'
import { useNetwork, activeNetwork, Network } from './useNetwork'
import { useWeb3 } from './useWeb3'
import { usersRealms, usersSRealms } from './../graphql/queries'
import { useWeb3Modal } from '~/composables/web3/useWeb3Modal'
import { useGraph } from '~/composables/web3/useGraph'

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

  const fetchUserRealms = async (account, network) => {
    const { realms } = await gqlRequest(
      usersRealms,
      { address: account.toLowerCase() },
      network
    )
    return realms
  }

  const getUserRealms = async (slug?, network?) => {
    try {
      error.getUserRealms = null
      loading.value = true
      if (!network && !slug) {
        Promise.all([
          (userRealms.value.l1 = await fetchUserRealms(
            account.value,
            useL1Network.value.id
          )),
          (userRealms.value.l2 = await fetchUserRealms(
            account.value,
            useL2Network.value.id
          )),
        ])
      } else {
        userRealms.value.l2 = await fetchUserRealms(slug, network)
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

  const getUserSRealms = async (slug, network?) => {
    try {
      error.getUserRealms = null
      loading.value = true
      if (!network) {
        sRealms.value = await fetchUserSRealms(slug, useL2Network.value.id)
      } else {
        console.log(slug)
        sRealms.value = await fetchUserSRealms(slug, network)
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
