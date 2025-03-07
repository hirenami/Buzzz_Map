package usecase

import (
	"context"
	"strconv"

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
	trends, err := u.api.GetPredicts(ctx, userID)
	if err != nil {
		return nil, err
	}

	if len(trends) <= 3 {

		data, err := util.GeneratePredict(userID, number)
		if err != nil {
			return nil, err
		}

		return data, nil

	}

	trendsInt := make([]int, len(trends))
	for i, trend := range trends {
		trendsInt[i], err = strconv.Atoi(trend)
		if err != nil {
			return nil, err
		}
	}

	return trendsInt, nil
}
