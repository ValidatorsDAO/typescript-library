import type { QuoteResponse } from '@jup-ag/api'
import 'dotenv/config'
export type JupiterSwapMode = 'ExactIn' | 'ExactOut'

const JUPITER_ENDPOINT = process.env.JUPITER_ENDPOINT || 'http://localhost:2000'

const getJupiterQuote = async (
  inputMint: string,
  outputMint: string,
  inputAmountLamport: number,
  platformFeeBps = 0,
  swapMode = 'ExactIn' as JupiterSwapMode,
) => {
  try {
    const url = `${JUPITER_ENDPOINT}/quote?inputMint=${inputMint}&outputMint=${outputMint}&amount=${inputAmountLamport}&mode=${swapMode}&platformFeeBps=${platformFeeBps}`
    const result = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    if (result.status === 429) {
      const error = 'Too many requests, please try again later'
      return error
    }
    if (result.status === 401) {
      const error = 'Unauthorized, please check your API key'
      return error
    }

    const json = (await result.json()) as QuoteResponse
    return json
  } catch (error) {
    throw new Error(`Error getJupiterQuote: ${error}`)
  }
}

export default getJupiterQuote
