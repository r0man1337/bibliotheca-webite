import { computed, onMounted, ref, watch } from '@nuxtjs/composition-api'
// import { useLocalStorage } from 'vue-composable';

import { useModal } from '../useModal'
import { useNotification } from '../useNotification'
import { useWeb3 } from './useWeb3'

import MainnetSVG from '~/assets/icons/mainnet.svg?inline'
import ArbitrumSVG from '~/assets/icons/arbitrum.svg?inline'

const activeNetworks = process.env.ACTIVE_NETWORKS.split(',')
export enum Network {
  Mainnet = 'mainnet',
  Rinkeby = 'rinkeby',
  Arbitrum = 'arbitrum',
  ArbRinkeby = 'arbitrum-rinkeby',
}
interface TokenBridge {
  l1Address: string
  l2Address: string
}

const mainnetBridge: TokenBridge = {
  l1Address: '0x72Ce9c846789fdB6fC1f34aC4AD25Dd9ef7031ef',
  l2Address: '0x5288c571Fd7aD117beA99bF60FE0846C4E84F933',
}

const rinkebyBridge: TokenBridge = {
  l1Address: '0x70C143928eCfFaf9F5b406f7f4fC28Dc43d68380',
  l2Address: '0x9413AD42910c1eA60c737dB5f58d1C504498a3cD',
}
export const networks = []
if (activeNetworks.includes('mainnet')) {
  networks.push({
    id: 'mainnet',
    chainId: 1,
    name: 'Ethereum Mainnet',
    icon: MainnetSVG,
    tokenBridge: mainnetBridge,
    partnerChainID: 42161,
    isArbitrum: false,
    url: process.env.RPC_URL_1 as string,
  })
}
if (activeNetworks.includes('rinkeby')) {
  networks.push({
    id: 'rinkeby',
    chainId: 4,
    name: 'Eth Rinkeby',
    icon: MainnetSVG,
    tokenBridge: rinkebyBridge,
    partnerChainID: 421611,
    isArbitrum: false,
    url: 'https://rinkeby-light.eth.linkpool.io',
  })
}
if (activeNetworks.includes('arbitrum')) {
  networks.push({
    id: 'arbitrum',
    chainId: 42161,
    name: 'Arbitrum',
    icon: MainnetSVG,
    tokenBridge: mainnetBridge,
    partnerChainID: 1,
    isArbitrum: true,
    url: 'ttps://arb1.arbitrum.io/rpc',
  })
}
if (activeNetworks.includes('arbitrum-rinkeby')) {
  networks.push({
    id: 'arbitrum-rinkeby',
    chainId: 421611,
    name: 'Arbitrum Rinkeby',
    icon: MainnetSVG,
    tokenBridge: rinkebyBridge,
    partnerChainID: 4,
    isArbitrum: true,
    url: 'https://rinkeby.arbitrum.io/rpc',
  })
}

export const activeNetworkId = ref<Network>()
export const activeNetwork = computed(
  () => networks.find((n) => n.id === activeNetworkId.value) || networks[0]
)

export function useNetwork() {
  const { showWarning } = useNotification()
  const { account, chainId } = useWeb3()
  const { showNetworksMismatchDialog } = useModal()

  const networkMismatch = computed(
    // eslint-disable-next-line eqeqeq
    () => chainId.value != activeNetwork.value?.chainId
  )

  const checkForNetworkMismatch = () => {
    if (networkMismatch.value) {
      showNetworksMismatchDialog()
    }
  }

  async function switchToMainnet() {
    if (window.ethereum) {
      const chainData = {
        chainId: '0x1',
      }

      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [chainData],
        })
      } catch (error) {
        return Promise.reject(error)
      }
    }
  }

  async function switchToRinkeby() {
    if (window.ethereum) {
      const chainData = {
        chainId: '0x4',
      }

      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [chainData],
        })
      } catch (error) {
        return Promise.reject(error)
      }
    }
  }

  async function switchToArbRinkeby() {
    if (window.ethereum) {
      const chainId = '0x66eeb'

      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId }],
        })
      } catch (switchError) {
        // 4902 error code indicates that the chain has not been added to MetaMask.
        if (switchError.code === 4902) {
          // eslint-disable-next-line max-depth
          try {
            const chainData = {
              chainId,
              chainName: 'Arbitrum Testnet',
              nativeCurrency: {
                name: 'Ethereum',
                symbol: 'ARETH',
                decimals: 18,
              },
              rpcUrls: ['https://rinkeby.arbitrum.io/rpc'],
              blockExplorerUrls: ['https://polygonscan.com/'],
            }
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [chainData, account.value],
            })
          } catch (addError) {
            return Promise.reject(addError)
          }
        } else {
          return Promise.reject(switchError)
        }
      }
    }
  }
  async function switchToArbitrum() {
    if (window.ethereum) {
      const chainId = '0xa4b1'

      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId }],
        })
      } catch (switchError) {
        // 4902 error code indicates that the chain has not been added to MetaMask.
        if (switchError.code === 4902) {
          // eslint-disable-next-line max-depth
          try {
            const chainData = {
              chainId,
              chainName: 'Arbitrum One',
              nativeCurrency: {
                name: 'Ethereum',
                symbol: 'AETH',
                decimals: 18,
              },
              rpcUrls: ['https://arbitrum.io/rpc'],
              blockExplorerUrls: ['https://arbiscan.io//'],
            }
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [chainData, account.value],
            })
          } catch (addError) {
            return Promise.reject(addError)
          }
        } else {
          return Promise.reject(switchError)
        }
      }
    }
  }
  async function switchNetwork() {
    try {
      if (activeNetworkId.value === 'mainnet') {
        await switchToMainnet()
      } else if (activeNetworkId.value === 'rinkeby') {
        await switchToRinkeby()
      } else if (activeNetworkId.value === 'arbitrum-rinkeby') {
        await switchToArbRinkeby()
      } else {
        await switchToArbitrum()
      }
      return Promise.resolve()
    } catch (error) {
      showWarning('Failed to switch network')
      return Promise.reject(error)
    }
  }

  watch(activeNetworkId, () => {
    localStorage.setItem('network', activeNetworkId.value)
  })

  onMounted(() => {
    if (activeNetworkId.value) {
      return
    }
    // @ts-ignore issue
    activeNetworkId.value = localStorage.getItem('network') || 'mainnet'
  })

  return {
    networkMismatch,
    networks,
    chainId,
    activeNetworkId,
    activeNetwork,
    switchNetwork,
    checkForNetworkMismatch,
  }
}
