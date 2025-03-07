package api

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"time"

	"golang.org/x/oauth2/google"
)

func (a *Api) GetPredicts(ctx context.Context, userID string) ([]string, error) {
	// Google Cloud 認証情報の取得
	credentials, err := google.FindDefaultCredentials(ctx, "https://www.googleapis.com/auth/cloud-platform")
	if err != nil {
		log.Println("Error finding credentials:", err)
		return nil, err
	}

	tokenSource := credentials.TokenSource
	token, err := tokenSource.Token()
	if err != nil {
		log.Println("Error getting token:", err)
		return nil, err
	}

	// 予測 API のリクエストボディ
	apiURL := "https://retail.googleapis.com/v2/projects/22744100909/locations/global/catalogs/default_catalog/servingConfigs/recently_viewed_default:predict"
	requestBody := map[string]interface{}{
		"userEvent": map[string]interface{}{
			"visitorId": userID,
			"eventType": "home-page-view",
			"eventTime": time.Now().UTC().Format(time.RFC3339Nano),
		},
		"pageSize": 5,
	}

	body, err := json.Marshal(requestBody)
	if err != nil {
		log.Println("Error marshaling request body:", err)
		return nil, err
	}

	req, err := http.NewRequest("POST", apiURL, bytes.NewBuffer(body))
	if err != nil {
		log.Println("Error creating request:", err)
		return nil, err
	}
	req.Header.Set("Authorization", "Bearer "+token.AccessToken)
	req.Header.Set("x-goog-user-project", "instant-duality-452014-e0")
	req.Header.Set("Content-Type", "application/json; charset=utf-8")

	// 予測 API 呼び出し
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		log.Println("Error sending request:", err)
		return nil, err
	}
	defer resp.Body.Close()

	// 予測 API のレスポンスを処理
	respBody, err := io.ReadAll(resp.Body)
	if err != nil {
		log.Println("Error reading response:", err)
		return nil, err
	}

	// 結果を表示
	fmt.Println("Search Response:")
	fmt.Println(string(respBody))

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("API returned status code %d", resp.StatusCode)
	}

	var predictResponse struct {
		Results []struct {
			Product struct {
				ID string `json:"id"`
			} `json:"product"`
		} `json:"results"`
	}
	err = json.Unmarshal(respBody, &predictResponse)
	if err != nil {
		log.Println("Error unmarshalling response:", err)
		return nil, err
	}

	// API から取得した ID
	apiIds := []string{}
	for _, result := range predictResponse.Results {
		apiIds = append(apiIds, result.Product.ID)
	}

	// ID をマージしつつ重複を除外
	uniqueIds := map[string]struct{}{}
	mergedIds := []string{}

	for _, id := range apiIds {
		if _, exists := uniqueIds[id]; !exists {
			uniqueIds[id] = struct{}{}
			mergedIds = append(mergedIds, id)
		}
	}

	return mergedIds, nil
}
