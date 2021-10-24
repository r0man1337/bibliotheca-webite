import { createTokenUtils } from '~/utils/create-token-utils'

export default {
  localDevelopment: createTokenUtils([
    {
      key: 'resourceExchange',
      type: 'exchange',
      symbol: 'resourceExchange',
      name: 'Resource Token Exchange',
      address: '0xc3e53F4d16Ae77Db1c982e75a937B9f60FE63690',
    },
  ]),
}
