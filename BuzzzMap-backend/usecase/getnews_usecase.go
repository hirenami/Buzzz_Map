package usecase

import (
	"context"
	"github.com/kikuchi0790/Buzzz_Map/BuzzzMap-backend/api"

)

func (u *Usecase) GetNewsUsecase(ctx context.Context,query string) ([]api.NewsArticle, error) {
	news, err := u.api.GetNews(query)
	if err != nil {
		return nil, err
	}

	return news, nil
}
