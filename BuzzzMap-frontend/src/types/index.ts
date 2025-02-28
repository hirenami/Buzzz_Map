export interface TrendingKeyword {
  keyword: string;
  rank: number;
  description?: string;
  end_timestamp?: number;
  increase_percentage?: number;
}

export interface Restaurant {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  rating: number;
  priceLevel: number;
  trendKeyword: string;
  photoUrl?: string;
  description?: string;
  isRealData?: boolean;
  isMockData?: boolean;
}

export interface MapOptions {
  center: {
    lat: number;
    lng: number;
  };
  zoom: number;
}

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  source: string;
  date: string;
  imageUrl: string;
  url: string;
  keyword: string;
}