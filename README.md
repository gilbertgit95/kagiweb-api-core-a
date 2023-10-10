# api core (type A)
> **Note**
this app is still on the early stage of development

This an express middleware package containing features of a rest api. The main purpose is to create application without having to deal with the core functionality like authentication, user management and other essential features of an acount base system. Your responsibility will be focus only to the application content.


## Dependencies
Please make sure that you already have software dependencies installed before you proceed: **Node** and **MongoDB**.

| Softwares   | Languages                | Packages    |
|-------------|--------------------------|-------------|
| `Node`      | `Javascript/Typescript`  | `Mongoose`  |
| `MongoDB`   |                          | `Express`   |



## Quick Setup
### .env
You can just copy and paste the configuration below to your applications .env file. This will work for javascript or typescript application. Update the configuration depending on you needs like mongo connection string, application port and so on.

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

```js
const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const appHandler = require('@kagiweb-tech/api-core-a').default;
const noteRoutes = require('./noteRoutes');
const taskRoutes = require('./taskRoutes');

// register routes
// register public routes
appHandler.addPublicRoute(noteRoutes)
// register private routes
appHandler.addPrivateRoute(taskRoutes)

const env = appHandler.getEnv();
const appRoutes = appHandler.getAppRoutes();
const app = express().use(appRoutes);

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
});
```

### Typescript
```ts
import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import appHandler from '@kagiweb-tech/api-core-a'
import noteRoutes from './noteRoutes'
import taskRoutes from './taskRoutes'

// register routes
// register public routes
appHandler.addPublicRoute(noteRoutes)
// register private routes
appHandler.addPrivateRoute(taskRoutes)

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

After running the application in your local machine, you can then access the swagger api documentation of the app
in route `http://localhost:5001/api/v1/apidoc/#/`


## Tutorials
> **Warning**
Please note that the examples are written in typescript, you can just convert the code to javascript if you using plain JS

### Custom Routes
No special syntax for creating routes. You have freedom  to create you own routes as long as it is an express route. In this tutorial, we use ready made utilities from this package,
however this are optional.
`ErrorHandler` is just a wrapper to handling errors and `routerIdentity` is just an object will let the application register your custom routes to features collection.

```ts
import express from 'express'

import ErrorHandler from '@kagiweb-tech/api-core-a/utils/errorHandler'
import routerIdentity from '@kagiweb-tech/api-core-a/utils/routerIdentity'

import NoteModel, { INote } from './noteModel'

const router = express.Router()

router.get('/api/v1/notes', async (req, res) => {
    const [result, statusCode] = await ErrorHandler.execute<INote[]>(async () => {
        return await NoteModel.find()
    })

    return res.status(statusCode).send(result)
})

router.post('/api/v1/notes', async (req, res) => {
    const [result, statusCode] = await ErrorHandler.execute<INote>(async () => {
        return await NoteModel.create({
            title: 'good',
            description: 'job'
        })
    })

    return res.status(statusCode).send(result)
})

routerIdentity.addAppRouteObj(router)
export default router
```

### Custom Middlewares
The same as routes, no special syntax is required to create models as long as it is a valid mongoose model. Just `take note` of the mongoose library in the example, it uses mongoose from inside this package.

```ts
import { Schema, model, Document, Types } from '@kagiweb-tech/api-core-a/mongoose'
import { randomUUID } from 'crypto'

interface INote {
    _id?: string,
    title?: string
    description?: string
}

const NoteSchema = new Schema<INote>({
    _id: { type: String, default: () => randomUUID() },
    title: { type: String, required: false},
    description: { type: String, required: false },
}, { timestamps: true })

// create model
const NoteModel = model<INote>('Note', NoteSchema)

export {
    INote
}

export default NoteModel
```

### Custom Controllers
You can just create you own controllers or just manage you process inside routes, its up to you.


## References
### App Levels
The entire application Contains 5 main levels. Each level accepts router objects.
1. `Static level` - static assets such as images, and other types of files
2. `Public Middleware` - middleware that will be executed before user info and access provider middleware is executed
3. `Public Routes` - Public routes will be use in express app after public middlewares but before private middlewares and routes
4. `Private Middleware` -  will be executed after access provider is executed
5. `Private Routes` - the routes that will be guarded by the user info and access provider middleware. In short, if you want to create secured routes then put it here.

### Main Object
The processor that will set up the routes and middleware on the right levels.
- @kagiweb-tech/api-core-a

### Models
This are mongoose models that are the bases of the core application
- Feature - this contains all features that will be the bases of access provider
  - @kagiweb-tech/api-core-a/models/featureModel
- Role - This give users access package
  - @kagiweb-tech/api-core-a/models/roleModel
- User - application user
  - @kagiweb-tech/api-core-a/models/userModel
- Workspace - this will let users virtually separate some data
  - @kagiweb-tech/api-core-a/models/workspaceModel


### Controllers
Each models has one or more controllers depending on the number of sub-documents fields available
- Feature
  - @kagiweb-tech/api-core-a/controllers/featureController
- Role
  - @kagiweb-tech/api-core-a/controllers/roleController
  - @kagiweb-tech/api-core-a/controllers/roleFeatureController
- User
  - @kagiweb-tech/api-core-a/controllers/userClientDeviceAccessTokenController
  - @kagiweb-tech/api-core-a/controllers/userClientDeviceController
  - @kagiweb-tech/api-core-a/controllers/userContactInfoController
  - @kagiweb-tech/api-core-a/controllers/userController
  - @kagiweb-tech/api-core-a/controllers/userLimitedtransactionController
  - @kagiweb-tech/api-core-a/controllers/userPasswordController
  - @kagiweb-tech/api-core-a/controllers/userRoleController
  - @kagiweb-tech/api-core-a/controllers/userUserInfoController
- Workspace
  - @kagiweb-tech/api-core-a/controllers/workspaceController
  - @kagiweb-tech/api-core-a/controllers/workspaceUsersController
- Authentication
  - @kagiweb-tech/api-core-a/controllers/authController
- System
  - @kagiweb-tech/api-core-a/controllers/systemInfoController



### Utilities
- @kagiweb-tech/api-core-a/utils/appHandler
- @kagiweb-tech/api-core-a/utils/config
- @kagiweb-tech/api-core-a/utils/dataCache
- @kagiweb-tech/api-core-a/utils/dataCleaner
- @kagiweb-tech/api-core-a/utils/dataQuery
- @kagiweb-tech/api-core-a/utils/encryption
- @kagiweb-tech/api-core-a/utils/errorHandler
- @kagiweb-tech/api-core-a/utils/logger
