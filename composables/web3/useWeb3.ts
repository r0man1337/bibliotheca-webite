/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { computed, onMounted, ref, watch } from '@nuxtjs/composition-api'
import { providers } from 'ethers'
import { useWeb3 as UseWeb3Insta } from '@instadapp/vue-web3'
import { Network } from './useNetwork'

const chains = [
  {
    name: 'mainnet' as Network,
    chainId: 1,
    displayName: 'Mainnet',
  },
  {
    name: 'rinkeby' as Network,
    chainId: 4,
    displayName: 'Eth Rinkeby',
  },
  {
    name: 'arbitrum-rinkeby' as Network,
    chainId: 421611,
    node: 'https://rinkeby.arbitrum.io/rpc',
    displayName: 'Arbitrum Rinkeby',
  },
  {
    name: 'arbitrum' as Network,
    chainId: 42161,
    node: 'https://arb1.arbitrum.io/rpc',
    displayName: 'Arbitrum',
  },
]

export function useWeb3() {
  const {
    active,
    activate,
    deactivate,
    connector,
    chainId,
    account,
    provider,
    error,
  } = UseWeb3Insta()

  const networkName = computed<Network>(
    () =>
      chains.find((c) => c.chainId === chainId.value)?.name || Network.Mainnet
  )

  // eslint-disable-next-line require-await
  return {
    account,
    chainId,
    provider,
    providers,
    active,
    activate,
    deactivate,
    networkName,
  }
}
