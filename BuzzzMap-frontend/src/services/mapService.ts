export const mapService = async (keyword : string, lat : number, lng :number,limit :number) => {
	const localhost = import.meta.env.VITE_LOCALHOST;
	const response = await fetch(`${localhost}/getrestaurants?keyword=${keyword}&lat=${lat}&lng=${lng}&limit=${limit}`);

	if (!response.ok) {
		throw new Error('Failed to fetch restaurants');
	}

	const restaurants = await response.json();

	return restaurants;
}