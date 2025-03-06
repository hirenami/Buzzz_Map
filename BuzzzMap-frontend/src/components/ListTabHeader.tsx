import React from 'react';
import { TrendingUp, Calendar} from 'lucide-react';

interface ListTabHeaderProps {
  activeMode: 'trend' | 'event';
  onModeChange: (mode: 'trend' | 'event') => void;
  activeKeyword: string | null;
}

const ListTabHeader: React.FC<ListTabHeaderProps> = ({ 
  activeMode, 
  onModeChange,
}) => {
  return (
    <div className="bg-white p-3 animate-slide-down">
      <div className="flex items-center justify-between mb-2">
        <div className="flex space-x-2">
          <button
            className={`flex items-center px-3 py-1 rounded-full text-xs transition-colors ${
              activeMode === 'trend'
                ? 'bg-blue-100 text-blue-800'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
            onClick={() => onModeChange('trend')}
          >
            <TrendingUp className="w-3 h-3 mr-1" />
            <span>トレンド</span>
          </button>
          
          <button
            className={`flex items-center px-3 py-1 rounded-full text-xs transition-colors ${
              activeMode === 'event'
                ? 'bg-blue-100 text-blue-800'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
            onClick={() => onModeChange('event')}
          >
            <Calendar className="w-3 h-3 mr-1" />
            <span>期間限定イベント</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ListTabHeader;
