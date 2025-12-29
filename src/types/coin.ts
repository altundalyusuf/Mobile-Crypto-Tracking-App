export interface Coin {
  uuid: string;
  symbol: string;
  name: string;
  iconUrl: string;
  price: string;
  change: string;
  marketCap: string;
  rank: number;
  "24hVolume": string;
  color?: string;
  sparkline?: string[];
}

export interface CoinsResponse {
  status: string;
  data: {
    stats: {
      total: number;
      totalCoins: number;
      totalMarkets: number;
      totalExchanges: number;
      totalMarketCap: string;
      total24hVolume: string;
    };
    coins: Coin[];
  };
}

export interface GetCoinsParams {
  limit?: number;
  offset?: number;
  orderBy?: string;
  search?: string;
  uuids?: string[];
}

export interface CoinHistoryPoint {
  price: string;
  timestamp: number;
}

export interface CoinHistoryResponse {
  status: string;
  data: {
    change: string;
    history: CoinHistoryPoint[];
  };
}

export interface GetCoinHistoryParams {
  uuid: string;
  timePeriod?: string;
}
