# media-club
Website to document and show statistics from Anilist from media we have watched/read

Code author: [@Bmoel](https://github.com/bmoel)

## Website
Application can be found at the following location: [mediaclub.cool](https://mediaclub.cool)

## Frontend
Can be found in the following folder:  `apps/web-ui`

Built with [React](https://react.dev/)

Anime/Manga/Light novel info fetched with the [Anilist API](https://docs.anilist.co/)

## Backend
Can be found in the following folder: `apps/media-club-api`

Build with [Rust](https://rust-lang.org/)

Compiled into [ARM64](https://en.wikipedia.org/wiki/AArch64) instruction set 

API and route handling configured with [Axum](https://docs.rs/axum/latest/axum/)

## Hosting
Frontend application hosted through [AWS Amplify](https://aws.amazon.com/amplify/)

Backend application hosted as a "lambdalith" in [AWS Lambda](https://aws.amazon.com/lambda/)

User and Media info stored in [DynamoDB Tables](https://aws.amazon.com/dynamodb/)

## Development
If interested in future development, please reach out to [@Bmoel](https://github.com/bmoel)

Instructions for setup can be found in the README files in the individual applications

- [Frontend](https://github.com/Bmoel/media-club/tree/main/apps/web-ui)
- [Backend](https://github.com/Bmoel/media-club/tree/main/apps/media-club-api)