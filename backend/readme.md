# SOCS Project backend in Express.js 

## To run
```
npm install
node app.js
```

## ToDo
1) Working on registration and login
  - Create registration api [Done]
  - create login verification api 
    - Create redirection after successful login
    - Could add hashing to the password on registration
  - Create tokens to reduce members multiple login [Done]
    - Add token as response message on login [Done]
    - Add time to live to token [Done]
  - Create api for logged in user
    - Dashboard service
    - Create Booking service [Done]
      - Add authentication [Done]
      - Add option to create booking [Done]
    - Edit Booking service [Done]
      - Add authentication [Done]
      - Add option to edit booking [Done]
    - Request appointments service [Done]
      - Add authentication [Done]
      - Add option to confirm request for extra booking [Done]
  - Create bookings logic for when logged out (api and database)
    - create bookings collection
    - create bookings api

## Issues
- Issue when connecting to mongodb -> failure to connect [Fixed]
- On successful login, who should handle the redirection (frontend or backend)?
