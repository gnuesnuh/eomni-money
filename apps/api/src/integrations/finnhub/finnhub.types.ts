// https://finnhub.io/docs/api 에서 응답 형태만 옮긴 타입

export interface FinnhubQuote {
  c: number; // current price
  d: number; // change
  dp: number; // percent change
  h: number; // high (today)
  l: number; // low (today)
  o: number; // open
  pc: number; // previous close
  t: number; // unix timestamp (sec)
}

export interface FinnhubCompanyNews {
  category: string;
  datetime: number; // unix sec
  headline: string;
  id: number;
  image: string;
  related: string;
  source: string;
  summary: string;
  url: string;
}

export interface FinnhubNewsSentiment {
  buzz: {
    articlesInLastWeek: number;
    buzz: number;
    weeklyAverage: number;
  };
  companyNewsScore: number;
  sectorAverageBullishPercent: number;
  sectorAverageNewsScore: number;
  sentiment: {
    bearishPercent: number;
    bullishPercent: number;
  };
  symbol: string;
}
