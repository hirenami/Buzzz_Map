import React from 'react';
import { MapPin, Utensils } from 'lucide-react';

interface HeaderProps {
  isLoading: boolean;
  error: string | null;
}

const Header: React.FC<HeaderProps> = () => {
  return (
    <header className="bg-white shadow-md py-2 px-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Utensils className="h-6 w-6 text-blue-600 mr-2" />
          <h1 className="text-lg font-bold text-gray-800">トレンドイーツ</h1>
        </div>
        
        <div className="flex items-center">
          <div className="flex items-center text-green-600">
            <MapPin className="h-4 w-4 mr-1" />
            <span className="text-xs">渋谷、東京</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;