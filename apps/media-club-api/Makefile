.PHONY: db seed run

# Start DynamoDB Local
db:
	docker run -d -p 8000:8000 amazon/dynamodb-local

# Seed the media table
seed:
	cargo run --bin seed_local_db -- $(TABLE)

# Run the local API
dev:
	cargo lambda watch