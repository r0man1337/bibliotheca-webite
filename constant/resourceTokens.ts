import { createTokenUtils } from '~/utils/create-token-utils'

export default {
  arbitrumRinkeby: createTokenUtils([
    {
      key: 'resourceTokens',
      type: 'erc1155',
      symbol: 'resourceTokens',
      name: 'Realms Resource Tokens',
      address: '0x5fAe6B0BE396B9541D5Cc8D50a98168b790d0d7e',
    },
  ]),
  localDevelopment: createTokenUtils([
    {
      key: 'resourceTokens',
      type: 'erc1155',
      symbol: 'resourceTokens',
      name: 'Realms Resource Tokens',
      address: '0x9fe46736679d2d9a65f0992f2272de9f3c7fa6e0',
    },
  ]),
}
