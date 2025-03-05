package usecase

import (
	"context"
)

func (u *Usecase) CreateUserUsecase(ctx context.Context, id string) error {
	tx, err := u.dao.Begin()
	if err != nil {
		return err
	}

	err = u.dao.CreateUser(ctx, tx, id)
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
