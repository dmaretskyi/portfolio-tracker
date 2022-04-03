async function ftxFetch(path: string, key: string, secret: string): Promise<any> {
  const ts = Date.now()
  const method = 'GET'

  const signingKey = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
  const signature = await crypto.subtle.sign('HMAC', signingKey, new TextEncoder().encode(`${ts}${method}${path}`));

  const proxy = 'https://thingproxy.freeboard.io/fetch/'
  
  const res = await fetch(`${proxy}https://ftx.com${path}`, {
    headers: {
      'FTX-KEY': key,
      'FTX-TS': ts.toString(),
      'FTX-SIGN': toHex(signature),
    }
  })
  return res.json();
}

export interface FtxBalances {
  success: boolean,
  result: {
    coin: string,
    availableWithoutBorrow: number,
    free: number,
    spotBorrow: number,
    total: number,
    usdValue: number,
  }[]
}

export async function fetchFtxBalances(key: string, secret: string): Promise<FtxBalances>  {
  return ftxFetch('/api/wallet/balances', key, secret)
}

function toHex(buffer: ArrayBuffer) {
  return [...new Uint8Array(buffer)]
      .map(x => x.toString(16).padStart(2, '0'))
      .join('');
}
