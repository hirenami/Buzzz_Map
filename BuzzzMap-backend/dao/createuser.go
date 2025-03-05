package dao

import (
	"context"
	"database/sql"
)

func (d *Dao) CreateUser(ctx context.Context, tx *sql.Tx, id string) error {
	txQueries := d.WithTx(tx)

	return txQueries.CreateUser(ctx, id)

}
