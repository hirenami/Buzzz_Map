import React, { useEffect, useState } from 'react';
import { Event } from '../types';
import { Calendar, MapPin, ArrowLeft} from 'lucide-react';

interface EventListProps {
  events: Event[];
  selectedEvent: Event | null;
  onEventClick: (event: Event) => void;
  onBackClick?: () => void;
  category?: string;
}

const EventList: React.FC<EventListProps> = ({ 
  events, 
  selectedEvent,
  onEventClick,
  onBackClick,
  category
}) => {
  const [isVisible, setIsVisible] = useState(false);
  
  // Add animation when component mounts
  useEffect(() => {
    setIsVisible(true);
  }, []);
  
  // Format date range
  const formatDateRange = (startDate: string, endDate: string): string => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    const startMonth = start.getMonth() + 1;
    const startDay = start.getDate();
    const endMonth = end.getMonth() + 1;
    const endDay = end.getDate();
    
    if (startDate === endDate) {
      return `${startMonth}月${startDay}日`;
    }
    
    if (startMonth === endMonth) {
      return `${startMonth}月${startDay}日〜${endDay}日`;
    }
    
    return `${startMonth}月${startDay}日〜${endMonth}月${endDay}日`;
  };
  
  // Get category name in Japanese
  const getCategoryName = (categoryId?: string): string => {
    if (!categoryId) return 'すべてのイベント';
    
    switch (categoryId) {
      case 'food-entertainment':
        return '食・エンタメ';
      case 'culture-art':
        return '文化・芸術';
      default:
        return 'すべてのイベント';
    }
  };
  
  return (
    <div className={`p-2 pb-16 transition-opacity duration-100 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div className="flex items-center justify-between mb-3 animate-slide-down">
        <h2 className="text-sm font-bold flex items-center">
          {onBackClick && (
            <button 
              onClick={onBackClick}
              className="mr-2 p-1 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="カテゴリー選択に戻る"
            >
              <ArrowLeft className="h-4 w-4 text-blue-600" />
            </button>
          )}
          {getCategoryName(category)}のイベント ({events.length})
        </h2>
      </div>
      
      {events.length === 0 ? (
        <p className="text-gray-500 text-center py-2 text-xs animate-fade-in">イベントが見つかりませんでした</p>
      ) : (
        <div className="space-y-2">
          {events.map((event, index) => (
            <div 
              key={event.id}
              className={`p-2 rounded-lg cursor-pointer transition-colors border animate-scale-in`}
              style={{ 
                animationDelay: `${index * 20}ms`,
                animationFillMode: 'both',
                backgroundColor: selectedEvent?.id === event.id ? 'rgba(239, 246, 255, 1)' : 'white',
                borderColor: selectedEvent?.id === event.id ? 'rgba(191, 219, 254, 1)' : 'rgba(243, 244, 246, 1)'
              }}
              onClick={() => onEventClick(event)}
            >
              <div className="flex items-start">
                <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0 mr-2">
                  <img 
                    src={event.photoUrl} 
                    alt={event.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-sm text-gray-900">{event.name}</h3>
                  <div className="flex items-center mt-1 text-xs text-gray-600">
                    <Calendar className="w-3 h-3 mr-1" />
                    <span>{formatDateRange(event.startDate, event.endDate)}</span>
                  </div>
                  <div className="flex items-center mt-1 text-xs text-gray-600">
                    <MapPin className="w-3 h-3 mr-1" />
                    <span className="truncate">{event.location}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EventList;