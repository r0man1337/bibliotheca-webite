/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { computed, onMounted, ref, watch } from '@nuxtjs/composition-api'
import { providers } from 'ethers'
import { useWeb3 as UseWeb3Insta } from '@instadapp/vue-web3'
import { Network, useNetwork } from './useNetwork'

export function useWeb3() {
  const {
    active,
    activate,
    deactivate,
    connector,
    chainId,
    account,
    provider,
    library,
    error,
  } = UseWeb3Insta()

  // eslint-disable-next-line require-await
  return {
    account,
    chainId,
    provider,
    providers,
    active,
    library,
    activate,
    deactivate,
  }
}
