import { createTokenUtils } from '~/utils/create-token-utils'

export default {
  arbitrumRinkeby: createTokenUtils([
    {
      key: 'realmsDiamond',
      type: 'diamond',
      symbol: 'realmsDiamond',
      name: 'Realms Diamond',
      address: '0xA642375Cc15249A81da9c435fB4eDD8A9343ce7F',
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
