import { TrendingKeyword } from '../types';

// Mock data for top 10 trending food and drink keywords in Japanese
export const mockTrendingKeywords: TrendingKeyword[] = [
  { 
    keyword: "抹茶ラテ", 
    rank: 1, 
    description: "日本の緑茶と蒸した牛乳", 
    end_timestamp: Math.floor(Date.now() / 1000) - 86400, // 1日前
    increase_percentage: 85
  },
  { 
    keyword: "ビリアタコス", 
    rank: 2, 
    description: "コンソメで食べるメキシコの牛肉シチュータコス", 
    end_timestamp: Math.floor(Date.now() / 1000) - 43200, // 12時間前
    increase_percentage: 120
  },
  { 
    keyword: "スマッシュバーガー", 
    rank: 3, 
    description: "熱いグリドルで薄く潰したバーガーパティ", 
    end_timestamp: Math.floor(Date.now() / 1000) - 172800, // 2日前
    increase_percentage: 65
  },
  { 
    keyword: "タピオカミルクティー", 
    rank: 4, 
    description: "台湾発祥のもちもちタピオカ入りのお茶", 
    end_timestamp: Math.floor(Date.now() / 1000) - 7200, // 2時間前
    increase_percentage: 42
  },
  { 
    keyword: "ナッシュビルホットチキン", 
    rank: 5, 
    description: "ケイジャンペーストで味付けした辛いフライドチキン", 
    end_timestamp: Math.floor(Date.now() / 1000) - 259200, // 3日前
    increase_percentage: 95
  },
  { 
    keyword: "サワードウブレッド", 
    rank: 6, 
    description: "自然発酵させた職人パン", 
    end_timestamp: Math.floor(Date.now() / 1000) - 14400, // 4時間前
    increase_percentage: 58
  },
  { 
    keyword: "オーツミルク", 
    rank: 7, 
    description: "オーツ麦から作られた植物性ミルク", 
    end_timestamp: Math.floor(Date.now() / 1000) - 3600, // 1時間前
    increase_percentage: 75
  },
  { 
    keyword: "韓国焼肉", 
    rank: 8, 
    description: "韓国料理の焼肉", 
    end_timestamp: Math.floor(Date.now() / 1000) - 129600, // 1.5日前
    increase_percentage: 48
  },
  { 
    keyword: "ナチュラルワイン", 
    rank: 9, 
    description: "最小限の介入で作られたワイン", 
    end_timestamp: Math.floor(Date.now() / 1000) - 21600, // 6時間前
    increase_percentage: 62
  },
  { 
    keyword: "プラントベースバーガー", 
    rank: 10, 
    description: "植物由来の肉不使用バーガー", 
    end_timestamp: Math.floor(Date.now() / 1000) - 345600, // 4日前
    increase_percentage: 88
  }
];