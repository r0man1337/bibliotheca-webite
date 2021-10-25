import { BigNumber } from '@ethersproject/bignumber'
import { defaultAbiCoder } from '@ethersproject/abi'

export const methodsSignature = {
  BUYTOKENS: '0xb2d81047',
  SELLTOKENS: '0xdb08ec97',
  ADDLIQUIDITY: '0x82da2b73',
  REMOVELIQUIDITY: '0x5c0bf259',
}

export const BuyTokensType = `tuple(
    address recipient,
    uint256[] tokensBoughtIDs,
    uint256[] tokensBoughtAmounts,
    uint256 deadline
  )`

export const SellTokensType = `tuple(
    address recipient,
    uint256 minBaseTokens,
    uint256 deadline
  )`

export const AddLiquidityType = `tuple(
    uint256[] maxBaseTokens,
    uint256 deadline
  )`

export const RemoveLiquidityType = `tuple(
    uint256[] minBaseTokens,
    uint256[] minTokens,
    uint256 deadline
  )`

export const getBuyTokenData = (
  recipient: string,
  types: number[] | BigNumber[],
  tokensAmountsToBuy: BigNumber[],
  deadline: number
) => {
  const buyTokenObj = {
    recipient,
    tokensBoughtIDs: types,
    tokensBoughtAmounts: tokensAmountsToBuy,
    deadline,
  }

  return defaultAbiCoder.encode(
    ['bytes4', BuyTokensType],
    [methodsSignature.BUYTOKENS, buyTokenObj]
  )
}

export const getSellTokenData = (
  recipient: string,
  cost: BigNumber,
  deadline: number
) => {
  const sellTokenObj = {
    recipient,
    minBaseTokens: cost,
    deadline,
  }

  return defaultAbiCoder.encode(
    ['bytes4', SellTokensType],
    [methodsSignature.SELLTOKENS, sellTokenObj]
  )
}

export const getAddLiquidityData = (
  baseAmountsToAdd: BigNumber[],
  deadline: number
) => {
  const addLiquidityObj = {
    maxBaseTokens: baseAmountsToAdd,
    deadline: deadline,
  }

  return defaultAbiCoder.encode(
    ['bytes4', AddLiquidityType],
    [methodsSignature.ADDLIQUIDITY, addLiquidityObj]
  )
}

export const getRemoveLiquidityData = (
  minBaseTokens: BigNumber[],
  minTokens: BigNumber[],
  deadline: number
) => {
  const removeLiquidityObj = {
    minBaseTokens: minBaseTokens,
    minTokens: minTokens,
    deadline: deadline,
  }

  return defaultAbiCoder.encode(
    ['bytes4', RemoveLiquidityType],
    [methodsSignature.REMOVELIQUIDITY, removeLiquidityObj]
  )
}
