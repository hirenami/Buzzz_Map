package handler

import (
	"context"
	"encoding/json"
	"net/http"
)

func (h *Handler) GetTrend(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodOptions {
		setCORSHeaders(w)
		w.WriteHeader(http.StatusOK)
		return
	}

	setCORSHeaders(w)

	ctx := context.Background()

	trends, err := h.Usecase.GetTrend(ctx)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(trends)
	w.WriteHeader(http.StatusOK)
}
