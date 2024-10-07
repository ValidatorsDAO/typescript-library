import { readFile } from 'fs/promises'
import { Connection, Keypair, VersionedTransaction } from '@solana/web3.js'
import getJupiterQuote, { JupiterSwapMode } from '@/lib/jupiter/getJupiterQuote'
import postJupiterSwap from '@/lib/jupiter/postJupiterSwap'
import 'dotenv/config'

const SOLANA_RPC_URL = process.env.SOLANA_RPC_URL || 'http://localhost:8899'
const KEY_FILE_PATH =
  process.env.KEY_FILE_PATH || '/home/solv/mainnet-validator-keypair.json'

const jupiterSwap = async (
  inputMint: string,
  outputMint: string,
  inputAmountLamport: number,
  platformFeeBps = 0,
  swapMode = 'ExactIn' as JupiterSwapMode,
  maxRetries = 3,
) => {
  try {
    const connection = new Connection(SOLANA_RPC_URL, 'confirmed')
    const quoteResponse = await getJupiterQuote(
      inputMint,
      outputMint,
      inputAmountLamport,
      platformFeeBps,
      swapMode,
    )

    if (typeof quoteResponse === 'string') {
      return quoteResponse
    }

    const fromWalletKey = JSON.parse(
      await readFile(KEY_FILE_PATH, 'utf8'),
    ) as number[]
    const fromWallet = Keypair.fromSecretKey(
      new Uint8Array(Array.from(fromWalletKey)),
    )

    const swapResponse = await postJupiterSwap(
      quoteResponse,
      fromWallet.publicKey.toString(),
    )
    if (typeof swapResponse === 'string') {
      return swapResponse
    }

    const swapTransactionBuf = Buffer.from(
      swapResponse.swapTransaction as string,
      'base64',
    )
    let transaction = VersionedTransaction.deserialize(swapTransactionBuf)
    // Sign transaction
    transaction.sign([fromWallet])
    const rawTransaction = transaction.serialize()
    const txid = await connection.sendRawTransaction(rawTransaction, {
      skipPreflight: true,
      maxRetries,
    })
    const blockhash = transaction.message.recentBlockhash
    await connection.confirmTransaction(
      {
        blockhash,
        lastValidBlockHeight: swapResponse.lastValidBlockHeight,
        signature: txid,
      },
      'confirmed',
    )
    console.log(`✔︎ Transaction Send
Check Your TX 👉 https://solscan.io/tx/${txid}`)
    return txid
  } catch (error) {
    throw new Error(`Error jupiterSwap: ${error}`)
  }
}

export default jupiterSwap
