import getJupiterQuote from '@/lib/jupiter/getJupiterQuote'
import jupiterSwap from '@/lib/jupiter/jupiterSwap'

const getQuote = async () => {
  const inputMint = 'inputMint'
  const outputMint = 'outputMint'
  const inputAmountLamport = 1000000000
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
