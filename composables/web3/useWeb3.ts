/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { computed, onMounted, ref, watch } from '@nuxtjs/composition-api'
import { providers } from 'ethers'
import Web3Modal from 'web3modal'
import { Network } from './useNetwork'

let web3Modal: Web3Modal
let web3Provider: any

let providerOptions = {}

declare global {
  interface Window {
    ethersProviders: any
  }
}
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

const active = ref(false)
const chainId = ref()
const networkName = computed<Network>(
  () => chains.find((c) => c.chainId === chainId.value)?.name || Network.Mainnet
)
const account = ref<string>()
const ethersProviders = ref<any>()

export function setProviders(providers: any) {
  providerOptions = providers
}

export function useWeb3() {
  const deactivate = () => {
    if (
      ethersProviders.value &&
      ethersProviders.value.currentProvider &&
      typeof ethersProviders.value.currentProvider === 'object'
    ) {
      // @ts-ignore issue
      if (typeof web3.value.currentProvider.disconnect === 'function') {
        // @ts-ignore isse
        ethersProviders.value.currentProvider.disconnect()
      }
    }
    web3Modal.clearCachedProvider()
    web3Provider = undefined
    active.value = false
    ethersProviders.value = undefined
    account.value = undefined
    chainId.value = undefined
  }

  const refreshWeb3 = async () => {
    if (!web3Provider) {
      return
    }
    const newWeb3 = new providers.Web3Provider(web3Provider)
    // @ts-ignore issue
    const { chainId: response } = await newWeb3.getNetwork()
    chainId.value = response
    ethersProviders.value = newWeb3
    if (web3Provider.selectedAddress) {
      account.value = web3Provider.selectedAddress
    } else if (web3Provider.accounts && web3Provider.accounts.length) {
      account.value = web3Provider.accounts[0]
    }
  }

  const setProvider = (provider) => {
    if (web3Modal.cachedProvider === 'walletconnect') {
      provider.on('accountsChanged', () => {
        location.reload()
      })

      // Subscribe to networkId change
      provider.on('networkChanged', () => {
        location.reload()
      })

      // Subscribe to session connection/open
      provider.on('open', () => {
        location.reload()
      })

      // Subscribe to session disconnection/close
      provider.on('close', () => {
        location.reload()
      })
    }

    // Subscribe to chainId change
    provider.on('chainChanged', refreshWeb3)
    provider.on('accountsChanged', () => {
      refreshWeb3()
      console.log('accountChanged')
    })
  }

  const activate = async () => {
    web3Provider = await web3Modal.connect()
    active.value = true
    if (web3Provider.selectedAddress) {
      account.value = web3Provider.selectedAddress
    } else if (web3Provider.accounts && web3Provider.accounts.length) {
      account.value = web3Provider.accounts[0]
    }
    const newWeb3 = new providers.Web3Provider(web3Provider)
    // @ts-ignore issue
    const { chainId: response } = await newWeb3.getNetwork()
    chainId.value = response
    ethersProviders.value = newWeb3

    setProvider(web3Provider)
  }

  onMounted(async () => {
    if (web3Modal) {
      return
    }

    web3Modal = new Web3Modal({
      disableInjectedProvider: false,
      cacheProvider: true,
      providerOptions,
      theme: 'dark',
    })

    if (web3Modal.cachedProvider) {
      await activate()
    }
  })

  const setWeb3 = (newWeb3) => {
    ethersProviders.value = newWeb3
  }

  watch(ethersProviders, () => {
    window.ethersProviders = ethersProviders.value
  })

  return {
    account,
    chainId,
    providers,
    ethersProviders,
    active,
    activate,
    deactivate,
    networkName,
    refreshWeb3,
    setWeb3,
  }
}
