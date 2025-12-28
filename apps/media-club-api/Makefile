.PHONY: db seed run

# Start DynamoDB Local
db:
	docker run -d -p 8000:8000 amazon/dynamodb-local

# Seed the given table
seed:
	cargo run --bin seed_local_db -- $(TABLE)

# Run the local API
dev:
	cargo lambda watch

# Query the lambda api
query:
	curl http://localhost:9000/lambda-url/media-club-api/$(URL)