package model

type AssessmentResult struct {
	Answers    []int  `json:"answers"`
	TotalScore int    `json:"totalScore"`
	RiskLevel  string `json:"riskLevel"`
	Flagged    bool   `json:"flagged"`
}