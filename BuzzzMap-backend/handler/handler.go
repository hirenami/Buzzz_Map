package handler

import "github.com/gorilla/mux"

func SetupRoutes(handler *Handler) *mux.Router {
	r := mux.NewRouter()

	r.HandleFunc("/gettrend", handler.GetTrend).Methods("GET", "OPTIONS")
	r.HandleFunc("/savetrend", handler.SaveTrend).Methods("POST", "OPTIONS")
	r.HandleFunc("/getlongtrend", handler.GetLongTrend).Methods("GET", "OPTIONS")
	r.HandleFunc("/savelongtrend", handler.SaveLongTrend).Methods("POST", "OPTIONS")
	r.HandleFunc("/trigger", handler.TrrigerTrend).Methods("POST", "OPTIONS")
	r.HandleFunc("/getrestaurants", handler.MapGooglePlacesToRestaurantsController).Methods("GET", "OPTIONS")
	r.HandleFunc("/getnews", handler.GetNewsController).Methods("GET", "OPTIONS")
	r.HandleFunc(("/webhook"), handler.WebhookHandler).Methods("POST", "OPTIONS")
	r.HandleFunc("/getbookmark", handler.GetBookmark).Methods("GET", "OPTIONS")
	r.HandleFunc("/createbookmark", handler.CreateBookmark).Methods("POST", "OPTIONS")
	r.HandleFunc("/deletebookmark", handler.DeleteBookmark).Methods("POST", "OPTIONS")
	r.HandleFunc("/writeevent", handler.Writedata).Methods("POST", "OPTIONS")
	r.HandleFunc("/predict", handler.Predictdata).Methods("GET", "OPTIONS")

	return r
}
