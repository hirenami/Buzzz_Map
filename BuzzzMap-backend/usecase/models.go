package usecase

type Trend struct {
	TrendsName               string `json:"keyword"`
	TrendsLocation           string `json:"location"`
	TrendsRank               int32  `json:"rank"`
	TrendsEndtimestamp       int32  `json:"end_timestamp"`
	TrendsIncreasePercentage int32  `json:"increase_percentage"`
}