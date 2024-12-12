# SOCS Server Project

## To Get Started
### Install Node.js
```
# installs nvm (Node Version Manager)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.0/install.sh | bash

# download and install Node.js (you may need to restart the terminal)
nvm install 22

# verifies the right Node.js version is in the environment
node -v # should print `v22.12.0`

# verifies the right npm version is in the environment
npm -v # should print `10.9.0`
```
If you already have npm, use nvm to change version.

### Install dotenv and create a .env file (for easily getting your api keys)
```
touch .env
npm install dotenv
```
Then, set your environment variables for you preferences:
```
FRONTEND_PORT = <PORT_NUMBER>
BACKEND_PORT = <PORT_NUMBER>

MONGO_URI = <URI>
MONGO_USER = <USER>
MONGO_PASS = <PASS>
MONGO_DATABASE_NAME = <DATABASE_NAME>  
MONGO_MEMBERS_COLLECTION = <COLLECTION_MEMBERS_NAME>
MONGO_TOKENS_COLLECTION = <COLLECTIONS_TOKEN_NAME>
MONGO_BOOKINGS_COLLECTION = <COLLECTIONS_BOOKINGS_NAME> 
MONGO_REQUEST_APPOINTMENTS_COLLECTION = <COLLECTION_REQUEST_APPOINTMENTS>
```

