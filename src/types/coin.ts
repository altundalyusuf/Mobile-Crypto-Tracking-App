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
  orderBy?: string; // e.g., "price", "marketCap", "24hVolume", "change"
}

