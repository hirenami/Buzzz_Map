import React, { useEffect, useState } from 'react';
import { NewsArticle } from '../types';
import { ArrowLeft, Calendar, ExternalLink } from 'lucide-react';
import { getNews } from '../services/getNews';

interface NewsArticleListProps {
  keyword: string;
  onBackClick: () => void;
}

const NewsArticleList: React.FC<NewsArticleListProps> = ({ 
  keyword,
  onBackClick 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  
  useEffect(() => {
    // 非同期関数を内部で定義
    const fetchData = async () => {
        setIsVisible(true);
        const data = await getNews(keyword);  // getNewsは非同期関数と仮定
        setArticles(data);  // 非同期で取得したデータをセット
    };

    fetchData();  // 非同期関数を実行
}, [keyword]);  // keywordが変わるたびに実行
  
  return (
    <div className={`h-full overflow-y-auto p-2 pb-16 transition-opacity duration-100 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div className="flex items-center justify-between mb-3 animate-slide-down sticky top-0 bg-white z-10 py-2">
        <h2 className="text-sm font-bold flex items-center">
          <button 
            onClick={onBackClick}
            className="mr-2 p-1 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="トレンドキーワードに戻る"
          >
            <ArrowLeft className="h-4 w-4 text-blue-600" />
          </button>
          {keyword}のニュース記事 ({articles.length})
        </h2>
      </div>
      
      {articles.length === 0 ? (
        <p className="text-gray-500 text-center py-2 text-xs animate-fade-in">記事が見つかりませんでした</p>
      ) : (
        <div className="space-y-4">
          {articles.map((article, index) => (
            <div 
              key={article.id}
              className="rounded-lg border border-gray-200 overflow-hidden animate-scale-in"
              style={{ 
                animationDelay: `${index * 100}ms`,
                animationFillMode: 'both'
              }}
            >
              <div className="relative h-40 overflow-hidden">
                <img 
                  src={article.imageUrl} 
                  alt={article.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-3">
                <h3 className="font-bold text-sm text-gray-900 mb-2">{article.title}</h3>
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center text-gray-500">
                    <Calendar className="w-3 h-3 mr-1" />
                    <span>{article.date}</span>
                  </div>
                  <div className="text-blue-600 font-medium">
                    <a href={article.url} className="flex items-center" target="_blank" rel="noopener noreferrer">
                      <span className="mr-1">続きを読む</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  出典: {article.source}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NewsArticleList;