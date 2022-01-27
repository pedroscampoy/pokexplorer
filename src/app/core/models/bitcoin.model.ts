export interface ICoin {
  '24h_vol': string,
  date: string,
  market_cap: string,
  price_usd: string,
}

export class Coin implements ICoin {
  '24h_vol': string;
  date: string;
  market_cap: string;
  price_usd: string;

  constructor(obj: Coin) {
    this['24h_vol'] = obj['24h_vol'];
    this.date = obj.date;
    this.market_cap = obj.market_cap;
    this.price_usd = obj.price_usd;
  }
}

export type FilteredCoins = {
  [key: string]: Array<ICoin>
}
