import { useContext, ref } from '@nuxtjs/composition-api'
import { useWeb3 } from '@instadapp/vue-web3'
export function useGraph() {
  const loading = ref(false)
  const { account, activate } = useWeb3()

  const { $graphql } = useContext()

  const gqlRequest = async (
    query: any,
    variables: any,
    network: any = 'mainnet'
  ) => {
    console.log(network)
    loading.value = true
    try {
      return await $graphql[network].request(query, variables)
    } catch (e) {
      console.log(e)
    } finally {
      loading.value = false
    }
  }

  return {
    gqlRequest,
  }
}
