package handler

import (
	"context"
	"encoding/json"
	"io"
	"log"
	"net/http"
	"os"

	"github.com/joho/godotenv"
	svix "github.com/svix/svix-webhooks/go"
)

type WebhookPayload struct {
	Type string `json:"type"`
	Data  struct {
		ID string `json:"id"`
	} `json:"data"`
}

func (h *Handler) WebhookHandler(w http.ResponseWriter, r *http.Request) {
	// ClerkのWebhookリクエストを検証するためのシークレットキーを取得
	env := godotenv.Load()
	if env != nil {
		log.Fatal("Error loading .env file")
	}
	signingSecret := os.Getenv("CLERK_WEBHOOK_SECRET")
	if signingSecret == "" {
		http.Error(w, "Webhook signing secret not set", http.StatusInternalServerError)
		return
	}

	// リクエストボディを[]byteに読み取る
	body, err := io.ReadAll(r.Body)
	if err != nil {
		http.Error(w, "Failed to read request body", http.StatusInternalServerError)
		return
	}
	defer r.Body.Close() // リクエストボディを閉じる

	// SvixのWebhook検証を使用
	wh, err := svix.NewWebhook(signingSecret)
	if err != nil {
		http.Error(w, "Error creating webhook verifier", http.StatusInternalServerError)
		return
	}

	// Webhookのヘッダーを取得
	headers := r.Header
	signature := headers.Get("Svix-Signature")
	timestamp := headers.Get("Svix-Timestamp")
	svixID := headers.Get("Svix-ID")

	// ヘッダー情報を設定
	headers.Set("Svix-Signature", signature)
	headers.Set("Svix-Timestamp", timestamp)
	headers.Set("Svix-ID", svixID)

	// Webhookの署名を検証
	err = wh.Verify(body, headers)
	if err != nil {
		http.Error(w, "Webhook signature verification failed", http.StatusUnauthorized)
		return
	}

	// リクエストボディをデコード
	var payload WebhookPayload
	if err := json.Unmarshal(body, &payload); err != nil {
		http.Error(w, "Failed to parse webhook payload", http.StatusBadRequest)
		return
	}

	log.Printf("Received webhook event: %s", payload.Type)
	log.Printf("Data: %v", payload.Data)

	ctx := context.Background()

	// user.created イベントの場合の処理
	if payload.Type == "user.created" {
		userID := payload.Data.ID
		log.Printf("New user created with ID: %s", userID)

		err := h.Usecase.CreateUserUsecase(ctx, userID)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
	}
	w.WriteHeader(http.StatusOK)
}
