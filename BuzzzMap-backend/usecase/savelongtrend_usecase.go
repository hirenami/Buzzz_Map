package usecase

import (
	"context"
	"log"
)

func (u *Usecase) SaveLongTrend(ctx context.Context) error {
	tx, err := u.dao.Begin()
	if err != nil {
		return err
	}

	err = u.dao.DeleteLongTrend(ctx, tx)
	if err != nil {

		if rbErr := tx.Rollback(); rbErr != nil {
			log.Printf("ロールバック中にエラーが発生しました: %v", rbErr)
		}
		return err
	}

	queries, err := u.api.GetLongTrend()
	if err != nil {
		return err
	}


	items, err := u.api.CallPerplexityLongAPI(queries)
	if err != nil {
		return err
	}


	for _, item := range items {
		err := u.dao.SaveLongTrend(ctx, tx, item.Query, item.Location, item.Months, item.IncreasePercentage)
		if err != nil {
			if rbErr := tx.Rollback(); rbErr != nil {
				log.Printf("ロールバック中にエラーが発生しました: %v", rbErr)
			}
			return err
		}
	}

	// トランザクションをコミット
	if err := tx.Commit(); err != nil {
		return err
	}

	return nil
}
