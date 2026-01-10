# Introduction

media-club-api is a Rust project that implements an AWS Lambda function in Rust.

## Prerequisites

- [Rust](https://www.rust-lang.org/tools/install)
- [Cargo Lambda](https://www.cargo-lambda.info/guide/installation.html)
- [Make](https://www.gnu.org/software/make)
- [Docker](https://www.docker.com/)

### Database connection
In order to fully use the api, you must be running the dynamodb instance on your local computer

To start the db instance in Docker, you can use one of the following commands, both do the same thing

```bash
make db
OR
docker run -d -p 8000:8000 amazon/dynamodb-local
```
This will start up the dynamo db instance in docker

After this though, there are not any tables setup in your local dynamodb instance

To fix this, you can run the following command

```bash
make seed TABLE=tableName
```
At the moment due to security concerns, this requires having scanned json data of the tables. Please reach out to me (@Bmoel) to help get this data

## Application Setup
In order to test the application locally, you will need to do the following
1) Turn on Docker for your OS
2) Run `make db`
3) Run `make seed TABLE=x ; make seed TABLE=y`
   - Where x and y are the application table names, not listed here for security reasons. Read [Database connection](#database-connection) for more details
4) Run `make dev`
   - This will start the lambda local server for the application
5) Start development server for frontend application. Read [here](https://github.com/Bmoel/media-club/tree/main/apps/web-ui) for more details
6) Navigate to `http://localhost:5173/` to see the application

## Testing API

If you want to run integration tests locally, you can use `cargo lambda watch`

First, run `cargo lambda watch` to start a local server. When you make changes to the code, the server will automatically restart.

Second, you'll need a way to pass the event data to the lambda function.

For HTTP events, you can also call the function directly with cURL or any other HTTP client. For example:

```bash
curl http://localhost:9000/lambda-url/media-club-api/endpoint
```
You can use the makefile `query` command to more easily query the running api
```bash
make query URL=endpoint
```

## Building

To build the project for production, run `cargo lambda build --release`. Remove the `--release` flag to build for development.

Read more about building your lambda function in [the Cargo Lambda documentation](https://www.cargo-lambda.info/commands/build.html).

## Deploying

To deploy the project, run `cargo lambda deploy`. This will create an IAM role and a Lambda function in your AWS account.

Read more about deploying your lambda function in [the Cargo Lambda documentation](https://www.cargo-lambda.info/commands/deploy.html).

## Extra
Read more about running the local server in [the Cargo Lambda documentation for the `watch` command](https://www.cargo-lambda.info/commands/watch.html).