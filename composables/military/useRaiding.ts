import { reactive, ref, Ref, computed } from '@nuxtjs/composition-api'
import { ethers } from 'ethers'
import { activeNetwork } from '../web3/useNetwork'
import { useNotification } from '../web3/useNotification'
// ABI
import RaidingFacet from '~/abi/RaidingFacet.json'

// ADDRESS CONSTS
import diamondAddress from '~/constant/diamondAddress'

const selectedAttacking = reactive({
  realm: false,
})
export function useRaiding() {
  const { showError } = useNotification()
  const error = reactive({
    raidingRealm: null,
  })

  const loading = reactive({
    raidingRealm: false,
    fetching: false,
  })

  const raidResults = ref([])

  const raidingRealm = async (attackingRealmIdIn, defendingRealmIdIn) => {
    try {
      error.raidingRealm = null
      loading.raidingRealm = true
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const tokensArr = diamondAddress[activeNetwork.value.id].allTokens
      const signer = provider.getSigner()
      const tokensAddrArr = tokensArr.map((a) => a.address)
      let realmsResult
      const raidingFacet = new ethers.Contract(
        tokensAddrArr[0],
        RaidingFacet.abi,
        signer
      )
      raidingFacet.on(
        'RaidResult',
        (
          attackingRealmId,
          defendingRealmId,
          attackerAddress,
          defenderAddress,
          raidingUnitsLost,
          defendingUnitsLost,
          resourcesIdsPillaged,
          resourcesValuesPillaged,
          unitsCaptured
        ) => {
          if (
            attackingRealmId.toNumber() === parseInt(attackingRealmIdIn) &&
            defendingRealmId.toNumber() === parseInt(defendingRealmIdIn)
          ) {
            console.log('attackingRealm ' + attackingRealmId)
            console.log('defendingRealm ' + defendingRealmId)
            console.log('attackerAddress ' + attackerAddress)
            console.log('defenderAddress ' + defenderAddress)
            console.log('raidingUnitsLost ' + raidingUnitsLost)
            console.log('defendingUnitsLost ' + defendingUnitsLost)
            console.log('resourcesIdsPillaged ' + resourcesIdsPillaged)
            console.log('resourcesValuesPillaged ' + resourcesValuesPillaged)
            console.log('unitsCaptured ' + unitsCaptured)
            const result = {
              attackingRealmId: attackingRealmId.toNumber(),
              defendingRealmId: defendingRealmId.toNumber(),
              attackerAddress,
              defenderAddress,
              raidingUnitsLost: raidingUnitsLost.toNumber(),
              defendingUnitsLost: defendingUnitsLost.toNumber(),
              resourcesIdsPillaged,
              resourcesValuesPillaged,
              unitsCaptured: unitsCaptured.toNumber(),
            }
            console.log(result)
            raidResults.value = raidResults.value.concat(result)

            raidingFacet.removeAllListeners('RaidResult')
          }
        }
      )
      const raid = await raidingFacet.raidRealm(
        attackingRealmIdIn,
        defendingRealmIdIn
      )

      await raid.wait()
      console.log(raid)
    } catch (e) {
      console.log(e)
      await showError(e.data.message)
      error.raidingRealm = e.message
    } finally {
      loading.raidingRealm = false
    }
  }

  const selectedAttackingRealm = computed(() => selectedAttacking.realm)

  const selectAttackingRealm = (realm) => {
    console.log(realm)
    selectedAttacking.realm = realm
  }

  const removeAttackingRealm = () => {
    selectedAttacking.realm = null
  }

  return {
    raidingRealm,
    selectedAttackingRealm,
    selectAttackingRealm,
    removeAttackingRealm,
    error,
    loading,
    raidResults,
  }
}
