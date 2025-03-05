package api

import (
	"fmt"
	"log"
	"os"

	"github.com/joho/godotenv"
	g "github.com/serpapi/google-search-results-golang"
)

// NewsArticleはフロントエンドのインターフェースに合わせたニュース記事のデータ構造
type NewsArticle struct {
	ID        string `json:"id"`
	Title     string `json:"title"`
	Source    string `json:"source"`
	Date      string `json:"date"`
	ImageURL  string `json:"imageUrl"`
	URL       string `json:"url"`
	Keyword   string `json:"keyword"`
}

func (a *Api) GetNews(query string) ([]NewsArticle, error) {
	parameter := map[string]string{
		"engine": "google_news",
		"q":      query,
		"gl":     "jp",  // 日本
		"hl":     "ja",  // 日本語
	}

	// .envファイルの読み込み
	env := godotenv.Load()
	if env != nil {
		log.Fatal("Error loading .env file")
	}

	// APIキーの取得
	apiKey := os.Getenv("SERP_API_KEY")

	// Google Search APIを初期化して結果を取得
	search := g.NewGoogleSearch(parameter, apiKey)
	results, err := search.GetJSON()
	if err != nil {
		return nil, err
	}

	// news_resultsを抽出
	newsResults, ok := results["news_results"].([]interface{})
	if !ok {
		return nil, fmt.Errorf("unexpected type for news_results")
	}

	var newsData []NewsArticle

	// 各ニュース情報を走査
	for i := 0; i < len(newsResults); i++ {
		// 各記事のデータを取得
		newsItem, ok := newsResults[i].(map[string]interface{})
		if !ok {
			continue
		}

		// タイトルを取得
		title, ok := newsItem["title"].(string)
		if !ok {
			log.Printf("Failed to get title for story at index %d\n", i)
			continue
		}

		// 出典（source）を取得
		source, ok := newsItem["source"].(map[string]interface{})
		if !ok {
			log.Printf("Failed to get source for story at index %d\n", i)
			continue
		}

		// 出典の名前を取得
		sourceName, ok := source["name"].(string)
		if !ok {
			log.Printf("Failed to get source name for story at index %d\n", i)
			continue
		}

		// 投稿日時を取得
		date, ok := newsItem["date"].(string)
		if !ok {
			log.Printf("Failed to get date for story at index %d\n", i)
			continue
		}

		// 記事のURLを取得
		url, ok := newsItem["link"].(string)
		if !ok {
			log.Printf("Failed to get URL for story at index %d\n", i)
			continue
		}

		// 画像URLを取得（thumbnail）
		imageURL := ""
		if image, ok := newsItem["thumbnail"].(string); ok {
			imageURL = image
		}

		// ニュース記事をフロントエンド用に変換
		article := NewsArticle{
			ID:       fmt.Sprintf("%s-%d", query, i), // 一意のIDを生成（インデックスを使う）
			Title:    title,
			Source:   sourceName,
			Date:     date,
			ImageURL: imageURL,
			URL:      url,
			Keyword:  query,
		}

		log.Printf("Article: %v\n", article)

		// 取得したニュースデータをnewsDataに追加
		newsData = append(newsData, article)
	}

	return newsData, nil
}