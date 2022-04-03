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
}

function getTickerMapping(exchange: CoingeckoExchange): Record<string, string> {
  return exchange.tickers.reduce((acc, ticker) => {
    acc[ticker.base] = ticker.coin_id;
    if(ticker.target_coin_id) {
      acc[ticker.target] = ticker.target_coin_id;
    }
    return acc;
  }, {} as Record<string, string>)
}


async function getFtxAssets(account: URL): Promise<AccountData[]> {
  const accountId = account.pathname;
  const secret = account.searchParams.get('secret');
  if(!secret) {
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

  for(const account of accounts) {
    if(!account.tokenId) {
      unrecognized.push(account);
      continue;
    }
    if(!assets.has(account.tokenId)) {
      const market = markets.find(m => m.id === account.tokenId)
      if(!market) {
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
      });
    }

    const asset = assets.get(account.tokenId)!;
    asset.accounts.push(account);
    asset.balance += account.balance;
  }

  const assetsArray = Array.from(assets.values());

  const totalValue = assetsArray.reduce((acc, asset) => acc + asset.balance * asset.price, 0);
  for(const asset of assetsArray) {
    asset.value = asset.balance * asset.price;
    asset.allocation = asset.value / totalValue;
  }

  return {
    totalValue,
    assets: assetsArray.sort((a, b) => b.value - a.value),
    unrecognized,
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

export async function queryData(accounts: string[]) {
  const assets = (await Promise.all(accounts.map(account => queryAccountBalances(account)))).flat().filter(a => a.balance > 0);

  const marketData = await coingecko.getMarketData();

  return aggregateAssets(assets, marketData);
}