# SOCS Project backend in Express.js 

## To run
```
npm install
npm run dev
```

### Dates Format
```
The "date" field if the booking is:
  -> Not recurring: YYYY-mm-ddd
  -> Recurring: A day of the week (e.g. Monday, Tuesday, ...)

The "startTime" and "endTime" fields should be:
  -> Format: HH:mm
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

2) Working on private pages API [Done -> Pending appointments request implementation and emails notifcations tests]
  - Dashboard service to view all bookings [Done && Tested]
  - Create Booking service [Done]
    - Add authentication [Done]
    - Add option to create booking [Done]
    - Add code/url to be sent back for booking [Done]
    - Need to add the one-time or recurring booking field [Done -> date field should either be a day of the week, of a specific date]
    - Need to store the URL for ease of sharing [Done -> we generate it instead when the member/user needs it]
    - Need to send back both the URL and the code (database id) [Done]
  - Edit Booking service [Done && Tested]
    - Add authentication [Done]
    - Add option to edit booking [Done]
    - Add email notification on booking edit [Done]
  - Delete Booking service [Done && Tested]
    - Add authentication [Done]
    - Add email notification on booking deletion [Done]
  - Request appointments service [Done -> Pending appointments request implementation]
    - Add authentication [Done]
    - Add option to confirm request for extra booking [Done]
    - Add email notification on accept or reject request [Done] Need to add other members booking that you've accepted as part of your bookings [Will implement if time allows]
  - Need to show in your created bookings who has accepted your timeslots [Done]

3) Create dynamically generated bookings url [Done && Tested]
  - Create get api to see the booking with unique id [Done]
  - Create post api to accept the request with unique id [Done]

4) Not logged in user api: [Done]
  - If an account is created, remove from new account email from guest emails [Implement if time allows]
  - Create semi-private page to display all the accepted bookings of a not logged in user using as input an email [Done]

5) Add api to sign up for appointments 
  - Need login if you're a member to show all bookings in Booked Timeslots -> query all confi [Done] (Secure API takes your login email | Non-Secure API lets you type in email)
  - Add api to confirm attendance [Subscribe user to any booking they confirm attendance to]
  - Add api to request new appointment [Done]
  - Need to also allow a member to book an appointment without it being public info [For now, typing an email in the search bar for confirmed timeslots query all of them for a user, and requires login if the email is from a member]

6) Deploy website on SOCS Server

## Issues
- Issue when connecting to mongodb -> failure to connect [Fixed]
- On successful login, who should handle the redirection (frontend or backend)? [Up to design decision -> I think frontend should handle this]
- We need to allow edit of dates for bookings so that they can be changed to a different date [Fixed]
  -> The editBookingService function now verifies if the date from the previous booking and the new booking are the same and the determines overlaps accordingly 
- We need to also be able to make the conversion from weekdays to actual dates to allow editing and creating new booking to work without overlaps [Fixed]
  -> The overlaps functions now have a conversion to a day of the week if the meeting is meant to be recurring
