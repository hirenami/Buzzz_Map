import React, { ReactNode } from 'react';
import { Volume2, Wifi, Battery } from 'lucide-react';

interface PhoneFrameProps {
  children: ReactNode;
}

const PhoneFrame: React.FC<PhoneFrameProps> = ({ children }) => {
  // Get current time for the status bar
  const currentTime = new Date().toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: false
  });

  return (
    <div className="relative mx-auto border-gray-800 dark:border-gray-800 bg-gray-800 border-[14px] rounded-[2.5rem] h-[600px] w-[300px] shadow-xl">
      {/* Phone frame notch */}
      <div className="w-[148px] h-[18px] bg-gray-800 absolute top-0 left-1/2 transform -translate-x-1/2 rounded-b-[1rem] z-20"></div>
      
      {/* Front camera */}
      <div className="absolute top-[7px] left-1/2 transform -translate-x-16 w-[10px] h-[10px] bg-gray-900 rounded-full"></div>
      
      {/* Speaker */}
      <div className="absolute top-[7px] left-1/2 transform -translate-x-[3px] w-[40px] h-[5px] bg-gray-900 rounded-full"></div>
      
      {/* Status bar */}
      <div className="w-full h-6 bg-black flex items-center justify-between px-5 pt-1">
        <span className="text-white text-xs font-medium">{currentTime}</span>
        <div className="flex items-center space-x-1">
          <Wifi className="h-3 w-3 text-white" />
          <Battery className="h-3 w-3 text-white" />
        </div>
      </div>
      
      {/* Main content */}
      <div className="w-full h-[calc(100%-1.5rem)] overflow-hidden bg-white">
        {children}
      </div>
      
      {/* Home indicator */}
      <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-[100px] h-[4px] bg-gray-300 rounded-full"></div>
    </div>
  );
};

export default PhoneFrame;