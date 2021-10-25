import { ethers } from 'ethers'
import { ref } from '@nuxtjs/composition-api'
import { allNetworks } from '~/constant/networks'

const locale = 'en-US'
export function useFormatting() {
  function shortenHash(hash: any, size = 4) {
    if (!hash) return

    if (hash.length < 12) return hash

    const beginningChars = hash.startsWith('0x') ? size + 2 : size

    const shortened = hash.substr(0, beginningChars) + '…' + hash.substr(-size)

    return shortened
  }

  function toLocaleString(value: any) {
    return value.toLocaleString(locale)
  }

  function formatMillisecondsShort(milliseconds: any) {
    if (!milliseconds) return ''
    const ms = Number(milliseconds) || 0

    const timeInSeconds = ms / 1000
    const hours = Math.floor((timeInSeconds % (3600 * 24)) / 3600)
    const minutes = Math.floor((timeInSeconds % 3600) / 60)
    const seconds = Math.floor(timeInSeconds - hours * 3600 - minutes * 60)

    const mDisplay = String(minutes).padStart(2, '0')
    const sDisplay = String(seconds).padStart(2, '0')

    return `${mDisplay}:${sDisplay}`
  }
  const ensName = ref()
  const returnEns = async (value: any) => {
    const provider = new ethers.providers.JsonRpcProvider(allNetworks[0].url)
    try {
      ensName.value = await provider.lookupAddress(value)
    } catch (e) {
      console.log(e)
    }
  }

  return {
    shortenHash,
    toLocaleString,
    formatMillisecondsShort,
    returnEns,
    ensName,
  }
}
