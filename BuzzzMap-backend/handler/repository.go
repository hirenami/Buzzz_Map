package handler

import (
	"net/http"
	"os"

	"github.com/hirenami/Buzzz_Map/BuzzzMap-backend/usecase"
)

type Handler struct {
	Usecase *usecase.Usecase
}

func Newhandler(usecase *usecase.Usecase) *Handler {
	return &Handler{
		Usecase: usecase,
	}
}

func setCORSHeaders(w http.ResponseWriter) {
	host := os.Getenv("LOCALHOST")

	w.Header().Set("Access-Control-Allow-Origin", host)
	w.Header().Set("Access-Control-Allow-Methods", "POST, GET, PUT, PATCH, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
	w.Header().Set("Access-Control-Allow-Credentials", "true")
}
