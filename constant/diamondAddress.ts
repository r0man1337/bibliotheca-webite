import { createTokenUtils } from '~/utils/create-token-utils'

export default {
  arbitrumRinkeby: createTokenUtils([
    {
      key: 'realmsDiamond',
      type: 'diamond',
      symbol: 'realmsDiamond',
      name: 'Realms Diamond',
      address: '0xFBe0421c53706746151ACa2Cf22F81Dc41262519',
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
