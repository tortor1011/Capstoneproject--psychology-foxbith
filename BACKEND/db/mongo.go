package db

import (
	"context"
	"os"
	"time"

	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"

	"BACKEND/model"
)

var Ctx context.Context

func ConnectMongo() (*mongo.Client, error) {
	_ = godotenv.Load()
	mongoURI := os.Getenv("MONGODB_URI")
	if mongoURI == "" {
		return nil, ErrEnvNotSet
	}

	clientOptions := options.Client().ApplyURI(mongoURI)
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	client, err := mongo.Connect(ctx, clientOptions)
	if err != nil {
		return nil, err
	}
	if err = client.Ping(ctx, nil); err != nil {
		return nil, err
	}
	return client, nil
}

var ErrEnvNotSet = &EnvError{"MONGODB_URI not set in .env file"}

type EnvError struct {
	s string
}

func (e *EnvError) Error() string {
	return e.s
}

func SaveAssessment(client *mongo.Client, assessment *model.AssessmentResult) error {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	collection := client.Database("test").Collection("assessments")
	_, err := collection.InsertOne(ctx, assessment)
	return err
}

func GetAllAssessments(client *mongo.Client) ([]model.AssessmentResult, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	collection := client.Database("test").Collection("assessments")
	cursor, err := collection.Find(ctx, struct{}{})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var results []model.AssessmentResult
	for cursor.Next(ctx) {
		var result model.AssessmentResult
		if err := cursor.Decode(&result); err != nil {
			return nil, err
		}
		results = append(results, result)
	}
	if err := cursor.Err(); err != nil {
		return nil, err
	}
	return results, nil
}