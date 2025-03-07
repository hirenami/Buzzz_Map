package usecase

import (
	"context"
	"fmt"
	"os"
)

// Google Places APIから取得した結果をレストラン型に変換
func (u *Usecase) MapGooglePlacesToRestaurants(ctx context.Context, keyword, lat, lng string, limit int) ([]Restaurant, error) {
	var restaurants []Restaurant

	// FetchRestaurantsByLocation関数からレストラン情報を取得
	places, err := u.api.FetchRestaurantsByLocation(keyword, lat, lng)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch restaurants: %w", err)
	}

	// APIキーを取得
	apiKey := os.Getenv("GOOGLE_API_KEY")
	if apiKey == "" {
		return nil, fmt.Errorf("GOOGLE_API_KEY is not set in environment variables")
	}

	// limitの値がplaces.Resultsの長さを超えないようにする
	if limit > len(places.Results) {
		limit = len(places.Results)
	}

	// レストラン情報を変換して配列に追加
	for _, place := range places.Results[:limit] {
		// 写真URLを生成
		var photoURL string
		if len(place.Photos) > 0 {
			photoURL = fmt.Sprintf("https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=%s&key=%s", place.Photos[0].PhotoReference, apiKey)
		} else {
			photoURL = fmt.Sprintf("https://source.unsplash.com/random/300x200/?%s,food", keyword)
		}

		// ユニークなIDを生成
		id := "real-" + place.PlaceID

		// Restaurant構造体に変換してrestaurantsに追加
		restaurants = append(restaurants, Restaurant{
			ID:           id,
			Name:         place.Name,
			Address:      place.Vicinity,
			Lat:          place.Geometry.Location.Lat,
			Lng:          place.Geometry.Location.Lng,
			Rating:       place.Rating,
			PriceLevel:   place.PriceLevel,
			Trendkeyword: keyword,
			PhotoURL:     photoURL,
			IsRealData:   true,
		})
	}

	return restaurants, nil
}
