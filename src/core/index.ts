import { CoingeckoApi, CoingeckoCoin, CoingeckoExchange, getCoin, getCoins, MarketData } from "./api/coingecko";
import { getEtherBalance, getTransferEvents } from "./api/ethereum";
import { fetchFtxBalances } from "./api/ftx";
import { fetchTokenList, TokenList } from "./api/tokenlists";

const coingecko = new CoingeckoApi();

export interface AccountData {
  tokenId?: string;
  /** exchange-specific ticker */
  ticker: string;
  platformId: string;
  accountId: string;
  balance: number;
}

export interface PortfolioData {
  totalValue: number;
  assets: AssetData[];
  unrecognized: AccountData[];
  history: PortfolioHistoryPoint[];
}

export interface AssetHistoryPoint {
  timestamp: number;
  price: number;
  balance: number;
  value: number;
}

export interface PortfolioHistoryPoint {
  timestamp: number;
  totalValue: number;
}

export interface AssetData {
  tokenId: string;
  name: string;
  ticker: string;
  balance: number;
  value: number;
  price: number;
  allocation: number;
  accounts: AccountData[]
  logoURI: string;
  history: AssetHistoryPoint[];
}

function getTickerMapping(exchange: CoingeckoExchange): Record<string, string> {
  return exchange.tickers.reduce((acc, ticker) => {
    acc[ticker.base] = ticker.coin_id;
    if (ticker.target_coin_id) {
      acc[ticker.target] = ticker.target_coin_id;
    }
    return acc;
  }, {} as Record<string, string>)
}


async function getFtxAssets(account: URL): Promise<AccountData[]> {
  const accountId = account.pathname;
  const secret = account.searchParams.get('secret');
  if (!secret) {
    console.warn('Missing secret for FTX account');
    return [];
  }

  const tickerMapping = getTickerMapping(await coingecko.getExchange('ftx_spot'))

  const ftx = await fetchFtxBalances(accountId, secret);

  return ftx.result
    .map((entry): AccountData => ({
      tokenId: tickerMapping[entry.coin],
      ticker: entry.coin,
      platformId: 'exchange:ftx_spot',
      accountId: accountId,
      balance: entry.total,
    }))
}

async function getEthereumAssets(account: URL): Promise<AccountData[]> {
  const etherBalance = await getEtherBalance(account.pathname);

  return [{
    tokenId: 'ethereum',
    ticker: 'ETH',
    platformId: 'chainId:1',
    accountId: account.pathname,
    balance: etherBalance,
  }]
}

function aggregateAssets(accounts: AccountData[], markets: MarketData[]): PortfolioData {
  const assets = new Map<string, AssetData>();
  const unrecognized: AccountData[] = [];

  for (const account of accounts) {
    if (!account.tokenId) {
      unrecognized.push(account);
      continue;
    }
    if (!assets.has(account.tokenId)) {
      const market = markets.find(m => m.id === account.tokenId)
      if (!market) {
        console.warn(`No market data for ${account.tokenId}`)
        continue;
      }
      assets.set(account.tokenId, {
        tokenId: account.tokenId,
        name: market.name,
        logoURI: market.image,
        ticker: account.ticker,
        balance: account.balance,
        price: market.current_price,
        value: 0,
        allocation: 0,
        accounts: [],
        history: []
      });
    }

    const asset = assets.get(account.tokenId)!;
    asset.accounts.push(account);
    asset.balance += account.balance;
  }

  const assetsArray = Array.from(assets.values());

  const totalValue = assetsArray.reduce((acc, asset) => acc + asset.balance * asset.price, 0);
  for (const asset of assetsArray) {
    asset.value = asset.balance * asset.price;
    asset.allocation = asset.value / totalValue;
  }

  return {
    totalValue,
    assets: assetsArray.sort((a, b) => b.value - a.value),
    unrecognized,
    history: [],
  }
}

async function queryAccountBalances(account: string): Promise<AccountData[]> {
  const uri = new URL(account);
  switch (uri.protocol) {
    case 'ethereum:': return getEthereumAssets(uri);
    case 'ftx:': return getFtxAssets(uri);
    default: {
      console.warn('Unrecognized account type:', uri.protocol);
      return [];
    }
  }
}

async function addHistoricalPrices(portfolio: PortfolioData) {
  await Promise.all(portfolio.assets.map(async asset => {
    const priceHistory = await coingecko.getPrices(asset.tokenId, 500);
    asset.history = priceHistory.prices.map(([timestamp, price]) => ({
      timestamp,
      price,
      balance: asset.balance,
      value: asset.balance * price,
    }));
  }));
}

const minIdx = <T>(arr: T[], fn: (item: T, idx: number) => number): number => {
  let minIdx = 0;
  let min = fn(arr[0], 0);
  for (let i = 1; i < arr.length; i++) {
    const val = fn(arr[i], i);
    if (val < min) {
      min = val;
      minIdx = i;
    }
  }
  return minIdx;
}

const sum = (arr: number[]) => arr.reduce((acc, val) => acc + val, 0);

function aggregateHistory(histories: AssetHistoryPoint[][]): PortfolioHistoryPoint[] {
  let cursors = histories.map(() => 0);
  const result: PortfolioHistoryPoint[] = [];
  while (cursors.some((cursor, idx) => cursor < histories[idx].length)) {
    const next = minIdx(cursors, (cursor, idx) => histories[idx][cursor]?.timestamp ?? Infinity);

    const timestamp = histories[next][cursors[next]].timestamp;
    for(let i = 0; i < cursors.length; i++) {
      if(histories[i][cursors[i]]?.timestamp === timestamp) {
        cursors[i]++;
      }
    }
    result.push({
      timestamp,
      totalValue: sum(cursors.map((cursor, idx) => histories[idx][Math.max(cursor - 1, 0)]?.value ?? 0)),
    })
  }

  return result;
}
    
export async function queryData(accounts: string[]) {
  const assets = (await Promise.all(accounts.map(account => queryAccountBalances(account)))).flat().filter(a => a.balance > 0);

  const marketData = await coingecko.getMarketData();

  const aggregate = await aggregateAssets(assets, marketData);
  await addHistoricalPrices(aggregate);
  aggregate.history = aggregateHistory(aggregate.assets.map(a => a.history));

  return aggregate;
}