package handler

import "github.com/gorilla/mux"

func SetupRoutes(handler *Handler) *mux.Router {
	r := mux.NewRouter()

	r.HandleFunc("/gettrend", handler.GetTrend).Methods("GET", "OPTIONS")

	return r
}
