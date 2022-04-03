export function formatUsd(value: number) {
  let str = value.toFixed(0)
  for(let i = str.length - 3; i > 0; i -= 3) {
    str = str.substring(0, i) + ',' + str.substring(i)
  }
  const decimals = (value % 1).toFixed(2).substring(2)
  return `$ ${str}.${decimals}`
}

export function formatPercent(value: number) {
  return `${(value * 100).toFixed(2)}%`
}

export function shortenAccountId(value: string) {
  if(value.length > 10) {
    return `${value.substring(0, 6)}...${value.substring(value.length - 4)}`
  }
  return value
}