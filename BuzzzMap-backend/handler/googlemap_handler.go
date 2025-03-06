package handler

import (
	"context"
	"encoding/json"
	"log"
	"net/http"
	"strconv"
)

func (h *Handler) MapGooglePlacesToRestaurantsController(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodOptions {
		setCORSHeaders(w)
		w.WriteHeader(http.StatusOK)
		return
	}

	setCORSHeaders(w)

	ctx := context.Background()

	keyword := r.URL.Query().Get("keyword")
	lat := r.URL.Query().Get("lat")
	lng := r.URL.Query().Get("lng")
	limitStr := r.URL.Query().Get("limit")

	limit, err := strconv.Atoi(limitStr)
	if err != nil {
		log.Printf("Invalid limit parameter: %v", limitStr)
		http.Error(w, "Invalid limit parameter", http.StatusBadRequest)
		return
	}

	restaurants, err := h.Usecase.MapGooglePlacesToRestaurants(ctx, keyword, lat, lng, limit)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")

	if err := json.NewEncoder(w).Encode(restaurants); err != nil {
		log.Printf("Error encoding response: %v", err)
		http.Error(w, "Error encoding response", http.StatusInternalServerError)
		return
	}
}
