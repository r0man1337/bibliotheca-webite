import { createTokenUtils } from '~/utils/create-token-utils'

export default {
  mainnet: createTokenUtils([
    {
      key: 'LootRealms',
      type: 'token',
      symbol: 'LootRealms',
      name: 'Realms (for Adventurers)',
      address: '0x7AFe30cB3E53dba6801aa0EA647A0EcEA7cBe18d',
    },
    {
      key: 'ATIME',
      type: 'token',
      symbol: 'ATIME',
      name: 'Adventure Time (for Adventurers)',
      address: '0x810F86eb43CcAacd401EF50DFab87945A514F9CF',
    },
  ]),
  rinkeby: createTokenUtils([
    {
      key: 'LootRealms',
      type: 'token',
      symbol: 'LootRealms',
      name: 'Realms (for Adventurers)',
      address: '0x6B13F1C319c2DdA7Ae15c04f540671B8A0E2AE9B',
    },
    {
      key: 'ATIME',
      type: 'token',
      symbol: 'ATIME',
      name: 'Adventure Time (for Adventurers)',
      address: '0x7D99D9c39CacCFb9EA9598030b328630d8957b36',
    },
  ]),
  arbitrumRinkeby: createTokenUtils([
    {
      key: 'LootRealms',
      type: 'token',
      symbol: 'LootRealms',
      name: 'Realms (for Adventurers)',
      address: '0x5fAe6B0BE396B9541D5Cc8D50a98168b790d0d7e',
    },
  ]),
  localDevelopment: createTokenUtils([
    {
      key: 'LootRealms',
      type: 'token',
      symbol: 'LootRealms',
      name: 'Realms (for Adventurers)',
      address: '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9',
    },
  ]),
}
