import { createTokenUtils } from '~/utils/create-token-utils'

export default {
  arbitrumRinkeby: createTokenUtils([
    {
      key: 'LordsToken',
      type: 'token',
      symbol: 'LORDS',
      name: 'LordsToken',
      address: '0x9c3Cb08A7C4924B0365D5FE427Df04adD3FA3024',
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
