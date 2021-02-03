# Goco Test - API
This is the backend part of the goco test.\
This REST API was build in Node/Express and using Firebase Authentication and Realtime Database.

This is hosted on [Heroku](https://goco-test-api.herokuapp.com/).

## Endpoints
- /register
- /login
- /sign-out
- /reset-password

# Setup

Clone this project and run 

### `npm i`

To install the npm dependencies. Then start the server:

### `npm run start`

The server is live at [http://localhost:5000](http://localhost:5000).

## Env variables

These are the variables that needs to be specify in a `.env` file:

- FIREBASE_API_KEY
- FIREBASE_AUTH_DOMAIN
- FIREBASE_DATABASE_URL
- FIREBASE_PROJECT_ID
- FIREBASE_STORAGE_BUCKET
- FIREBASE_MESSAGING_SENDER_ID
- FIREBASE_API_ID
