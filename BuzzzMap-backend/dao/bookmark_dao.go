package dao

import (
	"context"
	"database/sql"

	"github.com/hirenami/Buzzz_Map/BuzzzMap-backend/sqlc"
)

func (d *Dao) CreateBookmark(ctx context.Context, tx *sql.Tx, userID, name, address string, latitude, longitude, rating float64, pricelevel int32, trendkeyword, photourl string, isrealdata bool) error {

	txQueries := d.WithTx(tx)

	args := sqlc.CreateBookmarkParams{
		UserID:                userID,
		BookmarksName:         name,
		BookmarksAddress:      address,
		BookmarksLatitude:     latitude,
		BookmarksLongitude:    longitude,
		BookmarksRating:       rating,
		BookmarksPriceLevel:   pricelevel,
		BookmarksTrendkeyword: trendkeyword,
		BookmarksPhotourl:     photourl,
		BookmarksIsrealdata:   isrealdata,
	}

	return txQueries.CreateBookmark(ctx, args)

}

func (d *Dao) DeleteBookmark(ctx context.Context, tx *sql.Tx, userID, address string, latitude, longitude float64) error {

	txQueries := d.WithTx(tx)

	args := sqlc.DeleteBookmarkParams{
		UserID:             userID,
		BookmarksAddress:   address,
		BookmarksLatitude:  latitude,
		BookmarksLongitude: longitude,
	}

	return txQueries.DeleteBookmark(ctx, args)

}

func (d *Dao) GetBookmark(ctx context.Context, tx *sql.Tx, userID string) ([]sqlc.Bookmark, error) {
	txQueries := d.WithTx(tx)

	return txQueries.GetBookmark(ctx, userID)

}
