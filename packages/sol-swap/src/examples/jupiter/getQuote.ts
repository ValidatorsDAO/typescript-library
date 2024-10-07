import getJupiterQuote from '@/lib/jupiter/getJupiterQuote'

const getQuote = async () => {
  const inputMint = 'inputMint'
  const outputMint = 'outputMint'
  const inputAmountLamport = 100
  const platformFeeBps = 0
  const swapMode = 'ExactIn'
  const quote = await getJupiterQuote(
    inputMint,
    outputMint,
    inputAmountLamport,
    platformFeeBps,
    swapMode,
  )
}
