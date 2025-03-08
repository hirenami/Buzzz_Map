export interface TrendingKeyword {
	keyword: string;
	location: string;
	rank: number;
	end_timestamp?: number;
	increase_percentage?: number;
}

export interface Restaurant {
	id: string;
	name: string;
	address: string;
	lat: number;
	lng: number;
	rating: number;
	price_level: number;
	trendkeyword: string;
	photo_url?: string;
	isRealData?: boolean;
}
export interface MapOptions {
	center: {
		lat: number;
		lng: number;
	};
	zoom: number;
	mapTypeControl: boolean;
	streetViewControl: boolean;
	fullscreenControl: boolean;
	zoomControl: boolean;
	scrollwheel: boolean;
	mapTypeId: string;
	panControl: boolean;
	rotateControl: boolean;
	scaleControl: boolean;
	disableDefaultUI: boolean;
	gestureHandling: string;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	styles: any[];
}

export interface NewsArticle {
	id: string;
	title: string;
	source: string;
	date: string;
	imageUrl: string;
	url: string;
	keyword: string;
}

export interface Bookmark {
	id: string;
	userId: string;
	keyword: string;
	createdAt: Date;
}

export interface CategoryTab {
	id: string;
	name: string;
}

export interface Event {
	keyword: string;
	location: string;
	months: number;
	increase_percentage: number;
  }