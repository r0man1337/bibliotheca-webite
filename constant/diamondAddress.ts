import { createTokenUtils } from '~/utils/create-token-utils'

export default {
  arbitrumRinkeby: createTokenUtils([
    {
      key: 'realmsDiamond',
      type: 'diamond',
      symbol: 'realmsDiamond',
      name: 'Realms Diamond',
      address: '0xB49281947c56159F674dE59bFca4B758ED6a7cFD',
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
