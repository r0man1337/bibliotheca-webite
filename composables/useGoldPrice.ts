import { ref } from '@nuxtjs/composition-api'
import axios from 'axios'
const goldPrice = ref(null)

const usePrice = () => {
  const getGoldPrice = async () => {
    const price = await axios.get(
      'https://api.coingecko.com/api/v3/simple/price?ids=adventure-gold&vs_currencies=USD'
    )
    goldPrice.value = price.data['adventure-gold'].usd
  }

  return {
    goldPrice,
    getGoldPrice,
  }
}

export default usePrice
