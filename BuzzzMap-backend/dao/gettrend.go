package dao

import (
	"context"
	"database/sql"

	"github.com/hirenami/TrendSpotter/sqlc"
)

func (d *Dao) GetTrend(ctx context.Context, tx *sql.Tx) ([]sqlc.Trend, error) {
	txQueries := d.WithTx(tx)

	return txQueries.GetTrend(ctx)

}
