import React from 'react';
import { TrendingUp, Calendar, Play, Pause } from 'lucide-react';
import { TrendingKeyword } from '../types';

interface ExploreTabHeaderProps {
  activeMode: 'trend' | 'event';
  onModeChange: (mode: 'trend' | 'event') => void;
  activeKeyword: string | null;
  keywords: TrendingKeyword[];
  onKeywordClick: (keyword: string) => void;
  isLoading?: boolean;
  autoSwitchEnabled?: boolean;
  onToggleAutoSwitch?: () => void;
  activeEventCategory?: string;
  onEventCategoryChange?: (category: string) => void;
}

const ExploreTabHeader: React.FC<ExploreTabHeaderProps> = ({ 
  activeMode, 
  onModeChange,
  activeKeyword,
  keywords,
  onKeywordClick,
  isLoading = false,
  autoSwitchEnabled = false,
  onToggleAutoSwitch,
  activeEventCategory = 'all',
  onEventCategoryChange
}) => {
  const eventCategories = [
    { id: 'all', name: 'すべて' },
    { id: 'food-entertainment', name: '食・エンタメ' },
    { id: 'culture-art', name: '文化・芸術' }
  ];

  return (
    <div className="bg-white bg-opacity-95 rounded-lg shadow-md p-2 animate-slide-down">
      {/* モード切り替えボタン */}
      <div className="flex items-center justify-between mb-1">
        <div className="flex bg-gray-100 p-1 rounded-full">
          <button
            className={`flex items-center px-2 py-0.5 rounded-full text-xs transition-colors ${
              activeMode === 'trend' 
                ? 'bg-white text-blue-800 shadow-sm' 
                : 'text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => onModeChange('trend')}
          >
            <TrendingUp className="w-3 h-3 mr-1" />
            <span>トレンド</span>
          </button>
          
          <button
            className={`flex items-center px-2 py-0.5 rounded-full text-xs transition-colors ${
              activeMode === 'event' 
                ? 'bg-white text-blue-800 shadow-sm' 
                : 'text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => onModeChange('event')}
          >
            <Calendar className="w-3 h-3 mr-1" />
            <span>期間限定イベント</span>
          </button>
        </div>
        
        {/* 自動切り替えボタン（トレンドモードのみ表示） */}
        {activeMode === 'trend' && onToggleAutoSwitch && (
          <button 
            onClick={onToggleAutoSwitch}
            className={`p-1 rounded-full ${autoSwitchEnabled ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}
            title={autoSwitchEnabled ? "自動切り替えを停止" : "自動切り替えを開始"}
          >
            {autoSwitchEnabled ? (
              <Pause className="w-3 h-3" />
            ) : (
              <Play className="w-3 h-3" />
            )}
          </button>
        )}
      </div>
      
      {/* キーワードまたはイベントカテゴリの表示 */}
      <div className="flex overflow-x-auto pb-1 -mx-1 hide-scrollbar">
        {activeMode === 'trend' ? (
          <>
            <button
              className={`flex-shrink-0 px-2 py-0.5 mx-1 rounded-full text-xs transition-colors ${
                activeKeyword === null 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
              onClick={() => onKeywordClick('all')}
              disabled={isLoading}
              data-keyword="all"
            >
              すべて
            </button>
            
            {keywords.map((item) => (
              <button
                key={item.rank}
                data-keyword={item.keyword}
                className={`flex-shrink-0 px-2 py-0.5 mx-1 rounded-full text-xs transition-colors ${
                  activeKeyword === item.keyword 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'bg-gray-100 hover:bg-gray-200'
                } ${autoSwitchEnabled && activeKeyword === item.keyword ? 'animate-pulse' : ''}`}
                onClick={() => onKeywordClick(item.keyword)}
                disabled={isLoading}
              >
                {item.keyword}
              </button>
            ))}
          </>
        ) : (
          // イベントカテゴリのボタン
          eventCategories.map((category) => (
            <button
              key={category.id}
              className={`flex-shrink-0 px-2 py-0.5 mx-1 rounded-full text-xs transition-colors ${
                activeEventCategory === category.id 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
              onClick={() => onEventCategoryChange && onEventCategoryChange(category.id)}
              disabled={isLoading}
            >
              {category.name}
            </button>
          ))
        )}
      </div>
      
      {/* ローディングスピナー */}
      {isLoading && (
        <div className="flex justify-center mt-1">
          <div className="w-3 h-3 rounded-full border-2 border-blue-500 border-t-transparent animate-spin"></div>
        </div>
      )}
    </div>
  );
};

export default ExploreTabHeader;