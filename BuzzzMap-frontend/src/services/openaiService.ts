import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Note: In production, API calls should be made from a backend
});

/**
 * Cache for summarized restaurant names to avoid repeated API calls
 */
export const nameCache: Record<string, string> = {};

/**
 * Summarize a restaurant name to make it shorter and more concise
 * @param restaurantName The original restaurant name to summarize
 * @returns A summarized version of the restaurant name
 */
export const summarizeRestaurantName = async (restaurantName: string): Promise<string> => {
  // If the name is already short enough, return it as is
  if (restaurantName.length <= 8) {
    return restaurantName;
  }
  
  try {
    const prompt = `
    以下の店舗名を、意味を保ちながら最大8文字以内に短くしてください。
    元の店舗名の特徴や雰囲気を残すようにしてください。
    
    店舗名: ${restaurantName}
    
    短い店舗名:
    `;

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'あなたは店舗名を短くする専門家です。' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 20,
      temperature: 0.7
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error('OpenAI returned empty response');
    }

    // Clean up the response and ensure it's not longer than 8 characters
    let summarizedName = content.trim();
    if (summarizedName.length > 8) {
      summarizedName = summarizedName.substring(0, 7) + '…';
    }
    
    return summarizedName;
  } catch (error) {
    console.error('OpenAI API error:', error);
    
    // Fallback to simple truncation if API fails
    return restaurantName.substring(0, 7) + '…';
  }
};

/**
 * Categorize trending keywords using OpenAI
 * @param keywords Array of trending keywords to categorize
 * @returns Object mapping each keyword to its category
 */
export const categorizeKeywords = async (keywords: string[]): Promise<Record<string, string>> => {
  try {
    const prompt = `
    あなたは食品カテゴリ分類の専門家です。以下の食品や飲料のトレンドキーワードを、適切なカテゴリに分類してください。
    
    カテゴリの例：
    - コーヒー・お茶
    - デザート・スイーツ
    - ファストフード
    - 健康食品
    - アジア料理
    - 洋食
    - 和食
    - アルコール飲料
    - ノンアルコール飲料
    - ベーカリー
    - その他
    
    以下のキーワードを分類してください：
    ${keywords.join(', ')}
    
    回答は以下のJSON形式で返してください：
    {
      "キーワード1": "カテゴリ名",
      "キーワード2": "カテゴリ名",
      ...
    }
    
    カテゴリ名は日本語で、簡潔に表現してください。
    `;

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'あなたは食品カテゴリ分類の専門家です。' },
        { role: 'user', content: prompt }
      ],
      response_format: { type: 'json_object' }
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error('OpenAI returned empty response');
    }

    return JSON.parse(content);
  } catch (error) {
    console.error('OpenAI API error:', error);
    
    // Fallback categorization in case of API failure
    const fallbackCategories: Record<string, string> = {
      '抹茶ラテ': 'コーヒー・お茶',
      'ビリアタコス': 'メキシコ料理',
      'スマッシュバーガー': 'ファストフード',
      'タピオカミルクティー': 'ノンアルコール飲料',
      'ナッシュビルホットチキン': 'アメリカ料理',
      'サワードウブレッド': 'ベーカリー',
      'オーツミルク': 'ノンアルコール飲料',
      '韓国焼肉': 'アジア料理',
      'ナチュラルワイン': 'アルコール飲料',
      'プラントベースバーガー': '健康食品'
    };
    
    // Return fallback categories for the requested keywords
    const result: Record<string, string> = {};
    keywords.forEach(keyword => {
      result[keyword] = fallbackCategories[keyword] || 'その他';
    });
    
    return result;
  }
};

/**
 * Get category details including icon and description
 * @param categoryName Name of the category
 * @returns Category details including icon and description
 */
export const getCategoryDetails = (categoryName: string): { icon: string, description: string } => {
  const categoryDetails: Record<string, { icon: string, description: string }> = {
    'コーヒー・お茶': { 
      icon: 'coffee', 
      description: '様々なコーヒーやお茶の飲み物、カフェで人気のドリンク' 
    },
    'デザート・スイーツ': { 
      icon: 'cake', 
      description: '甘いデザートやスイーツ、お菓子類' 
    },
    'ファストフード': { 
      icon: 'burger', 
      description: '手軽に食べられる人気のファストフード' 
    },
    '健康食品': { 
      icon: 'salad', 
      description: '健康志向の食品や飲料、オーガニック食品' 
    },
    'アジア料理': { 
      icon: 'soup', 
      description: '日本、中国、韓国、東南アジアなどのアジア各国の料理' 
    },
    '洋食': { 
      icon: 'utensils', 
      description: 'ヨーロッパやアメリカなどの西洋料理' 
    },
    '和食': { 
      icon: 'fish', 
      description: '日本の伝統的な料理や現代的な和食' 
    },
    'アルコール飲料': { 
      icon: 'wine', 
      description: 'ワイン、ビール、日本酒などのアルコール飲料' 
    },
    'ノンアルコール飲料': { 
      icon: 'glass-water', 
      description: 'ソフトドリンク、ジュース、ノンアルコールカクテルなど' 
    },
    'ベーカリー': { 
      icon: 'bread', 
      description: 'パン、ベーグル、クロワッサンなどのベーカリー製品' 
    },
    'メキシコ料理': { 
      icon: 'taco', 
      description: 'タコス、ブリトー、ケサディーヤなどのメキシコ料理' 
    },
    'アメリカ料理': { 
      icon: 'drumstick', 
      description: 'アメリカンダイナーやソウルフードなどのアメリカ料理' 
    },
    'その他': { 
      icon: 'utensils', 
      description: 'その他のユニークな食品や飲料のトレンド' 
    }
  };
  
  return categoryDetails[categoryName] || { icon: 'utensils', description: 'さまざまな食品や飲料のトレンド' };
};
