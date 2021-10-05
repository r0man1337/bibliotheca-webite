import { createTokenUtils } from '~/utils/create-token-utils'

export default {
  arbitrumRinkeby: createTokenUtils([
    {
      key: 'realmsDiamond',
      type: 'diamond',
      symbol: 'realmsDiamond',
      name: 'Realms Diamond',
      address: '0xc14D994fe7C5858c93936cc3bD42bb9467d6fB2C',
    },
  ]),
  localDevelopment: createTokenUtils([
    {
      key: 'realmsDiamond',
      type: 'diamond',
      symbol: 'realmsDiamond',
      name: 'Realms Diamond',
      address: '0x4e59b44847b379578588920ca78fbf26c0b4956c',
    },
  ]),
}
