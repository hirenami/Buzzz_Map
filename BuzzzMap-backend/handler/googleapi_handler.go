package handler

import (
	"context"
	"encoding/json"
	"net/http"
	"strconv"
)

func (h *Handler) Writedata(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodOptions {
		setCORSHeaders(w)
		w.WriteHeader(http.StatusOK)
		return
	}

	setCORSHeaders(w)

	ctx := context.Background()

	userID := r.URL.Query().Get("userID")
	EventType := r.URL.Query().Get("EventType")
	listingID := r.URL.Query().Get("listingID")

	err := h.Usecase.WritedataUsecaase(ctx, userID, EventType, listingID)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(err.Error()))
		return
	}
	w.WriteHeader(http.StatusOK)
}

func (h *Handler) Predictdata(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodOptions {
		setCORSHeaders(w)
		w.WriteHeader(http.StatusOK)
		return
	}

	setCORSHeaders(w)

	ctx := context.Background()

	userID := r.URL.Query().Get("userID")
	_number := r.URL.Query().Get("number")

	number, err := strconv.Atoi(_number)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(err.Error()))
		return
	}

	data, err := h.Usecase.PredictdataUsecase(ctx, userID, number)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(err.Error()))
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(data)

}
