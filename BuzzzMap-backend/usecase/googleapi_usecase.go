package usecase

import (
	"context"
	"github.com/hirenami/Buzzz_Map/BuzzzMap-backend/util"
)

func (u *Usecase) WritedataUsecaase(ctx context.Context, userID string, EventType string, listingID string) error {
	err := u.api.Writedata(ctx, userID, EventType, listingID)
	if err != nil {
		return err
	}
	return nil
}

func (u *Usecase) PredictdataUsecase(ctx context.Context, userID string, number int) ([]int, error) {
	_, err := u.api.GetPredicts(ctx, userID)
	if err != nil {
		return nil, err
	}

	data ,err := util.GeneratePredict(userID, number)
	if err != nil {
		return nil, err
	}

	return data, nil
}
