package main

import (
	"net/http"
	"os"
)

var path, _ = os.Executable()

// func Index(w http.ResponseWriter, r *http.Request) {
// 	http.ServeFile(w, r, "./client/index.html")
// }

func main() {
	http.Handle("/", http.FileServer(http.Dir("./client")))
	http.ListenAndServe(":8080", nil)
}
