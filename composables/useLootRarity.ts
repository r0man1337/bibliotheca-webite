import itemsRarity from './item-rarity-hashes.json'
import type { ColorFn, RarityLevel } from './types'
import { hashItem } from './hash-item'
import rarityLevels from './rarity-levels'

let cachedItemsrarity = null

export function useLootRarity() {
  function itemRarity(itemName: string): RarityLevel {
    if (!cachedItemsrarity) {
      cachedItemsrarity = itemsRarity.map(
        (items: string) => new Set(items.match(/.{1,5}/g))
      )
    }

    const hash = hashItem(itemName)

    let index = 5
    while (index--) {
      if (cachedItemsrarity[index].has(hash)) {
        return (index + 2) as RarityLevel
      }
    }
    return 1
  }

  function rarityColor(
    itemOrRarity: string | RarityLevel,
    { colorFn }: { colorFn?: ColorFn } = {}
  ): string {
    const itemName = typeof itemOrRarity === 'string' ? itemOrRarity : null
    const level = itemName
      ? itemRarity(itemName)
      : (itemOrRarity as RarityLevel)

    const color = rarityLevels[level - 1][2]
    if (!color) {
      throw new Error(`Incorrect rarity level or item: ${itemOrRarity}`)
    }
    return (colorFn?.({ color, itemName, level }) || color) as string
  }
  return {
    rarityColor,
  }
}
