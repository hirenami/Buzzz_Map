-- name: CreateBookmark :exec
INSERT INTO bookmarks (user_id ,bookmarks_name, bookmarks_address, bookmarks_latitude, bookmarks_longitude, bookmarks_rating, bookmarks_price_level, bookmarks_trendkeyword, bookmarks_photourl, bookmarks_isrealdata) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);

-- name: GetBookmark :many
SELECT * FROM bookmarks WHERE user_id = ?;

-- name: DeleteBookmark :exec
DELETE FROM bookmarks WHERE 
	user_id = ? AND
	bookmarks_address = ? AND
	bookmarks_latitude = ? AND
	bookmarks_longitude = ?
;