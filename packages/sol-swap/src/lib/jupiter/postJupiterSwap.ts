import type { QuoteResponse, SwapResponse } from '@jup-ag/api'
import 'dotenv/config'

const JUPITER_ENDPOINT = process.env.JUPITER_ENDPOINT || 'http://localhost:2000'

const postJupiterSwap = async (
  quoteResponse: QuoteResponse,
  fromWalletPubkey: string,
) => {
  try {
    const swapBody = {
      swapRequest: {
        quoteResponse,
        userPublicKey: fromWalletPubkey,
      },
    }

    const url = `${JUPITER_ENDPOINT}/swap`
    const result = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(swapBody.swapRequest),
    })
    if (result.status === 429) {
      const error = 'Too many requests, please try again later'
      return error
    }
    const json = (await result.json()) as SwapResponse
    return json
  } catch (error) {
    throw new Error(`Error postJupiterSwap: ${error}`)
  }
}

export default postJupiterSwap
