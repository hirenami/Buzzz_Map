import { NewsArticle } from '../types';

// Mock news articles for each trending keyword
export const mockArticles: Record<string, NewsArticle[]> = {
  '抹茶ラテ': [
    {
      id: 'matcha-1',
      title: '抹茶ラテブームが再燃、若者を中心に人気急上昇',
      summary: '伝統的な日本の抹茶を使用したラテが、SNSでの投稿をきっかけに再び人気を集めています。特に20代を中心に、抹茶の健康効果と独特の風味が評価され、カフェチェーンでも新メニューが続々登場しています。',
      source: '食品トレンド週報',
      date: '2025年4月15日',
      imageUrl: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
      url: '#',
      keyword: '抹茶ラテ'
    },
    {
      id: 'matcha-2',
      title: '抹茶ラテの作り方：プロが教える完璧なレシピ',
      summary: '本格的な抹茶ラテを自宅で楽しむための秘訣を、有名バリスタが伝授。茶筅の使い方から、最適な温度、牛乳の選び方まで、プロ級の抹茶ラテを作るためのステップバイステップガイドです。',
      source: 'バリスタマガジン',
      date: '2025年3月28日',
      imageUrl: 'https://images.unsplash.com/photo-1545518514-ce8448f54c0f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80',
      url: '#',
      keyword: '抹茶ラテ'
    }
  ],
  'ビリアタコス': [
    {
      id: 'birria-1',
      title: 'ビリアタコスが日本の食シーンを席巻、行列店が続出',
      summary: 'メキシコ発祥のビリアタコスが日本の食文化に新たな風を吹き込んでいます。SNSで話題となった赤いスープにディップして食べるタコスは、東京を中心に専門店が急増。週末には2時間待ちの行列ができる人気店も。',
      source: 'グルメナビ',
      date: '2025年4月10日',
      imageUrl: 'https://images.unsplash.com/photo-1628491300361-c8ff9b17f9a7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
      url: '#',
      keyword: 'ビリアタコス'
    },
    {
      id: 'birria-2',
      title: 'ビリアタコスの本場メキシコ人シェフが語る「日本での驚きの人気」',
      summary: '本場ハリスコ州出身のシェフが、日本でのビリアタコスブームについて語ります。「日本人の味覚に合うように少し調整しましたが、基本的な調理法は変えていません。この人気は想像以上です」と驚きを隠せない様子。',
      source: 'フードカルチャーマガジン',
      date: '2025年3月22日',
      imageUrl: 'https://images.unsplash.com/photo-1619216083420-6e54b1f0769c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80',
      url: '#',
      keyword: 'ビリアタコス'
    }
  ],
  'スマッシュバーガー': [
    {
      id: 'smash-1',
      title: 'スマッシュバーガー専門店が全国展開へ、独自の調理法が人気の秘密',
      summary: 'パティを高温のグリドルで薄く潰して焼く「スマッシュバーガー」専門店が、東京から大阪、福岡へと全国展開を加速。外はカリカリ、中はジューシーという独特の食感が日本人の舌を虜にしています。',
      source: 'ビジネスフードジャーナル',
      date: '2025年4月12日',
      imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1299&q=80',
      url: '#',
      keyword: 'スマッシュバーガー'
    },
    {
      id: 'smash-2',
      title: 'スマッシュバーガーの科学：なぜこんなに美味しいのか',
      summary: '食品科学者が解説する「スマッシュバーガー」の美味しさの秘密。高温で薄く潰すことによるメイラード反応の促進と、肉汁を閉じ込める調理タイミングの重要性について詳しく分析しています。',
      source: 'フードサイエンスマガジン',
      date: '2025年3月30日',
      imageUrl: 'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1115&q=80',
      url: '#',
      keyword: 'スマッシュバーガー'
    }
  ],
  'タピオカミルクティー': [
    {
      id: 'boba-1',
      title: 'タピオカミルクティーが進化、新食感と健康志向で再ブーム',
      summary: '一時のブームから定着したタピオカミルクティーが、新たな進化を遂げています。低糖質タピオカや有機茶葉の使用など健康志向の高まりに応え、さらにポッピングボバなど新食感の追求で、再び注目を集めています。',
      source: 'トレンドビバレッジ',
      date: '2025年4月8日',
      imageUrl: 'https://images.unsplash.com/photo-1558857563-c0c3aa058223?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80',
      url: '#',
      keyword: 'タピオカミルクティー'
    },
    {
      id: 'boba-2',
      title: 'タピオカミルクティーの消費量、若年層で過去最高を記録',
      summary: '市場調査によると、10代後半から20代のタピオカミルクティー消費量が過去最高を記録。特に注目すべきは、以前のブーム時と比較して「定期的に飲む」という回答が増加しており、一過性のトレンドではなく定着していることを示しています。',
      source: '飲料市場レポート',
      date: '2025年3月25日',
      imageUrl: 'https://images.unsplash.com/photo-1581849971860-3f8795d586c0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80',
      url: '#',
      keyword: 'タピオカミルクティー'
    }
  ],
  'ナッシュビルホットチキン': [
    {
      id: 'nashville-1',
      title: 'ナッシュビルホットチキン、日本で辛さレベル競争が激化',
      summary: '米国テネシー州発祥の「ナッシュビルホットチキン」が日本で人気を博し、各店舗で辛さのレベル競争が激化しています。最も辛いレベルに挑戦する「スパイシーチャレンジ」がSNSで話題となり、若者を中心に人気を集めています。',
      source: 'スパイスフードジャーナル',
      date: '2025年4月5日',
      imageUrl: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
      url: '#',
      keyword: 'ナッシュビルホットチキン'
    },
    {
      id: 'nashville-2',
      title: 'ナッシュビルホットチキンの本場シェフが来日、ポップアップイベント開催へ',
      summary: 'ナッシュビルで最も有名なホットチキン店のシェフが来日し、東京でポップアップイベントを開催予定。本場の味を日本で再現するため、特別に調合したスパイスミックスを持参するなど、こだわりの一品を提供します。',
      source: 'フードイベントニュース',
      date: '2025年3月20日',
      imageUrl: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
      url: '#',
      keyword: 'ナッシュビルホットチキン'
    }
  ],
  'サワードウブレッド': [
    {
      id: 'sourdough-1',
      title: 'サワードウブレッド、パン職人の技術競争が活発化',
      summary: '自家製酵母を使った「サワードウブレッド」が日本のベーカリーシーンで注目を集めています。各店舗が独自の酵母種を育て、発酵時間や製法にこだわった個性的なパンを提供。職人技を競う「サワードウコンテスト」も開催され、技術向上に拍車がかかっています。',
      source: 'ベーカリーウィークリー',
      date: '2025年4月14日',
      imageUrl: 'https://images.unsplash.com/photo-1585478259715-4ddc711c5706?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80',
      url: '#',
      keyword: 'サワードウブレッド'
    },
    {
      id: 'sourdough-2',
      title: 'サワードウブレードの健康効果に注目、腸内環境改善の可能性',
      summary: '長時間発酵させるサワードウブレッドの健康効果に関する研究が進んでいます。通常のパンと比較して消化しやすく、腸内細菌のバランスを整える可能性があるとの研究結果が発表され、健康志向の高い消費者から支持を集めています。',
      source: '健康食品研究ジャーナル',
      date: '2025年3月18日',
      imageUrl: 'https://images.unsplash.com/photo-1586444248879-bc604bc77a42?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
      url: '#',
      keyword: 'サワードウブレッド'
    }
  ],
  'オーツミルク': [
    {
      id: 'oatmilk-1',
      title: 'オーツミルク、カフェチェーンの標準オプションに急浮上',
      summary: '植物性ミルクの中でも特に人気を集めるオーツミルクが、大手カフェチェーンで標準的な選択肢として定着しつつあります。クリーミーな口当たりとバリスタ向けの泡立ち特性が評価され、多くのカフェで追加料金なしで提供されるようになりました。',
      source: 'カフェビジネスレポート',
      date: '2025年4月9日',
      imageUrl: 'https://images.unsplash.com/photo-1635438416413-52c36a49c420?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80',
      url: '#',
      keyword: 'オーツミルク'
    },
    {
      id: 'oatmilk-2',
      title: '国産オーツ麦を使用したオーツミルク開発、地産地消の動き加速',
      summary: '日本各地の農家と連携し、国産オーツ麦を使用したオーツミルクの開発が進んでいます。輸入に頼らない持続可能な生産体制を目指す取り組みは、環境意識の高い消費者から支持を集め、地域経済の活性化にも貢献しています。',
      source: '持続可能食品ニュース',
      date: '2025年3月15日',
      imageUrl: 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80',
      url: '#',
      keyword: 'オーツミルク'
    }
  ],
  '韓国焼肉': [
    {
      id: 'kbbq-1',
      title: '韓国焼肉の新スタイル「ハンサム肉」が若者に大人気',
      summary: '韓国で流行している「ハンサム肉」と呼ばれる新しい焼肉スタイルが日本でも人気急上昇中。厚切りの肉を炭火で豪快に焼き上げ、ハサミでカットして食べるスタイルは、SNS映えする見た目と豪快な食べ方が若者を中心に支持されています。',
      source: 'アジアンフードトレンド',
      date: '2025年4月7日',
      imageUrl: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80',
      url: '#',
      keyword: '韓国焼肉'
    },
    {
      id: 'kbbq-2',
      title: '韓国焼肉とナチュラルワインのペアリングが新トレンドに',
      summary: '従来はビールやマッコリと合わせることが多かった韓国焼肉ですが、最近ではナチュラルワインとのペアリングが注目を集めています。肉の旨味と自然派ワインの個性が絶妙にマッチするとして、専門店では韓国焼肉に合うワインセレクションを提供する店舗が増加中。',
      source: 'ワイン＆ダイニング',
      date: '2025年3月12日',
      imageUrl: 'https://images.unsplash.com/photo-1635363638580-c2809d049eee?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
      url: '#',
      keyword: '韓国焼肉'
    }
  ],
  'ナチュラルワイン': [
    {
      id: 'naturalwine-1',
      title: 'ナチュラルワイン専門バーが急増、若年層の新たな社交場に',
      summary: '添加物を極力使用せず自然な製法で作られる「ナチュラルワイン」を専門に扱うバーが都市部を中心に急増しています。従来のワインバーとは異なるカジュアルな雰囲気と個性的な味わいが、ワイン初心者の若年層にも受け入れられ、新たな社交の場として定着しつつあります。',
      source: 'ワイントレンドウォッチ',
      date: '2025年4月11日',
      imageUrl: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
      url: '#',
      keyword: 'ナチュラルワイン'
    },
    {
      id: 'naturalwine-2',
      title: '日本のナチュラルワイン生産者が国際的に評価、輸出も好調',
      summary: '長野や山梨を中心に活動する日本のナチュラルワイン生産者が、国際的なワインコンクールで高評価を獲得しています。日本固有のブドウ品種を活かした個性的なワインは、パリやニューヨークのレストランでも取り扱われるなど、輸出も好調に推移しています。',
      source: '日本ワイン産業ニュース',
      date: '2025年3月8日',
      imageUrl: 'https://images.unsplash.com/photo-1516594915697-87eb3b1c14ea?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
      url: '#',
      keyword: 'ナチュラルワイン'
    }
  ],
  'プラントベースバーガー': [
    {
      id: 'plantbased-1',
      title: 'プラントベースバーガー、肉食者からも支持を獲得',
      summary: '植物性原料だけで作られる「プラントベースバーガー」の技術革新が進み、肉の食感と風味を高いレベルで再現することに成功。ベジタリアンだけでなく、肉食者からも「おいしい」との評価を得て、ファストフードチェーンでも定番メニューとして定着しつつあります。',
      source: '代替タンパク質ニュース',
      date: '2025年4月13日',
      imageUrl: 'https://images.unsplash.com/photo-1586816001966-79b736744398?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
      url: '#',
      keyword: 'プラントベースバーガー'
    },
    {
      id: 'plantbased-2',
      title: '国産大豆を使用したプラントベースバーガーが登場、食料自給率向上にも貢献',
      summary: '日本の食品メーカーが国産大豆を100%使用したプラントベースバーガーの開発に成功しました。輸入に頼らない持続可能な食品供給体制の構築と食料自給率向上への貢献が評価され、政府の食料戦略にも組み込まれる見通しです。',
      source: '食料安全保障レポート',
      date: '2025年3月5日',
      imageUrl: 'https://images.unsplash.com/photo-1551782450-17144efb9c50?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1169&q=80',
      url: '#',
      keyword: 'プラントベースバーガー'
    }
  ]
};