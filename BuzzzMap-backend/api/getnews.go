package api

import (
	"fmt"
	"log"
	"os"

	"github.com/joho/godotenv"
	g "github.com/serpapi/google-search-results-golang"
)

type NewsAPIResponse struct {
	Status       string `json:"status"`
	TotalResults int    `json:"totalResults"`
	Articles     []struct {
		Source struct {
			ID   string `json:"id"`
			Name string `json:"name"`
		} `json:"source"`
		Author      string `json:"author"`
		Title       string `json:"title"`
		Description string `json:"description"`
		URL         string `json:"url"`
		PublishedAt string `json:"publishedAt"`
	} `json:"articles"`
}

func (a *Api) GetNews(query string) ([]string, error) {
	parameter := map[string]string{
		"engine": "google_news",
		"q":      query,
		"gl":     "jp",
		"hl":     "ja",
	}

	env := godotenv.Load()
	if env != nil {
		log.Fatal("Error loading .env file")
	}

	apiKey := os.Getenv("SERP_API_KEY")

	search := g.NewGoogleSearch(parameter, apiKey)
	results, err := search.GetJSON()
	if err != nil {
		return nil, err
	}

	news, ok := results["news_results"].([]interface{})
	if !ok {
		return nil, fmt.Errorf("unexpected type for news_results")
	}

	log.Println(news)

	var newsData []string

	// 各ニュース情報を走査
	for i := 0; i < len(news); i++ {
		new, ok := news[i].(map[string]interface{})
		if !ok {
			continue
		}

		title, ok := new["title"].(string)
		if !ok {
			continue
		}

		newsData = append(newsData, title)
	}

	return newsData, nil
}
