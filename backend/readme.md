# SOCS Project backend in Express.js 

## To run
```
npm install
npm run dev
```

## ToDo
1) Working on registration and login [Done]
  - Create registration api [Done]
  - create login verification api 
    - Create redirection after successful login [Let frontend handle the redirection to dashboard]
    - Could add hashing to the password on registration
  - Create tokens to reduce members multiple login [Done]
    - Add token as response message on login [Done]
    - Add time to live to token [Done]

2) Working on private pages API [Done for now]
  - Dashboard service to view all bookings [Done]
  - Create Booking service 
    - Add authentication [Done]
    - Add option to create booking [Done]
    - Add code/url to be sent back for booking [Done]
    - Need to add the one-time or recurring booking field [Done -> date field should either be a day of the week, of a specific date]
    - Need to store the URL for ease of sharing [Done -> we generate it instead when the public user needs it]
    - Need to send back both the URL and the code (database id) [Done]
  - Edit Booking service [Done for now]
    - Add authentication [Done]
    - Add option to edit booking [Done]
    - Could add email notification on booking edit 
  - Delete Booking service [Done for now]
    - Add authentication [Done]
    - Could add email notification on booking deletion
  - Request appointments service [Done for now] 
    - Add authentication [Done]
    - Add option to confirm request for extra booking [Done]
    - Could add email notification on accept or reject request
  - Need to also allow a member to book an appointment without it being public info [Implement this as a features if time allows]
    - Remove from email guests database if an account is created with said email
    - Need to add other members booking that you've accepted as part of your bookings
  - Need to show in your created bookings who has accepted your bookings

3) Create dynamically generated bookings url [Done]
  - Create get api to see the booking with unique id [Done]
  - Create post api to accept the request with unique id [Done]

4) Not logged in user api: [Done]
  - If an account is created, remove from new account email from guest emails [Implement if time allows]
  - Create semi-private page to display all the accepted bookings of a not logged in user using as input an email [Done]

5) Add logic to handle the query with only booking id
 

## Issues
- Issue when connecting to mongodb -> failure to connect [Fixed]
- On successful login, who should handle the redirection (frontend or backend)? [Up to design decision -> I think frontend should handle this]
