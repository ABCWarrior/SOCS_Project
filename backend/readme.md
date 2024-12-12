# SOCS Project backend in Express.js 

## To run
```
npm install
npm run dev
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

2) Working on private pages API 
  - Dashboard service to view all bookings [Done]
  - Create Booking service 
    - Add authentication [Done]
    - Add option to create booking [Done]
    - Add code/url to be sent back for booking [Done]
    - Need to add the one-time or recurring booking field
    - Need to store the URL for ease of sharing 
    - Need to send back both the URL and the code (database id)
  - Edit Booking service
    - Add authentication [Done]
    - Add option to edit booking [Done]
    - Could add email notification on booking edit
  - Delete Booking service
    - Add authentication 
    - Could add email notification on booking deletion
  - Request appointments service [Done for now] 
    - Add authentication [Done]
    - Add option to confirm request for extra booking [Done]
    - Could add email notification on accept or reject request
  - Need to also allow a member to book an appointment without it being public info
    - Could create a database containing only guests emails
    - Remote from email guests database if an account is created with said email
  - Need to add other members booking that you've accepted as part of your bookings
  - Need to show in your created bookings who has accepted it

3) Create dynamically generated bookings url
  - Add an accept and reject bookings and prompt user for their email on accept

4) Create semi-private page to display all the accepted bookings of a not logged in user using as input an email [Done]
  - Create get api to see the booking with unique id [Done]
  - Create post api to accept the request with unique id [Done]
 

## Issues
- Issue when connecting to mongodb -> failure to connect [Fixed]
- On successful login, who should handle the redirection (frontend or backend)?
