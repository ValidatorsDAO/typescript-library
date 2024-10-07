import getJupiterQuote from '@/lib/jupiter/getJupiterQuote'
import jupiterSwap from '@/lib/jupiter/jupiterSwap'

const getQuote = async () => {
  const inputMint = 'So11111111111111111111111111111111111111112' // SOL
  const outputMint = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v' // USDC
  const inputAmountLamport = 0.01 * 10 ** 9 // 0.01 SOL
  const quote = await getJupiterQuote(inputMint, outputMint, inputAmountLamport)
  if (typeof quote === 'string') {
    throw new Error(quote)
  }
  await jupiterSwap(quote)
}

const run = async () => {
  await getQuote()
}

run()
