import { Restaurant } from '../types';

export const mapService = async (
    keyword: string,
    lat: number,
    lng: number,
    limit: number
): Promise<Restaurant[]> => {
    const localhost = import.meta.env.VITE_LOCALHOST;
    try {
        const response = await fetch(
            `${localhost}/getrestaurants?keyword=${keyword}&lat=${lat}&lng=${lng}&limit=${limit}`
        );

        if (!response.ok) {
            throw new Error('Failed to fetch restaurants');
        }

        const restaurants: Restaurant[] = await response.json();
        return restaurants;
    } catch (error) {
        console.error(error);
        return [];
    }
};