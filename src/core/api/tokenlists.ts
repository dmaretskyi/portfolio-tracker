export async function fetchTokenList(): Promise<TokenList> {
  const res = await fetch('https://wispy-bird-88a7.uniswap.workers.dev/?url=http://tokens.1inch.eth.link')
  return res.json()
}

export interface TokenList {
  name: string
  timestamp: string
  tokens: {
    "chainId": number,
    "address": string
    "symbol": string
    "name": string
    "decimals": number
    logoURI: string
  }[]
}