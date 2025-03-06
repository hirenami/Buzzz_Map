DROP TABLE IF EXISTS bookmarks;

CREATE TABLE bookmarks(
	bookmarks_id BINARY(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID())),
	user_id VARCHAR(255) NOT NULL,
	bookmarks_name VARCHAR(255) NOT NULL,
	bookmarks_address VARCHAR(255) NOT NULL,
	bookmarks_latitude FLOAT NOT NULL,
	bookmarks_longitude FLOAT NOT NULL,
	bookmarks_rating FLOAT NOT NULL,
	bookmarks_price_level INT NOT NULL,
	bookmarks_trendkeyword VARCHAR(255) NOT NULL,
	bookmarks_photourl VARCHAR(255) NOT NULL,
	bookmarks_isrealdata BOOLEAN NOT NULL,
	FOREIGN KEY (user_id) REFERENCES user(clerk_user_id)
);