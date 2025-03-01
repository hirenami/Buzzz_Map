import { Restaurant } from '../types';
import { nameCache } from './openaiService';

// API key for Google Places API
const API_KEY = process.env.API_KEY;
// Interface for Google Places API response
interface PlacesResponse {
  results: {
    place_id: string;
    name: string;
    vicinity: string;
    geometry: {
      location: {
        lat: number;
        lng: number;
      }
    };
    rating?: number;
    price_level?: number;
    photos?: {
      photo_reference: string;
      width: number;
      height: number;
    }[];
  }[];
  status: string;
}

/**
 * Fetch restaurants from Google Places API based on keyword and location
 */
export const fetchRestaurantsByKeyword = async (
  keyword: string,
  lat: number,
  lng: number,
  limit: number = 3
): Promise<Restaurant[]> => {
  try {
    // Build the Google Places API URL with language=ja parameter to get Japanese results
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=1500&type=restaurant&keyword=${encodeURIComponent(keyword)}&language=ja&key=${API_KEY}`;
    
    // Try different methods to access the Google Places API
    const restaurants = await tryFetchFromAPI(url, keyword, limit);
    
    return restaurants;
    
  } catch (error) {
    console.error('レストラン取得エラー:', error);
    return [];
  }
};

/**
 * Try different methods to fetch data from the Google Places API
 */
async function tryFetchFromAPI(
  url: string, 
  keyword: string,
  limit: number
): Promise<Restaurant[]> {
  // List of CORS proxies to try
  const corsProxies = [
    'https://cors-anywhere.herokuapp.com/',
    'https://api.allorigins.win/raw?url=',
    'https://corsproxy.io/?'
  ];
  
  // Try each CORS proxy
  for (const proxy of corsProxies) {
    try {
      const proxyUrl = `${proxy}${encodeURIComponent(url)}`;
      
      const response = await fetch(proxyUrl, {
        headers: {
          'Origin': window.location.origin,
        }
      });
      
      if (!response.ok) {
        continue; // Try next proxy
      }
      
      const data: PlacesResponse = await response.json();
      
      if (data.status === 'OK' && data.results.length > 0) {
        console.log('プロキシを使用してデータの取得に成功しました:', proxy);
        return mapGooglePlacesToRestaurants(data.results, keyword, limit);
      }
    } catch (error) {
      console.log(`プロキシ ${proxy} でエラー:`, error);
      // Continue to next proxy
    }
  }
  
  // Try direct API call (will likely fail due to CORS)
  try {
    const response = await fetch(url);
    const data: PlacesResponse = await response.json();
    
    if (data.status === 'OK' && data.results.length > 0) {
      console.log('直接APIコールでデータの取得に成功しました（ブラウザでは珍しい）');
      return mapGooglePlacesToRestaurants(data.results, keyword, limit);
    }
  } catch (error) {
    console.log('直接APIコールが失敗しました:', error);
  }
  
  // All attempts failed, return empty array instead of mock data
  console.log('レストランデータを取得できませんでした:', keyword);
  return [];
}

/**
 * Map Google Places API results to our Restaurant type
 */
function mapGooglePlacesToRestaurants(
  places: PlacesResponse['results'],
  keyword: string,
  limit: number
): Restaurant[] {
  return places.slice(0, limit).map(place => {
    // Get photo URL if available
    const photoUrl = place.photos && place.photos.length > 0
      ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${place.photos[0].photo_reference}&key=${API_KEY}`
      : `https://source.unsplash.com/random/300x200/?${keyword.replace(/ /g, '-').toLowerCase()},food`;
    
    // Create a unique ID for the restaurant
    const id = `real-${place.place_id}`;
    
    // Pre-cache the restaurant name if it's long
    if (place.name.length > 8 && !nameCache[id]) {
      nameCache[id] = place.name.substring(0, 7) + '…';
    }
    
    return {
      id,
      name: place.name,
      address: place.vicinity,
      lat: place.geometry.location.lat,
      lng: place.geometry.location.lng,
      rating: place.rating || Math.floor(Math.random() * 2) + 4, // 4-5 stars for better ratings
      priceLevel: place.price_level || Math.floor(Math.random() * 3) + 1, // 1-3 price level
      trendKeyword: keyword,
      photoUrl,
      description: generateDescription(keyword, place.name),
      isRealData: true
    };
  });
}

/**
 * Generate a realistic description for a restaurant based on its keyword and name
 */
function generateDescription(keyword: string, restaurantName: string): string {
  // Base descriptions for each keyword in Japanese
  const keywordDescriptions: Record<string, string[]> = {
    '抹茶ラテ': [
      '本格的な日本の抹茶と濃厚なスチームミルクに少しの甘さを加えました。',
      '最高級の抹茶を有機牛乳とはちみつで完璧に仕上げました。',
      '儀式用の抹茶をオーツミルクとバニラで提供しています。'
    ],
    'ビリアタコス': [
      'じっくり煮込んだビリア牛肉タコスをディップ用のコンソメと一緒に提供。',
      '本格的なメキシコのビリアタコスを溶けたチーズと自家製サルサで。',
      '受賞歴のあるビリアタコスは柔らかい牛肉とカリカリのトルティーヤで提供。'
    ],
    'スマッシュバーガー': [
      '熱いグリドルで薄く潰したパティにアメリカンチーズと特製ソースをのせました。',
      'ダブルスマッシュパティにキャラメライズドオニオンと自家製ピクルスをトッピング。',
      'グラスフェッドビーフのスマッシュバーガーに熟成チェダーチーズをブリオッシュバンズで提供。'
    ],
    'タピオカミルクティー': [
      '手作りのタピオカパールと甘さ調整可能なクラシックミルクティー。',
      'フルーツ風味のバブルティーにポッピングボバとフレッシュトッピング。',
      'ブラウンシュガーパールとクリームフォームのスペシャルバブルティー。'
    ],
    'ナッシュビルホットチキン': [
      '本格的なナッシュビルスタイルのホットチキンは辛さレベルが選べ、自家製ピクルス付き。',
      'カリカリのホットチキンサンドイッチにクーリングスローとスパイシーマヨ。',
      'ナッシュビルホットチキンテンダーにはちみつをかけ、テキサストースト付き。'
    ],
    'サワードウブレッド': [
      '100年前の種と有機小麦粉で作った職人的なサワードウブレッド。',
      '完璧なクラストとオープンクラム構造の素朴なサワードウローフ。',
      'オリーブ、クルミ、シードなどの特製サワードウバリエーション。'
    ],
    'オーツミルク': [
      'バリスタ品質の泡とエスプレッソの自家製オーツミルクラテ。',
      '季節のフルーツとスーパーフードを使った有機オーツミルクスムージー。',
      'チョコレート、抹茶、チャイなどのスペシャルオーツミルクドリンク。'
    ],
    '韓国焼肉': [
      'マリネした高級肉の食べ放題韓国焼肉。',
      'バンチャンサイドと本格的な味わいの伝統的な韓国焼肉。',
      'ユニークなマリネードと調理技術を使ったモダンな韓国焼肉フュージョン。'
    ],
    'ナチュラルワイン': [
      '世界中の小規模生産者からのナチュラルワインのセレクション。',
      '最小限の介入と最大限の風味を持つオーガニックおよびバイオダイナミックワイン。',
      'ローテーションするセレクションと知識豊富なソムリエのあるナチュラルワインバー。'
    ],
    'プラントベースバーガー': [
      'ヴィーガンバンズにすべてのトッピングを載せた自家製プラントベースパティ。',
      'ヴィーガンチーズと特製ソースのビヨンドミートバーガー。',
      'トリュフフライ付きのグルメトッピングを載せたインポッシブルバーガー。'
    ]
  };
  
  // Get descriptions for this keyword or use a default
  const descriptions = keywordDescriptions[keyword] || 
    [`この地域で人気の${keyword}スポットです。`];
  
  // Select a random description
  const randomIndex = Math.floor(Math.random() * descriptions.length);
  return descriptions[randomIndex];
}