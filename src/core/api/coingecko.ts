import { cache } from "../cache";

export class CoingeckoApi {
  @cache()
  async getExchange(id: string): Promise<CoingeckoExchange> {
    const response = await fetch(`https://api.coingecko.com/api/v3/exchanges/${id}`);
    const exchange: CoingeckoExchange = await response.json();
  
    for(let page = 1; page <= 100; page++) {
      const response = await fetch(`https://api.coingecko.com/api/v3/exchanges/${id}/tickers?page=${page}`);
      const data = await response.json();
      exchange.tickers.push(...data.tickers);
      if(data.tickers.length === 0) {
        break;
      }
    }
  
    return exchange;
  }

  @cache({ expiry: 1000 * 60 * 60 })
  async getMarketData(): Promise<MarketData[]> {
    const result: MarketData[] = []

    for(let page = 1; page <= 10; page++) {
      const response = await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=${page}&sparkline=false`);
      const data: MarketData[] = await response.json();
      result.push(...data);
      if(data.length === 0) {
        break;
      }
    }

    return result;
  }

  @cache({ expiry: 1000 * 60 * 60 })
  async getPrices(ticker: string, days: number): Promise<PriceData> {
    const response = await fetch(`https://api.coingecko.com/api/v3/coins/${ticker}/market_chart?vs_currency=usd&days=${days}`);
    const data: PriceData = await response.json();
    return data;
  }
}


export type CoingeckoCurrency =
  | 'aed'
  | 'ars'
  | 'aud'
  | 'bch'
  | 'bdt'
  | 'bhd'
  | 'bmd'
  | 'bnb'
  | 'brl'
  | 'btc'
  | 'cad'
  | 'chf'
  | 'clp'
  | 'cny'
  | 'czk'
  | 'dkk'
  | 'eos'
  | 'eth'
  | 'eur'
  | 'gbp'
  | 'hkd'
  | 'huf'
  | 'idr'
  | 'ils'
  | 'inr'
  | 'jpy'
  | 'krw'
  | 'kwd'
  | 'lkr'
  | 'ltc'
  | 'mmk'
  | 'mxn'
  | 'myr'
  | 'ngn'
  | 'nok'
  | 'nzd'
  | 'php'
  | 'pkr'
  | 'pln'
  | 'rub'
  | 'sar'
  | 'sek'
  | 'sgd'
  | 'thb'
  | 'try'
  | 'twd'
  | 'uah'
  | 'usd'
  | 'vef'
  | 'vnd'
  | 'xag'
  | 'xau'
  | 'xdr'
  | 'xlm'
  | 'xrp'
  | 'zar'
  | 'bits'
  | 'link'
  | 'sats';

export interface CoingeckoCoinShort {
  id: string;
  symbol: string;
  name: string;
  platforms: Record<string, string>
}

export async function getCoins(): Promise<CoingeckoCoinShort[]> {
  const response = await fetch(`https://api.coingecko.com/api/v3/coins/list?include_platform=true`);
  return response.json();
}

export interface CoingeckoCoin {
  id: string;
  symbol: string;
  name: string;
  block_time_in_minutes: number;
  hashing_algorithm: string;
  categories: string[];
  localization: object;
  description: object;
  links: object;
  image: {
      thumb: string;
      small: string;
  };
  country_origin: string;
  genesis_date: string;
  sentiment_votes_up_percentage: number;
  sentiment_votes_down_percentage: number;
  market_cap_rank: number;
  coingecko_rank: number;
  coingecko_score: number;
  developer_score: number;
  community_score: number;
  liquidity_score: number;
  public_interest_score: number;
  market_data: {
      current_price: Record<CoingeckoCurrency & string, number>;
      market_cap: Record<CoingeckoCurrency & string, number>;
      total_volume: Record<CoingeckoCurrency & string, number>;
      fully_diluted_valuation: Record<CoingeckoCurrency & string, number>;
      total_value_locked: {
          btc: number
          usd: number
      }
      fdv_to_tvl_ratio: number
      mcap_to_tvl_ratio: number
      circulating_supply: number
      total_supply: number
      max_supply: number
  };
  community_data: {
      facebook_likes: null | number;
      twitter_followers: number;
      reddit_average_posts_48h: number;
      reddit_average_comments_48h: number;
      reddit_subscribers: number;
      reddit_accounts_active_48h: string;
  };
  developer_data: {
      forks: number;
      stars: number;
      subscribers: number;
      total_issues: number;
      closed_issues: number;
      pull_requests_merged: number;
      pull_request_contributors: number;
      code_additions_deletions_4_weeks: { additions: number; deletions: number };
      commit_count_4_weeks: number;
  };
  public_interest_stats: { alexa_rank: number; bing_matches: null };
  last_updated: string;
  tickers: CoinsFetchDataTicker[];
}

export type TrustScore = 'green' | 'yellow' | 'red';

export interface CoinsFetchDataTicker {
  base: string;
  target: string;
  market: {
      name: string;
      identifier: string;
      has_trading_incentive: boolean
  };
  last: number;
  volume: number;
  converted_last: {
      btc: number;
      eth: number;
      usd: number;
  };
  converted_volume: {
      btc: number;
      eth: number;
      usd: number;
  };
  trust_score: TrustScore;
  bid_ask_spread_percentage: number;
  timestamp: Date;
  last_traded_at: Date;
  last_fetch_at: Date;
  is_anomaly: boolean;
  is_stale: boolean;
  trade_url: string | null;
  token_info_url: string | null;
  coin_id: string;
  target_coin_id: string;
}

export async function getCoin(id: string): Promise<CoingeckoCoin> {
  const response = await fetch(`https://api.coingecko.com/api/v3/coins/${id}?localization=false&sparkline=false`);
  return response.json();
}

interface ExchangeTicker {
  base: string;
  target: string;
  coin_id: string;
  target_coin_id?: string;
};

export interface CoingeckoExchange {
  name: string
  tickers: ExchangeTicker[]
  // ...more fields
}

export interface MarketData {
  id: string
  symbol: string
  name: string
  image: string
  current_price: number
}

export interface PriceData {
  prices: [timestamp: number, price: number][],
  market_caps: [timestamp: number, price: number][],
  total_volumes: [timestamp: number, price: number][],
}