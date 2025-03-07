package api

import (
	"fmt"
	"log"
	"os"

	g "github.com/serpapi/google-search-results-golang"
)

type RisingSearch struct {
	Query          string `json:"query"`
	Months         int32  `json:"months"`
	ExtractedValue int32  `json:"extracted_value"`
}

func (a *Api) GetLongTrend() ([]RisingSearch, error) {
	apiKey := os.Getenv("SERP_API_KEY")

	// "date"と"cat"の組

	// 71 - Food & Drink
	//    277 - Alcoholic Beverages
	//       404 - Beer
	//       405 - Wine
	//       406 - Liqour
	//   906 - Candy & Sweets
	//    122 - Cooking & Recipes
	//       907 - Baked Goods
	//       908 - Fruits & Vegetables
	//       909 - Meat & Seafood
	//       910 - Soups & Stews
	//       911 - World Cuisines　　　　　　　　　↓↓↓ろくなの返しません↓↓↓
	//          912 - Asian Cuisine
	//          913 - Latin American Cuisine
	//          914 - Mediterranean Cuisine
	//          915 - North American Cuisine
	//       825 - Vegetarian Cuisine

	dateCategoryCombinations := []struct {
		date int32  // 1 or 3 or 12 (months)
		cat  string // see the list above
	}{
		{3, "71"},
		{12, "277"},
		{12, "906"},
		// add accordingly
	}

	var allRisingData []RisingSearch

	for _, combination := range dateCategoryCombinations {

		parameter := map[string]string{
			"engine":    "google_trends",
			"q":         "",
			"geo":       "JP",
			"date":      fmt.Sprintf("today %d-m", combination.date),
			"cat":       combination.cat,
			"data_type": "RELATED_QUERIES",
		}

		search := g.NewGoogleSearch(parameter, apiKey)
		results, err := search.GetJSON()
		if err != nil {
			log.Printf("%d-m", combination.date)
			return nil, err
		}

		relatedQueries, ok := results["related_queries"].(map[string]interface{})
		if !ok {
			return nil, fmt.Errorf("unexpected type for related_queries")
		}

		// 「注目(rising)」だけを抜き出す
		risingSearches, ok := relatedQueries["rising"].([]interface{})
		if !ok {
			return nil, fmt.Errorf("unexpected type for rising")
		}

		var risingData []RisingSearch

		// 各トレンド情報を走査
		for i := 0; i < len(risingSearches); i++ {
			trend, ok := risingSearches[i].(map[string]interface{})
			if !ok {
				continue
			}

			if query, ok := trend["query"].(string); ok {
				if extractedValue, ok := trend["extracted_value"].(float64); ok {
					risingData = append(risingData, RisingSearch{
						Query:          query,
						Months:         combination.date,
						ExtractedValue: int32(extractedValue),
					})
				}
			}
		}

		allRisingData = append(allRisingData, risingData...)

	}

	log.Printf("取得したクエリ: %v", allRisingData)
	return allRisingData, nil
}
