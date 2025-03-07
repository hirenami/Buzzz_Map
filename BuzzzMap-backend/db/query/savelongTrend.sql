-- name: SaveLongTrend :exec
INSERT INTO longtrends (trends_name,trends_location,trends_months,trends_increase_percentage) VALUES (?, ?, ?, ?);

-- name: DeleteLongTrend :exec
DELETE FROM longtrends;

-- name: GetLongTrend :many
SELECT * FROM longtrends;