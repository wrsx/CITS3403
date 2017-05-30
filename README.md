# CITS3403 Project

## Installation

### Install Express
```
npm install -g express-generator
```

### Install nodemon
```
npm install -g nodemon
```

### Install dependencies
CD To the CITS3403 directory and run:
```
npm install
```

### Install mongoDB & Using MongoDB
REMOTE
```
Application is already setup to run with a remote database.

Remote DB URI: 'mongodb://erklik:tusif556571@ds147681.mlab.com:47681/cits3403mac'


LOCAL
```
Open db.js in the 'routes' directory.

Comment out the remote DB URI.
Uncomment the local DB URI.

After adding mongod to PATH, create a data directory.

md \data
```

md \data\db
```
Start mongod
```
mongod
```
### Import unit data to the DB
Copy the CSV file to MongoDB /bin/ and run:
```
mongoimport -d CITS3403 -c units --type csv --file units.csv --headerline
```
### Start the server
```
nodemon npm start
```
or
```
npm start
```
Currently opens on port 3000, access on:
http://127.0.0.1:3000/
