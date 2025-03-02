package usecase

type Trend struct {
	TrendsName               string `json:"trends_name"`
	TrendsLocation           string `json:"trends_location"`
	TrendsRank               int32  `json:"trends_rank"`
	TrendsEndtimestamp       int32  `json:"trends_endtimestamp"`
	TrendsIncreasePercentage int32  `json:"trends_increase_percentage"`
}