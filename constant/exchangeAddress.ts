import { createTokenUtils } from '~/utils/create-token-utils'

export default {
  arbitrumRinkeby: createTokenUtils([
    {
      key: 'resourceExchange',
      type: 'exchange',
      symbol: 'resourceExchange',
      name: 'Resource Token Exchange',
      address: '0xB0176CD9225bE3977e28092585aE74A142c30c3E',
    },
  ]),
  localDevelopment: createTokenUtils([
    {
      key: 'resourceExchange',
      type: 'exchange',
      symbol: 'resourceExchange',
      name: 'Resource Token Exchange',
      address: '0x7a2088a1bFc9d81c55368AE168C2C02570cB814F',
    },
  ]),
}
