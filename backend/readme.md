# SOCS Project backend in Express.js 

## To run
```
npm install
node app.js
```

## ToDo
1) Working on registration and login
  - Create registration api [Done]
  - create login verification api [Done]
    -> Could add hashing to the password on registration
  - Create tokens to reduce members multiple login [Done]
    -> Add token as response message on login [Done]
    -> Add time to live to token [Done]
  - Create bookings logic for when logged in (api and database)
    -> create bookings collection
    -> create bookings api
  - Create bookings logic for when logged out (api and database)
    -> create bookings collection
    -> create bookings api

## Issues
- Issue when connecting to mongodb -> failure to connect [Fixed]
