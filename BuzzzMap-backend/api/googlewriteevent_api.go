package api

import (
	"bytes"
	"context"
	"encoding/json"
	"io"
	"log"
	"net/http"
	"time"

	"golang.org/x/oauth2/google"
)

// UserEvent の構造体
type UserEvent struct {
	VisitorID      string          `json:"visitorId"`
	EventType      string          `json:"eventType"`
	ProductDetails []ProductDetail `json:"productDetails"`
	EventTime      string          `json:"eventTime"`
	UserInfo       struct {
		UserID string `json:"userId"`
	} `json:"userInfo"`
}

type ProductDetail struct {
	Product struct {
		ID string `json:"id"` // "product" の中に "id" フィールドを含める
	} `json:"product"`
}

func (a *Api) Writedata(ctx context.Context, userID, EventType, listingID string) error {
	// Google Cloud 認証情報の取得
	credentials, err := google.FindDefaultCredentials(ctx, "https://www.googleapis.com/auth/cloud-platform")
	if err != nil {
		return err
	}

	tokenSource := credentials.TokenSource
	token, err := tokenSource.Token()
	if err != nil {
		return err
	}

	// 検索リクエストの作成
	apiURL := "https://retail.googleapis.com/v2/projects/22744100909/locations/global/catalogs/default_catalog/userEvents:write"
	userEvent := UserEvent{
		VisitorID: userID,
		EventType: EventType,
		ProductDetails: []ProductDetail{
			{
				Product: struct {
					ID string `json:"id"`
				}{
					ID: listingID,
				},
			},
		},
		EventTime: time.Now().UTC().Format(time.RFC3339Nano), // 現在時刻を ISO 8601 形式で設定
		UserInfo: struct {
			UserID string `json:"userId"`
		}{
			UserID: userID,
		},
	}

	body, err := json.Marshal(userEvent)
	log.Printf("Request Body: %s", string(body))
	if err != nil {
		return err
	}

	req, err := http.NewRequest("POST", apiURL, bytes.NewBuffer(body))
	if err != nil {
		return err
	}
	req.Header.Set("Authorization", "Bearer "+token.AccessToken)
	req.Header.Set("x-goog-user-project", "instant-duality-452014-e0")
	req.Header.Set("Content-Type", "application/json; charset=utf-8")

	// リクエスト送信
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	// ステータスコードに応じてレスポンスを返す
	if resp.StatusCode != http.StatusOK {
		bodyBytes, _ := io.ReadAll(resp.Body)
		log.Printf("Error response from API: %s", string(bodyBytes))
		return err
	}

	return nil
}
