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
  ]),
  rinkeby: createTokenUtils([
    {
      key: 'LootRealms',
      type: 'token',
      symbol: 'LootRealms',
      name: 'Realms (for Adventurers)',
      address: '0x6B13F1C319c2DdA7Ae15c04f540671B8A0E2AE9B',
    },
  ]),
}
