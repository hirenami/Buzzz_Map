package api

import (
	"fmt"
	"os"

	g "github.com/serpapi/google-search-results-golang"
)

type TrendingSearch struct {
	Query              string `json:"query"`
	EndTimestamp       int32  `json:"end_timestamp"`
	IncreasePercentage int32  `json:"increase_percentage"`
}

func (a *Api) GetTrend() ([]TrendingSearch, error) {
	parameter := map[string]string{
		"engine": "google_trends_trending_now",
		"geo":    "JP",
		"hours":  "168",
	}

	apiKey := os.Getenv("SERP_API_KEY")

	search := g.NewGoogleSearch(parameter, apiKey)
	results, err := search.GetJSON()
	if err != nil {
		return nil, err
	}

	trendingSearches, ok := results["trending_searches"].([]interface{})
	if !ok {
		return nil, fmt.Errorf("unexpected type for trending_searches")
	}

	var trendingData []TrendingSearch

	// 各トレンド情報を走査
	for i := 0; i < len(trendingSearches); i++ {
		trend, ok := trendingSearches[i].(map[string]interface{})
		if !ok {
			continue
		}

		categories, ok := trend["categories"].([]interface{})
		if !ok {
			continue
		}

		// カテゴリIDが5かどうかをチェック
		for _, cat := range categories {
			category, ok := cat.(map[string]interface{})
			if !ok {
				continue
			}
			if idVal, exists := category["id"]; exists {
				if idFloat, ok := idVal.(float64); ok && int(idFloat) == 5 {
					// カテゴリID 5 (Food and Drink) に該当する場合、query、end_timestamp、increase_percentageを取り出す
					if query, ok := trend["query"].(string); ok {
						if endTimestamp, ok := trend["end_timestamp"].(float64); ok {
							if increasePercentage, ok := trend["increase_percentage"].(float64); ok {
								trendingData = append(trendingData, TrendingSearch{
									Query:              query,
									EndTimestamp:       int32(endTimestamp),
									IncreasePercentage: int32(increasePercentage),
								})
							}
						}
					}
					break // 該当するカテゴリが見つかったので、他のカテゴリはチェック不要
				}
			}
		}
	}

	return trendingData, nil
}
