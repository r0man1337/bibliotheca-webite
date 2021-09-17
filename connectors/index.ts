import { InjectedConnector } from '@web3-react/injected-connector'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import { LedgerConnector } from '@web3-react/ledger-connector'
import { PortisConnector } from '@web3-react/portis-connector'
import { Web3Provider } from '@ethersproject/providers'
import { setWeb3LibraryCallback } from '@instadapp/vue-web3'

function getLibrary(provider: any): Web3Provider {
  const library = new Web3Provider(provider)
  library.pollingInterval = 12000
  return library
}

setWeb3LibraryCallback(getLibrary)

const POLLING_INTERVAL = 12000

const RPC_URLS: { [chainId: number]: string } = {
  1: process.env.RPC_URL_1 as string,
  4: 'https://rinkeby-light.eth.linkpool.io',
  421611: 'https://rinkeby.arbitrum.io/rpc',
  42161: 'ttps://arb1.arbitrum.io/rpc',
}

export const injected = new InjectedConnector({
  supportedChainIds: [1, 4, 421611, 42161],
})

export const walletconnect = new WalletConnectConnector({
  rpc: { 1: RPC_URLS[1] },
  qrcode: true,
})
export const portis = new PortisConnector({
  dAppId: process.env.PORTIS_ID as string,
  networks: [1],
})

export const ledger = new LedgerConnector({
  chainId: 1,
  url: RPC_URLS[1],
  pollingInterval: POLLING_INTERVAL,
})
