const getTrend = async () => {

	const host = import.meta.env.VITE_LOCALHOST;
	const url = `${host}/gettrend`;
	try {
		const response = await fetch(url);
		const data = await response.json();
		return data;
	}

	catch (error) {
		console.error('Error:', error);
		return [];
	}
}

export default getTrend;