package usecase

import (
	"context"
)

func (u *Usecase) CreateBookmarkUsecase(ctx context.Context, args Bookmark) error {
	tx, err := u.dao.Begin()
	if err != nil {
		return err
	}

	userID := args.UserID
	name := args.Name
	address := args.Address
	latitude := args.Lat
	longitude := args.Lng
	rating := args.Rating
	pricelevel := args.PriceLevel
	trendkeyword := args.Trendkeyword
	photourl := args.PhotoURL
	isrealdata := args.IsRealData

	err = u.dao.CreateBookmark(ctx, tx, userID, name, address, latitude, longitude, rating, int32(pricelevel), trendkeyword, photourl, isrealdata)
	if err != nil {
		if rbErr := tx.Rollback(); rbErr != nil {
			return rbErr
		}
		return err
	}

	if err := tx.Commit(); err != nil {
		return err
	}

	return nil
}

func (u *Usecase) DeleteBookmarkUsecase(ctx context.Context, args Bookmark) error {
	tx, err := u.dao.Begin()
	if err != nil {
		return err
	}
	userID := args.UserID
	address := args.Address
	latitude := args.Lat
	longitude := args.Lng

	err = u.dao.DeleteBookmark(ctx, tx, userID, address, latitude, longitude)
	if err != nil {
		if rbErr := tx.Rollback(); rbErr != nil {
			return rbErr
		}
		return err
	}

	if err := tx.Commit(); err != nil {
		return err
	}

	return nil
}

func (u *Usecase) GetBookmarkUsecase(ctx context.Context, userID string) ([]Restaurant, error) {
	tx, err := u.dao.Begin()
	if err != nil {
		return nil, err
	}

	bookmarks, err := u.dao.GetBookmark(ctx, tx, userID)
	if err != nil {
		return nil, err
	}

	if err := tx.Commit(); err != nil {
		return nil, err
	}

	Restaurant := make([]Restaurant, len(bookmarks))

	for i := range bookmarks {
		bookmarks[i].BookmarksName = Restaurant[i].Name
		bookmarks[i].BookmarksAddress = Restaurant[i].Address
		bookmarks[i].BookmarksLatitude = Restaurant[i].Lat
		bookmarks[i].BookmarksLongitude = Restaurant[i].Lng
		bookmarks[i].BookmarksRating = Restaurant[i].Rating
		bookmarks[i].BookmarksPriceLevel = int32(Restaurant[i].PriceLevel)
		bookmarks[i].BookmarksTrendkeyword = Restaurant[i].Trendkeyword
		bookmarks[i].BookmarksPhotourl = Restaurant[i].PhotoURL
		bookmarks[i].BookmarksIsrealdata = Restaurant[i].IsRealData
	}

	return Restaurant, nil
}
