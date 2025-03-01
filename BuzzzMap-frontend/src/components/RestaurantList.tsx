import React, { useEffect, useState } from 'react';
import { Restaurant } from '../types';
import { Star, DollarSign, BadgeCheck, ArrowLeft } from 'lucide-react';

interface RestaurantListProps {
  restaurants: Restaurant[];
  selectedRestaurant: Restaurant | null;
  onRestaurantClick: (restaurant: Restaurant) => void;
  onBackClick?: () => void;
}

const RestaurantList: React.FC<RestaurantListProps> = ({ 
  restaurants, 
  selectedRestaurant,
  onRestaurantClick,
  onBackClick
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const trendKeyword = restaurants.length > 0 ? restaurants[0].trendKeyword : '';
  
  // Add animation when component mounts
  useEffect(() => {
    setIsVisible(true);
  }, []);
  
  return (
    <div className={`p-2 pb-16 transition-opacity duration-100 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div className="flex items-center justify-between mb-3 animate-slide-down">
        <h2 className="text-sm font-bold flex items-center">
          {onBackClick && (
            <button 
              onClick={onBackClick}
              className="mr-2 p-1 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="トレンドキーワードに戻る"
            >
              <ArrowLeft className="h-4 w-4 text-blue-600" />
            </button>
          )}
          {trendKeyword}のレストラン ({restaurants.length})
        </h2>
      </div>
      
      {restaurants.length === 0 ? (
        <p className="text-gray-500 text-center py-2 text-xs animate-fade-in">レストランが見つかりませんでした</p>
      ) : (
        <div className="space-y-2">
          {restaurants.map((restaurant, index) => (
            <div 
              key={restaurant.id}
              className={`p-2 rounded-lg cursor-pointer transition-colors border animate-scale-in`}
              style={{ 
                animationDelay: `${index * 20}ms`,
                animationFillMode: 'both',
                backgroundColor: selectedRestaurant?.id === restaurant.id ? 'rgba(239, 246, 255, 1)' : 'white',
                borderColor: selectedRestaurant?.id === restaurant.id ? 'rgba(191, 219, 254, 1)' : 'rgba(243, 244, 246, 1)'
              }}
              onClick={() => onRestaurantClick(restaurant)}
            >
              <div className="flex items-start">
                <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0 mr-2">
                  <img 
                    src={restaurant.photoUrl} 
                    alt={restaurant.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center">
                    <h3 className="font-bold text-sm text-gray-900">{restaurant.name}</h3>
                    {restaurant.isRealData && (
                      <BadgeCheck className="w-4 h-4 text-blue-500 ml-1"/>
                    )}
                  </div>
                  <div className="flex items-center mt-1">
                    <div className="flex items-center mr-3">
                      <span className="text-xs font-medium text-gray-700 mr-1">{restaurant.rating.toFixed(1)}</span>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-3 h-3 ${
                            i < restaurant.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                          }`} 
                        />
                      ))}
                    </div>
                    <div className="flex items-center text-gray-600">
                      {Array.from({ length: restaurant.priceLevel }).map((_, i) => (
                        <DollarSign key={i} className="w-3 h-3 text-gray-600" />
                      ))}
                    </div>
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

export default RestaurantList;