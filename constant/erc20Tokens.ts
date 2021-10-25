import { createTokenUtils } from '~/utils/create-token-utils'

export default {
  arbitrumRinkeby: createTokenUtils([
    {
      key: 'LordsToken',
      type: 'token',
      symbol: 'LORDS',
      name: 'LordsToken',
      address: '0x32Ed2C734057d77F9C3b1D1E167F7D9b3a623Ddd',
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
    {
      key: 'LordsToken',
      type: 'token',
      symbol: 'LORDS',
      name: 'LordsToken',
      address: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
    },
  ]),
}
