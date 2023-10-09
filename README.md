# api core (type A)
 > Project: kagiweb-api-core-a  
 > Created: Gilbert D. Cuerbo, 2021


## Contents  
- [Overview](#overview)
- [Dependencies](#dependencies)
- [Quick Setup](#Quicksetup)
- [Features](#features)
- [Installation](#installation)
- [Architecture](#architecture)


## Overview
This an express middleware package containing core features of a rest api. The main purpose is to create
application without having to deal with the core functionality like authentication, user management and other
essential features of an acount base system. Your responsibility will be focus only to the application content.


## Dependencies

| Softwares | Languages              | Packages  |
|-----------|------------------------|-----------|
| Node      | Javascript/Typescript  | Mongoose  |
|           |                        | Express   |
|


## Quick Setup
### .env
You can just copy and paste the configuration below to your applications .env file. This will work for javascript or typescript application.

```
# this will control environment settings for
# production, staging, development or other types of execution: PROD, STAGING, DEV
APP_ENV=PROD
# the default port this server will ran
APP_PORT=5000

# administrator confirm key for administrative scripts
APP_ADMIN_CONFIRM_KEY=MCMXCV


# default settings
# number of items per page for each list request in an endpoint
DEFAULT_PAGINATION=100
# lt limit is per number of attempts (LT - limited transaction)
DEFAULT_USER_LT_LIMIT=5
# lt exp is in munites
DEFAULT_USER_LT_EXP=15


# mongo connection string
# Note! mongo connection string should contain the database name
#       so that moogose can create the database if it not yet created
PROD_MONGO_URI=mongodb://127.0.0.1:27017
PROD_MONGO_DB_NAME=kagiweb

STAGING_MONGO_URI=mongodb://127.0.0.1:27017
STAGING_MONGO_DB_NAME=kagiweb_staging

DEV_MONGO_URI=mongodb://127.0.0.1:27017
DEV_MONGO_DB_NAME=kagiweb_dev


# log options
ROOT_LOGS_DIR=logs
# will contain web app application
ROOT_WEBAPP_DIR=webapp
# will contain api assets
ROOT_ASSETS_DIR=assets
# is the root webapp route
ROOT_WEBAPP_ENDPOINT=/
# is the root assets route
ROOT_ASSETS_ENDPOINT=/api/assets/
# the api root for core endpoints
ROOT_API_ENDPOINT=/api/v1/


# Auth jwt settings
# in hours
JWT_EXPIRATION=168
JWT_SECRET_KEY=6f870c45c861792aee34b705092da91e31b03b72bc352452adbd069007aa3e2ae8b43900c69fcc5daa0e0ebb704ed7059aed34c565e50efc29cb7ab371548383


# sms credentials

# email credentials
```

### Javascript

```
```

### Typescript
```
```

## Features
Why we should use this boilerplate? below are some of its features
- easy to setup
- ready to use utilites, endpoints and data models like:  **features**,  **roles**, **users**, **administration**,
  **secure login** and more. You dont need to implement most of the core features because its included.


## Installation
To succesfully run the application. please follow the steps below and please take note of the app versions
and configurations. App configuration resides inside the .env file in the root folder.

### Software dependencies
- make sure a mongodb server is installed. At the time of development mongodb version
  is `6.0.8`
- make sure node and npm are installed on you machine. At the time of development node version
  is `v18.13.0` and npm is `8.17.0`
 
### Configuration
- this section will be updated soon...
```

```
- copy a predefined .env format to your .env file of your application.
- update .env configuration for your on needs, such as mongo connection string and so on.

### Initialization
- this section will be updated soon...
- run this command on a terminal in the root folder of the application ```npm run admin```, then select reset app. This will
  initialize the database, collections and data. **Note!** if you already have existing database all your
  data will be lost.

### How to use
- this section will be updated soon...
```
import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import appHandler from '@kagiweb-tech/api-core-a'

const env = appHandler.getEnv()
const appRoutes = appHandler.getAppRoutes()
const app = express().use(appRoutes)

app.listen(env.AppPort, async () => {
    try {
        await appHandler.dbConnect()
        console.log(`- Successfully connected to database`)
        await appHandler.executePostDBConnectionProcess()
        console.log(`- Execute post db conection process`)
    } catch (err) {
        console.log(`!Error, was not able to connect to the mongo database: ${ err }`)
        // throw(err)
    }
    console.log(`- Server is running on port: ${ env.AppPort }`)
})
```
- this section will be updated soon...
- run by typing `npm start` or for development `npm run dev`
- open a browser, then goto localhost:**port** to view the webapp. **port** is the port number inside the
  .env file.

### Note!
**On development**.


## Architecture
inprogress...