import React, { useEffect, useRef, useState } from 'react';
import { TrendingKeyword } from '../types';
import { TrendingUp, Loader, Play, Pause } from 'lucide-react';

interface TrendingKeywordsProps {
  keywords: TrendingKeyword[];
  activeKeyword: string | null;
  onKeywordClick: (keyword: string) => void;
  isLoading?: boolean;
  autoSwitchEnabled?: boolean;
  onToggleAutoSwitch?: () => void;
}

const TrendingKeywords: React.FC<TrendingKeywordsProps> = ({ 
  keywords, 
  activeKeyword, 
  onKeywordClick,
  isLoading = false,
  autoSwitchEnabled = false,
  onToggleAutoSwitch
}) => {
  const [slideDirection, setSlideDirection] = useState<'left' | 'right' | null>(null);
  const [prevKeyword, setPrevKeyword] = useState<string | null>(activeKeyword);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  // Handle animation when active keyword changes
  useEffect(() => {
    if (activeKeyword !== prevKeyword && prevKeyword !== null && activeKeyword !== null) {
      // Find the indices of the current and previous keywords
      const currentIndex = keywords.findIndex(k => k.keyword === activeKeyword);
      const prevIndex = keywords.findIndex(k => k.keyword === prevKeyword);
      
      // Determine slide direction based on indices
      if (currentIndex > prevIndex || (prevIndex === keywords.length - 1 && currentIndex === 0)) {
        setSlideDirection('left');
      } else {
        setSlideDirection('right');
      }
      
      // Reset slide direction after animation completes
      const timer = setTimeout(() => {
        setSlideDirection(null);
      }, 500);
      
      // Scroll to the active keyword button
      if (scrollContainerRef.current && autoSwitchEnabled) {
        const container = scrollContainerRef.current;
        const activeButton = container.querySelector(`[data-keyword="${activeKeyword}"]`) as HTMLElement;
        
        if (activeButton) {
          const containerWidth = container.offsetWidth;
          const buttonLeft = activeButton.offsetLeft;
          const buttonWidth = activeButton.offsetWidth;
          
          // Calculate the scroll position to center the button
          const scrollPosition = buttonLeft - (containerWidth / 2) + (buttonWidth / 2);
          
          // Smooth scroll to the position
          container.scrollTo({
            left: scrollPosition,
            behavior: 'smooth'
          });
        }
      }
      
      return () => clearTimeout(timer);
    }
    
    setPrevKeyword(activeKeyword);
  }, [activeKeyword, prevKeyword, keywords, autoSwitchEnabled]);
  
  return (
    <div className="bg-white bg-opacity-95 rounded-lg shadow-md p-3 animate-slide-down">
      <div className="flex items-center mb-2 justify-between">
        <div className="flex items-center">
          <TrendingUp className="w-4 h-4 text-red-500 mr-2" />
          <h2 className="text-sm font-bold">トレンドフード＆ドリンク</h2>
          {isLoading && (
            <Loader className="w-3 h-3 text-blue-500 ml-2 animate-spin" />
          )}
        </div>
        
        {onToggleAutoSwitch && (
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
      
      <div 
        ref={scrollContainerRef}
        className="flex overflow-x-auto pb-2 -mx-1 hide-scrollbar relative"
      >
        <button
          className={`flex-shrink-0 px-3 py-1 mx-1 rounded-full text-xs transition-colors ${
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
            className={`flex-shrink-0 px-3 py-1 mx-1 rounded-full text-xs transition-colors ${
              activeKeyword === item.keyword 
                ? 'bg-blue-100 text-blue-800' 
                : 'bg-gray-100 hover:bg-gray-200'
            } ${autoSwitchEnabled && activeKeyword === item.keyword ? 'animate-pulse' : ''} ${
              autoSwitchEnabled && activeKeyword === item.keyword && slideDirection === 'left' 
                ? 'animate-slide-in-left' 
                : autoSwitchEnabled && activeKeyword === item.keyword && slideDirection === 'right'
                ? 'animate-slide-in-right'
                : ''
            }`}
            onClick={() => onKeywordClick(item.keyword)}
            disabled={isLoading}
          >
            {item.keyword}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TrendingKeywords;