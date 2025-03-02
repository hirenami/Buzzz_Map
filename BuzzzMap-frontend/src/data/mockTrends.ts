import { TrendingKeyword } from '../types';

// Mock data for top 10 trending food and drink keywords in Japanese
export const mockTrendingKeywords: TrendingKeyword[] = [
  { 
    keyword: "抹茶ラテ", 
	location: "抹茶ラテ",
    rank: 1,  
    end_timestamp: Math.floor(Date.now() / 1000) - 86400, // 1日前
    increase_percentage: 85
  },
  { 
    keyword: "ビリアタコス", 
	location: "ビリアタコス",
    rank: 2, 
    end_timestamp: Math.floor(Date.now() / 1000) - 43200, // 12時間前
    increase_percentage: 120
  },
  { 
    keyword: "スマッシュバーガー", 
	location: "スマッシュバーガー",
    rank: 3, 
    end_timestamp: Math.floor(Date.now() / 1000) - 172800, // 2日前
    increase_percentage: 65
  },
  { 
    keyword: "タピオカミルクティー", 
	location: "タピオカミルクティー",
    rank: 4, 
    end_timestamp: Math.floor(Date.now() / 1000) - 7200, // 2時間前
    increase_percentage: 42
  },
  { 
    keyword: "ナッシュビルホットチキン", 
	location: "コンビニ",
    rank: 5, 
    end_timestamp: Math.floor(Date.now() / 1000) - 259200, // 3日前
    increase_percentage: 95
  },
  { 
    keyword: "サワードウブレッド", 
	location: "サワードウブレッド",
    rank: 6, 
    end_timestamp: Math.floor(Date.now() / 1000) - 14400, // 4時間前
    increase_percentage: 58
  },
  { 
    keyword: "オーツミルク", 
	location: "オーツミルク",
    rank: 7, 
    end_timestamp: Math.floor(Date.now() / 1000) - 3600, // 1時間前
    increase_percentage: 75
  },
  { 
    keyword: "韓国焼肉", 
	location: "韓国焼肉",
    rank: 8, 
    end_timestamp: Math.floor(Date.now() / 1000) - 129600, // 1.5日前
    increase_percentage: 48
  },
  { 
    keyword: "ナチュラルワイン", 
	location: "ナチュラルワイン",
    rank: 9, 
    end_timestamp: Math.floor(Date.now() / 1000) - 21600, // 6時間前
    increase_percentage: 62
  },
  { 
    keyword: "プラントベースバーガー", 
	location: "プラントベースバーガー",
    rank: 10, 
    end_timestamp: Math.floor(Date.now() / 1000) - 345600, // 4日前
    increase_percentage: 88
  }
];