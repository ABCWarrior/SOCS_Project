# SOCS Project frontend in React

## To Run
Make sure you have followed the instructions in the main directory readme file

To run the frontend
```
pwd -> SOCS_PROJECT
cd frontend
npm install
npm start
```
If you also need to run the backend:
```
pwd -> SOCS_PROJECT
cd backend
npm install
node app.js
```

### Dates Format
```
The "date" field if the booking is:
  -> Not recurring: YYYY-mm-ddd
  -> Recurring: A day of the week (e.g. Monday, Tuesday, ...)

The "startTime" and "endTime" fields should be:
  -> Format: HH:mm
```

### Login Api
When you hit the /login api, you receive the following data:
```
  "message": "SOME MESSAGE",
  "token": "THE TICKET TO KEEP YOU LOGGED IN",
  "id": "LOGIN ID"
```
The id is the specific url you need to redirect your page too for the dashboard of the logged in member.
