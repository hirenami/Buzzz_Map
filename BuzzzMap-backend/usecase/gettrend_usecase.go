package usecase

import (
	"context"
	"log"
)

func (u *Usecase) GetTrend (ctx context.Context) ([]Trend, error) {
	tx, err := u.dao.Begin()
	if err != nil {
		return nil, err
	}

	trends, err := u.dao.GetTrend(ctx, tx)
	if err != nil {
		if rbErr := tx.Rollback(); rbErr != nil {
			log.Printf("ロールバック中にエラーが発生しました: %v", rbErr)
		}
		return nil, err
	}

	if err := tx.Commit(); err != nil {
		return nil, err
	}

	UsecaseTrends := make([]Trend, len(trends))

	for i, trend := range trends {
		UsecaseTrends[i] = Trend{
			TrendsName:               trend.TrendsName,
			TrendsLocation:           trend.TrendsLocation,
			TrendsRank:               trend.TrendsRank,
			TrendsEndtimestamp:       trend.TrendsEndtimestamp,
			TrendsIncreasePercentage: trend.TrendsIncreasePercentage,
		}
	}

	return UsecaseTrends, nil
}
