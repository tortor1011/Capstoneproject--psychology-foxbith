package main

import (
	"BACKEND/db"
	"BACKEND/model"
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"time"

	"go.mongodb.org/mongo-driver/mongo"
)

func assessmentHandler(client *mongo.Client) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var result model.AssessmentResult
		if err := json.NewDecoder(r.Body).Decode(&result); err != nil {
			http.Error(w, "Invalid request", http.StatusBadRequest)
			return
		}
		defer r.Body.Close()

		// Save to MongoDB
		if err := db.SaveAssessment(client, &result); err != nil {
			http.Error(w, "Failed to save assessment", http.StatusInternalServerError)
			return
		}

		// แสดงผลข้อมูลที่รับมา
		fmt.Fprintf(w, "Saved!\n")
		fmt.Fprintf(w, "Answers: %v\n", result.Answers)
		fmt.Fprintf(w, "Total Score: %d\n", result.TotalScore)
		fmt.Fprintf(w, "Risk Level: %s\n", result.RiskLevel)
		fmt.Fprintf(w, "Flagged: %v\n", result.Flagged)
	}
}

func getAssessmentsHandler(client *mongo.Client) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		results, err := db.GetAllAssessments(client)
		if err != nil {
			http.Error(w, "Failed to fetch assessments", http.StatusInternalServerError)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(results)
	}
}

func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}
		next.ServeHTTP(w, r)
	})
}

func main() {
	client, err := db.ConnectMongo()
	if err != nil {
		log.Fatal(err)
	}
	defer func() {
		ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer cancel()
		client.Disconnect(ctx)
	}()

	fmt.Println("Connected to MongoDB!")

	http.Handle("/assessment", corsMiddleware(http.HandlerFunc(assessmentHandler(client))))
	http.Handle("/assessments", corsMiddleware(http.HandlerFunc(getAssessmentsHandler(client))))
	log.Println("Server started at :8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}