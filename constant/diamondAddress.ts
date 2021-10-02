import { createTokenUtils } from '~/utils/create-token-utils'

export default {
  arbitrumRinkeby: createTokenUtils([
    {
      key: 'realmsDiamond',
      type: 'diamond',
      symbol: 'realmsDiamond',
      name: 'Realms Diamond',
      address: '0x5fAe6B0BE396B9541D5Cc8D50a98168b790d0d7e',
    },
  ]),
  localDevelopment: createTokenUtils([
    {
      key: 'realmsDiamond',
      type: 'diamond',
      symbol: 'realmsDiamond',
      name: 'Realms Diamond',
      address: '0x5FC8d32690cc91D4c39d9d3abcBD16989F875707',
    },
  ]),
}
