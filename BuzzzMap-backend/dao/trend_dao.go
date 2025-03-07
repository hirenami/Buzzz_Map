package dao

import (
	"context"
	"database/sql"

	"github.com/hirenami/Buzzz_Map/BuzzzMap-backend/sqlc"
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

func (d *Dao) SaveLongTrend(ctx context.Context, tx *sql.Tx, trendName, trendLocation string, trendmonths, trendIncreasepercentage int32) error {

	args := sqlc.SaveLongTrendParams{
		TrendsName:               trendName,
		TrendsLocation:           trendLocation,
		TrendsMonths:             trendmonths,
		TrendsIncreasePercentage: trendIncreasepercentage,
	}

	return d.WithTx(tx).SaveLongTrend(ctx, args)
}

func (d *Dao) DeleteLongTrend(ctx context.Context, tx *sql.Tx) error {
	txQueries := d.WithTx(tx)

	return txQueries.DeleteLongTrend(ctx)

}

func (d *Dao) GetLongTrend(ctx context.Context, tx *sql.Tx) ([]sqlc.Longtrend,error){
	txQueries := d.WithTx(tx)

	return txQueries.GetLongTrend(ctx)

}