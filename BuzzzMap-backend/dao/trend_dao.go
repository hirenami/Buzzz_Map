package dao

import (
	"context"
	"database/sql"

	"github.com/kikuchi0790/Buzzz_Map/BuzzzMap-backend/sqlc"
)

func (d *Dao) SaveTrend(ctx context.Context, tx *sql.Tx, trendName, trendLocation string, trendRank, trendEndtimestamp, trendIncreasepercentage int32) error {

	args := sqlc.SaveTrendParams{
		TrendsName:               trendName,
		TrendsLocation:           trendLocation,
		TrendsRank:               trendRank,
		TrendsEndtimestamp:       trendEndtimestamp,
		TrendsIncreasePercentage: trendIncreasepercentage,
	}

	return d.WithTx(tx).SaveTrend(ctx, args)
}

func (d *Dao) GetTrend(ctx context.Context, tx *sql.Tx) ([]sqlc.Trend, error) {
	txQueries := d.WithTx(tx)

	return txQueries.GetTrend(ctx)

}

func (d *Dao) DeleteTrend(ctx context.Context, tx *sql.Tx) error {
	txQueries := d.WithTx(tx)

	return txQueries.DeleteTrend(ctx)

}

