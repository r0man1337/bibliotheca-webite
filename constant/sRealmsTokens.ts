import { createTokenUtils } from '~/utils/create-token-utils'

export default {
  mainnet: createTokenUtils([
    {
      key: 'sRealms',
      type: 'token',
      symbol: 'sRealms',
      name: 'sRealms (for Adventurers)',
      address: '0x7AFe30cB3E53dba6801aa0EA647A0EcEA7cBe18d',
    },
  ]),
  rinkeby: createTokenUtils([
    {
      key: 'sRealms',
      type: 'token',
      symbol: 'LootRealms',
      name: 'sRealms (for Adventurers)',
      address: '0x6B13F1C319c2DdA7Ae15c04f540671B8A0E2AE9B',
    },
  ]),
  arbitrumRinkeby: createTokenUtils([
    {
      key: 'sRealms',
      type: 'token',
      symbol: 'sRealms',
      name: 'sRealms (for Adventurers)',
      address: '0x4D9a6c1EA9Bd17B9Bce0257c27FC32986372990D',
    },
  ]),
  localDevelopment: createTokenUtils([
    {
      key: 'sRealms',
      type: 'token',
      symbol: 'sRealms',
      name: 'sRealms (for Adventurers)',
      address: '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9',
    },
  ]),
}
