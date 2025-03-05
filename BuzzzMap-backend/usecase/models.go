package usecase

type Trend struct {
	TrendsName               string `json:"keyword"`
	TrendsLocation           string `json:"location"`
	TrendsRank               int32  `json:"rank"`
	TrendsEndtimestamp       int32  `json:"end_timestamp"`
	TrendsIncreasePercentage int32  `json:"increase_percentage"`
}

type Restaurant struct {
	ID           string  `json:"id"`
	Name         string  `json:"name"`
	Address      string  `json:"address"`
	Lat          float64 `json:"lat"`
	Lng          float64 `json:"lng"`
	Rating       float64 `json:"rating"`
	PriceLevel   int     `json:"price_level"`
	TrendKeyword string  `json:"trendkeyword"`
	PhotoURL     string  `json:"photo_url"`
	IsRealData   bool    `json:"is_real_data"`
}