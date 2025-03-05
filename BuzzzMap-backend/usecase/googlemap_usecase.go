package usecase

import (
	"context"
	"fmt"
	"log"
	"os"

	"github.com/joho/godotenv"
)

// Google Places APIから取得した結果をレストラン型に変換
func (u *Usecase) MapGooglePlacesToRestaurants(ctx context.Context, keyword, lat, lng string, limit int) ([]Restaurant, error) {
	var restaurants []Restaurant
	places, err := u.api.FetchRestaurantsByLocation(keyword, lat, lng)
	if err != nil {
		return nil, err
	}

	env := godotenv.Load()
	if env != nil {
		log.Fatal("Error loading .env file")
	}

	apiKey := os.Getenv("GOOGLE_API_KEY")

	for _, place := range places.Results[:limit] {
		// 写真のURLを取得
		photoURL := ""
		if len(place.Photos) > 0 {
			photoURL = fmt.Sprintf("https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=%s&key=%s", place.Photos[0].PhotoReference, apiKey)
		} else {
			photoURL = fmt.Sprintf("https://source.unsplash.com/random/300x200/?%s,food", keyword)
		}

		// ユニークなIDを生成
		id := "real-" + place.PlaceID

		// Restaurant構造体に変換
		restaurants = append(restaurants, Restaurant{
			ID:           id,
			Name:         place.Name,
			Address:      place.Vicinity,
			Lat:          place.Geometry.Location.Lat,
			Lng:          place.Geometry.Location.Lng,
			Rating:       place.Rating,
			PriceLevel:   place.PriceLevel,
			TrendKeyword: keyword,
			PhotoURL:     photoURL,
			IsRealData:   true,
		})
	}

	return restaurants, nil
}
