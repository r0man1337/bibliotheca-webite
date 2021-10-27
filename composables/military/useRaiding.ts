import { reactive, ref, Ref } from '@nuxtjs/composition-api'
import { ethers } from 'ethers'
import { activeNetwork } from '../web3/useNetwork'

// ABI
import RaidingFacet from '~/abi/RaidingFacet.json'

// ADDRESS CONSTS
import diamondAddress from '~/constant/diamondAddress'

export function useRaiding() {
  const error = reactive({
    raidingRealm: null,
  })

  const loading = reactive({
    raidingRealm: false,
    fetching: false,
  })

  const result = reactive({ resources: null })

  const raidingRealm = async (attackingRealmId, defendingRealmId) => {
    try {
      error.raidingRealm = null
      loading.raidingRealm = true
      return await raidRealm(
        activeNetwork.value.id,
        attackingRealmId,
        defendingRealmId
      )
    } catch (e) {
      console.log(e)
      error.raidingRealm = e.message
    } finally {
      loading.raidingRealm = false
    }
  }

  return {
    raidingRealm,
    error,
    loading,
    result,
  }
}

async function raidRealm(network, attackingRealmId, defendingRealmId) {
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const tokensArr = diamondAddress[network].allTokens
  const signer = provider.getSigner()
  const tokensAddrArr = tokensArr.map((a) => a.address)

  const raidingFacet = new ethers.Contract(
    tokensAddrArr[0],
    RaidingFacet.abi,
    signer
  )

  const raid = await raidingFacet.raidRealm(attackingRealmId, defendingRealmId)

  await raid.wait()

  return raid
}
