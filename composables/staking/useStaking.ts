import { reactive, ref, Ref } from '@nuxtjs/composition-api'
import { useNetwork, activeNetwork } from '../web3/useNetwork'
import { useWeb3 } from '../web3/useWeb3'
import { useRealms } from '~/composables/web3/useRealms'

export function useStaking() {
  const { provider, library, account, activate } = useWeb3()
  const { networks, partnerNetwork, useL1Network, useL2Network } = useNetwork()

  const stakeRealm = () => {}
}
