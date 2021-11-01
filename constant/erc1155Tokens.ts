import { createTokenUtils } from '~/utils/create-token-utils'

export default {
  arbitrumRinkeby: createTokenUtils([
    {
      key: 'realm-resources',
      type: 'erc1155',
      symbol: 'resourceTokens',
      name: 'Realms Resource Tokens',
      address: '0x1BeB505670cF846af44Fae915e8b218eDff2E16D',
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
