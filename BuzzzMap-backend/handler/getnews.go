package handler

import (
	"context"
	"encoding/json"
	"net/http"
)

func (h *Handler) GetNewsController(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodOptions {
		setCORSHeaders(w)
		w.WriteHeader(http.StatusOK)
		return
	}

	setCORSHeaders(w)

	ctx := context.Background()

	query := r.URL.Query().Get("query")

	news, err := h.Usecase.GetNewsUsecase(ctx, query)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(news)
	w.WriteHeader(http.StatusOK)
}
