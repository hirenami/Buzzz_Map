package usecase

import (
	"github.com/kikuchi0790/Buzzz_Map/BuzzzMap-backend/api"
	"github.com/kikuchi0790/Buzzz_Map/BuzzzMap-backend/dao"
)

// Usecase構造体
type Usecase struct {
	dao *dao.Dao
	api *api.Api
}

// NewTestUsecase コンストラクタ
func NewUsecase(dao *dao.Dao) *Usecase {
	return &Usecase{
		dao: dao,
		api: api.NewApi(),
	}
}
