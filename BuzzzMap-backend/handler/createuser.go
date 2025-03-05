package handler

import (
	"context"
	"net/http"
)

func (h *Handler) CreateUserController(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodOptions {
		setCORSHeaders(w)
		w.WriteHeader(http.StatusOK)
		return
	}

	setCORSHeaders(w)

	ctx := context.Background()

	id := r.URL.Query().Get("id")

	err := h.Usecase.CreateUserUsecase(ctx, id)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}
