package handler

import "github.com/gorilla/mux"

func SetupRoutes(handler *Handler) *mux.Router {
	r := mux.NewRouter()

	r.HandleFunc("/gettrend", handler.GetTrend).Methods("GET", "OPTIONS")
	r.HandleFunc("/getrestaurants", handler.MapGooglePlacesToRestaurantsController).Methods("GET", "OPTIONS")
	r.HandleFunc("/getnews", handler.GetNewsController).Methods("GET", "OPTIONS")

	return r
}
