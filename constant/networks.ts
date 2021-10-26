import MainnetSVG from '~/assets/icons/mainnet.svg?inline'
import ArbitrumSVG from '~/assets/icons/arbitrum.svg?inline'

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

export type Network = {
  id: string
  chainId: number
  displayName: string
  icon: any
  tokenBridge: TokenBridge
  partnerChainID: number
  isArbitrum: boolean
  explorerUrl: string
  url: string
  blockTime?: number
  confirmPeriodBlocks?: number
}

export const allNetworks: Network[] = [
  {
    id: 'mainnet',
    chainId: 1,
    displayName: 'Ethereum Mainnet',
    icon: MainnetSVG,
    tokenBridge: mainnetBridge,
    partnerChainID: 42161,
    isArbitrum: false,
    explorerUrl: 'https://etherscan.io',
    url: `https://mainnet.infura.io/v3/${process.env.INFURA_ID}`,
    blockTime: 15,
  },
  {
    id: 'rinkeby',
    chainId: 4,
    displayName: 'Eth Rinkeby',
    icon: MainnetSVG,
    tokenBridge: rinkebyBridge,
    partnerChainID: 421611,
    isArbitrum: false,
    explorerUrl: 'https://rinkeby.etherscan.io',
    url: `https://rinkeby.infura.io/v3/${process.env.INFURA_ID}`,
  },
  {
    id: 'arbitrum',
    chainId: 42161,
    displayName: 'Arbitrum',
    icon: MainnetSVG,
    tokenBridge: mainnetBridge,
    partnerChainID: 1,
    isArbitrum: true,
    explorerUrl: 'https://arbiscan.io',
    url: 'https://arb1.arbitrum.io/rpc',
    confirmPeriodBlocks: 48384,
  },
  {
    id: 'arbitrumRinkeby',
    chainId: 421611,
    displayName: 'Arbitrum Rinkeby',
    icon: MainnetSVG,
    tokenBridge: rinkebyBridge,
    partnerChainID: 4,
    isArbitrum: true,
    explorerUrl: 'https://testnet.arbiscan.io',
    url: 'https://rinkeby.arbitrum.io/rpc',
    confirmPeriodBlocks: 6545,
  },
  {
    id: 'localDevelopment',
    chainId: 1337,
    displayName: 'Local Hardhat',
    icon: MainnetSVG,
    tokenBridge: rinkebyBridge,
    partnerChainID: null,
    isArbitrum: false,
    explorerUrl: 'http://127.0.0.1:8545/',
    url: 'http://127.0.0.1:8545/',
  },
]
