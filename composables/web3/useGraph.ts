import { useContext, ref } from '@nuxtjs/composition-api'
import { usersRealms } from './../graphql/queries'
import { useWeb3 } from '~/composables/web3/useWeb3'
export function useGraph() {
  const loading = ref(false)
  const { account, activate } = useWeb3()

  const { $graphql } = useContext()

  const gqlRequest = async (
    query: any,
    variables: any,
    network: any = 'default'
  ) => {
    loading.value = true
    console.log(network)
    try {
      return await $graphql[network].request(query, variables)
    } catch (e) {
      console.log(e)
    } finally {
      loading.value = false
    }
  }

  const getUsersRealms = async (network) => {
    console.log(network)
    if (!network) {
      network = 'default'
    }
    let response
    try {
      // await activate()
    } catch (e) {
      console.log(e)
    } finally {
      response = await gqlRequest(
        usersRealms,
        { address: account.value },
        network
      )
    }
    return response ? response.realms : []
  }

  return {
    getUsersRealms,
  }
}
