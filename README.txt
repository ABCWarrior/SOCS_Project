## Website URL
The website requires you to be on the McGill VPN and is live at: https://fall2024-comp307-group16.cs.mcgill.ca/

If the website is not running:
```
cd frontend
npm install
cd ../backend
npm install
npm run build
npm run start
```

Please note that the source code is meant to work only on the server, as the api calls will not work if ran locally.

## Team Contributions, for specific files, see the contributors as a comment at the beginning of the file

| Name               | Contributions                                                                             |
|--------------------|-------------------------------------------------------------------------------------------|
| Philip Luo         | Database Setup, User Authentication and Ticket System,                                    |   
|                    |  Email notifications for accept/reject appointment requests,                              |
|                    |  Routes to add/edit/delete bookings, Logic ensuring no dates overlaps,                    |   
|                    |  Registration Api and logic, Login Api and logic, APIs for members to view appointments   |   
|                    |  that were requested, APIs to accept or deny appointment requests,                        |
|                    |  API for users to view a booking given the booking id,                                    |
|                    |  API for users to view all the bookings they have confirmed they are attending,           |
|                    |  Added code to deployement server and ensured that the apis were                          |   
|                    |  called correctly, Helped my team debug extensively their code                            |
|--------------------|-------------------------------------------------------------------------------------------|
| Celia Shi          | Made all the private pages, as well as the request and booked appointment page. Integrated|
|                    | all the API except login, register, logout, landing, and intermediary (so create, book,   |
|                    | modify, request,accept, deny, myBookings, myRequests, bookedAppointments, cancel). Made   |
|                    | the CalendarEvent and SideMenu components.                                                |  
|--------------------|-------------------------------------------------------------------------------------------|
| Aakarsh Dhar       | Did 10% of the backend                                                                    |
|                    | Did API testing through Postman                                                           |
|                    | Made a tester to test functionality                                                       |
|                    | Fixed some API issues on the frontend                                                     |
|                    | Fixed some broken route returns                                                           |
|--------------------|-------------------------------------------------------------------------------------------|
| Louis Alson        | Coded the headers and footers.                                                            |
|                    | Coded most of the public-facing pages and integrated them with the backend, including     |
|                    | login and registration for example.                                                       |
|                    | Styled the website using CSS and made it responsive.                                      |
