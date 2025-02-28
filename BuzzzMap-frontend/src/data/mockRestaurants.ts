// This file is no longer used as we're fetching real restaurant data from Google Maps API
// It's kept for reference only

import { Restaurant } from '../types';

// This function is deprecated and no longer used
export const generateMockRestaurants = (
  centerLat: number,
  centerLng: number,
  keywords: string[]
): Restaurant[] => {
  console.warn('generateMockRestaurants is deprecated. Use fetchRestaurantsByKeyword instead.');
  return [];
};