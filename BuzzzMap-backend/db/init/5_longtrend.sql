DROP TABLE IF EXISTS longtrends;

CREATE TABLE longtrends(
    trends_id BINARY(16) PRIMARY KEY DEFAULT (UUID_TO_BIN(UUID())),
    trends_name VARCHAR(255) NOT NULL,
    trends_location VARCHAR(255) NOT NULL,
	trends_months INT NOT NULL,
	trends_increase_percentage INT NOT NULL
);
