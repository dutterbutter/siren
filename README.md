# siren
[![CircleCI](https://circleci.com/gh/dutterbutter/siren/tree/master.svg?style=svg&circle-token=74f33260054bc7e1d1c8f922b91558634df11cea)](https://circleci.com/gh/dutterbutter/siren/tree/master)

Conversational chatbot for reminders using Facebook messenger and Dialogflow.

## Prerequisites

- Facebook account
- Facebook page
- DialogFlow account

## Install

```
git clone <repo>
```

```
npm install
```

## Usage 

> First set up an .env file that looks similiar to this: 

```
FB_PAGE_ACCESS=<YOUR_PAGE_ACCESS_TOKEN>
FB_VERIFY_TOKEN=<YOUR_VERIFY_TOKEN>
FB_APP_SECRET=<YOUR_FB_SECRET_TOKEN>
DIALOG_FLOW_TOKEN=<YOUR_DIALOGFLOW_TOKEN>
```

> To run locally:

```
node index.js
```

> To run with docker:

Add the following to your `.env` file:

```
MONGO_CONNECTION_STRING=mongodb://mongo:27017/data
```

> Then run: 

```
docker-compose up --build
```

Use [ngrok](https://ngrok.com/) for development, as Facebook requires https.
 