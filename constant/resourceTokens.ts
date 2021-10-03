import { createTokenUtils } from '~/utils/create-token-utils'

export default {
  arbitrumRinkeby: createTokenUtils([
    {
      key: 'resourceTokens',
      type: 'erc1155',
      symbol: 'resourceTokens',
      name: 'Realms Resource Tokens',
      address: '0x45eB443aa016422Ab25903205ABBF809CF06455e',
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
