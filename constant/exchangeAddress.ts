import { createTokenUtils } from '~/utils/create-token-utils'

export default {
  localDevelopment: createTokenUtils([
    {
      key: 'resourceExchange',
      type: 'exchange',
      symbol: 'resourceExchange',
      name: 'Resource Token Exchange',
      address: '0xc6e7DF5E7b4f2A278906862b61205850344D4e7d',
    },
  ]),
}
