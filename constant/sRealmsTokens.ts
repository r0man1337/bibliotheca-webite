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
      address: '0xa6dE5fe02207A649F773d6dC899627193b6d78b4',
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
