package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"os"

	_ "github.com/go-sql-driver/mysql"
	"github.com/hirenami/Buzzz_Map/BuzzzMap-backend/dao"
	"github.com/hirenami/Buzzz_Map/BuzzzMap-backend/handler"
	"github.com/hirenami/Buzzz_Map/BuzzzMap-backend/sqlc"
	"github.com/hirenami/Buzzz_Map/BuzzzMap-backend/usecase"
	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load("../../.env")
	if err != nil {
		log.Fatal("Error loading .env file")
	}
	mysqlUser := os.Getenv("MYSQL_USER")
	mysqlUserPwd := os.Getenv("MYSQL_PASSWORD")
	mysqlDatabase := os.Getenv("MYSQL_DATABASE")
	mysqlHost := os.Getenv("MYSQL_HOST")

	if mysqlUser == "" || mysqlUserPwd == "" || mysqlDatabase == "" || mysqlHost == "" {
		log.Fatal("fail :Getenv")
	}

	dsn := fmt.Sprintf("%s:%s@unix(/cloudsql/%s)/%s?parseTime=true",
		mysqlUser, mysqlUserPwd, mysqlHost, mysqlDatabase)

	// データベース接続
	db, err := sql.Open("mysql", dsn)
	if err != nil {
		log.Fatalf("Failed to open database: %v", err)
	}

	if err := db.Ping(); err != nil {
		log.Fatalf("fail: db.Ping, %v\n", err)
	}
	defer db.Close()

	_db := sqlc.New(db)
	Dao := dao.NewDao(db, _db)
	Usecase := usecase.NewUsecase(Dao)
	Handler := handler.Newhandler(Usecase)

	r := handler.SetupRoutes(Handler)

	log.Println("Listening...")
	if err := http.ListenAndServe(":8080", r); err != nil {
		log.Fatal(err)
	}

}
