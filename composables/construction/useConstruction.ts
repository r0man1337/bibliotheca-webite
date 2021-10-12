import { reactive, ref, Ref } from '@nuxtjs/composition-api'
import { ethers } from 'ethers'
import { useNetwork, activeNetwork } from '../web3/useNetwork'
import { useWeb3 } from '../web3/useWeb3'

import TraitConstructionFacetAbi from '~/abi/TraitConstructionFacet.json'

import diamondAddress from '~/constant/diamondAddress'
import erc721tokens from '~/constant/erc721tokens'

export function useConstruction() {
  const { provider, library, account, activate } = useWeb3()
  const { networks, partnerNetwork, useL1Network, useL2Network } = useNetwork()

  const error = reactive({
    building: null,
  })

  const loading = reactive({
    building: null,
  })

  const result = reactive({ resources: null })

  const buildings = ref()

  const constructBuilding = async (
    realmId,
    buildingId,
    upgradeResourceIds,
    upgradeResourceValues
  ) => {
    try {
      error.building = null
      loading.building = true
      return await construct(
        account.value,
        activeNetwork.value.id,
        realmId,
        buildingId,
        upgradeResourceIds,
        upgradeResourceValues
      )
    } catch (e) {
      console.log(e)
      error.building = e.message
    } finally {
      await getBuildings(realmId)
      loading.building = false
    }
  }

  const getBuildings = async (realmId) => {
    try {
      error.building = null
      loading.building = true
      buildings.value = await getBuilding(
        account.value,
        activeNetwork.value.id,
        realmId
      )
    } catch (e) {
      console.log(e)
      error.building = e.message
    } finally {
      loading.building = false
    }
  }
  return {
    constructBuilding,
    getBuildings,
    buildings,
    error,
    loading,
    result,
  }
}
async function getBuilding(owner, network, realmId) {
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const tokensArr = diamondAddress[network].allTokens
  const tokensAddrArr = tokensArr.map((a) => a.address)
  const signer = provider.getSigner()
  const constructionFacet = new ethers.Contract(
    tokensAddrArr[0],
    TraitConstructionFacetAbi.abi,
    signer
  )

  return await constructionFacet.getBuildings(realmId)
}

async function construct(
  owner,
  network,
  realmId,
  buildingId,
  upgradeResourceIds,
  upgradeResourceValues
) {
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const tokensArr = diamondAddress[network].allTokens
  const tokensAddrArr = tokensArr.map((a) => a.address)
  const signer = provider.getSigner()
  const constructionFacet = new ethers.Contract(
    tokensAddrArr[0],
    TraitConstructionFacetAbi.abi,
    signer
  )

  const construct = await constructionFacet.createBuilding(
    realmId,
    buildingId,
    upgradeResourceIds,
    upgradeResourceValues
  )
  await construct.wait()
  return construct
}
