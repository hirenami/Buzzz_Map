package api

import (
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"net/url"
	"os"

	"github.com/joho/godotenv"
)

const API_KEY = "YOUR_GOOGLE_API_KEY" // 環境変数または適切なAPIキーに置き換え

// Places APIのレスポンス構造体
type PlacesResponse struct {
	Results []struct {
		PlaceID  string `json:"place_id"`
		Name     string `json:"name"`
		Vicinity string `json:"vicinity"`
		Geometry struct {
			Location struct {
				Lat float64 `json:"lat"`
				Lng float64 `json:"lng"`
			} `json:"location"`
		} `json:"geometry"`
		Rating     float64 `json:"rating"`
		PriceLevel int     `json:"price_level"`
		Photos     []struct {
			PhotoReference string `json:"photo_reference"`
		} `json:"photos"`
	} `json:"results"`
	Status string `json:"status"`
}

// Google Places APIを呼び出し、レストランデータを取得
func (a *Api) FetchRestaurantsByLocation(keyword, lat, lng string) (PlacesResponse, error) {
	env := godotenv.Load()
	if env != nil {
		log.Fatal("Error loading .env file")
	}

	apiKey := os.Getenv("GOOGLE_API_KEY")

	apiURL := fmt.Sprintf("https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=%s,%s&radius=500&type=restaurant&keyword=%s&language=ja&key=%s", lat, lng, url.QueryEscape(keyword), apiKey)

	// APIリクエストを送信
	resp, err := http.Get(apiURL)
	if err != nil {
		return PlacesResponse{}, fmt.Errorf("APIリクエストエラー: %v", err)
	}
	defer resp.Body.Close()

	// レスポンスの読み込み
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return PlacesResponse{}, fmt.Errorf("レスポンスの読み込みエラー: %v", err)
	}

	// レスポンスのパース
	var placesResponse PlacesResponse
	if err := json.Unmarshal(body, &placesResponse); err != nil {
		return PlacesResponse{}, fmt.Errorf("レスポンスのパースエラー: %v", err)
	}

	// レストラン情報の変換
	return placesResponse, nil
}
