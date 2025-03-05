package dao

import (
	"context"
	"database/sql"

	"github.com/kikuchi0790/Buzzz_Map/BuzzzMap-backend/sqlc"
)

func (d *Dao) GetTrend(ctx context.Context, tx *sql.Tx) ([]sqlc.Trend, error) {
	txQueries := d.WithTx(tx)

	return txQueries.GetTrend(ctx)

}
