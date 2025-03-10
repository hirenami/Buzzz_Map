export const getNews = async (query:string) => {
	const localhost = import.meta.env.VITE_LOCALHOST;
	try {
		const response = await fetch(`${localhost}/getnews?query=${query}`);

		if (!response.ok) {
			throw new Error('Failed to fetch restaurants');
		}

		const news = await response.json();

		return news;
	} catch (error) {
		console.error(error);
	}
}