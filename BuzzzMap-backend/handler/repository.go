package handler

import (
	"net/http"
	"os"

	"log"

	"github.com/hirenami/Buzzz_Map/BuzzzMap-backend/usecase"
	"github.com/joho/godotenv"
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
	env := godotenv.Load()
	if env != nil {
		log.Fatal("Error loading .env file")
	}
	host := os.Getenv("LOCALHOST")

	w.Header().Set("Access-Control-Allow-Origin", host)
	w.Header().Set("Access-Control-Allow-Methods", "POST, GET, PUT, PATCH, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
	w.Header().Set("Access-Control-Allow-Credentials", "true")
}
