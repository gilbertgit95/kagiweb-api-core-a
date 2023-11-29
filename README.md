# api core (type A)
> **Note**
This app is still on its early stage of development

This is an express middleware package containing features of a rest api. The main purpose is to create application without having to deal with the core functionality like authentication, user management and other essential features of an account base system. Your responsibility will be focus only to the application content.


## Dependencies
Please make sure that you already have software dependencies installed before you proceed, the versions we use at the time of developement are: **Node v18.13.0** and **MongoDB 6.0.8**.

| Softwares   | Languages                | Packages    |
|-------------|--------------------------|-------------|
| `Node`      | `Javascript/Typescript`  | `Mongoose`  |
| `MongoDB`   |                          | `Express`   |



## Quick Setup
### .env
You can just copy the configuration below to your .env file. This will work for javascript or typescript application. Update the configuration depending on you needs like mongo connection string, application port and so on.

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
Copy the code to your .js file

```js
const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const appHandler = require('@kagiweb-tech/api-core-a').default;
// const noteRoutes = require('./noteRoutes');
// const taskRoutes = require('./taskRoutes');

// register custom routes
// register public routes
// appHandler.addPublicRoute(noteRoutes)

// register private routes
// appHandler.addPrivateRoute(taskRoutes)

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
Copy the code to you .ts file
```ts
import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import appHandler from '@kagiweb-tech/api-core-a'
// import noteRoutes from './noteRoutes'
// import taskRoutes from './taskRoutes'

// register custom routes
// register public routes
// appHandler.addPublicRoute(noteRoutes)

// register private routes
// appHandler.addPrivateRoute(taskRoutes)

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

### Seeding
Included in this package is a cli application, where you can do admin stuffs such as seed the app with initial data, reset the application and more. The cli will use the configuration of .env file in the current directory. To execute the cli run this on terminal in you root application directory.
```
> ./node_modules/.bin/kwtech-api-admin
```
At this point, you dont have much to do with the api because most of the essential collections in mongodb are empty. To populate the database with initial data.
1. Execute the cli as shown above
2. Select yes and enter to proceed
3. Select Seeder and enter
4. Select yes and enter

After seeding, you can check you mongodb if it was successfully populated with data.

### Execution
This is up to you on how you start the application. Just make sure you have imported and use the library in the right way.


### Swagger API Documentation
After running your app on your local machine, you can access the swagger api documentation on route `http://localhost:5001/api/v1/apidoc/#/`.

If you had customized the .env file, then the route is on `http://localhost:{ APP_PORT }{ ROOT_API_ENDPOINT }apidoc/#/` where **APP_PORT** and **ROOT_API_ENDPOINT** are values from .env file.

> **Note**
We recommend going into api documentation route after setting up and running your application. There, you will see the available routes and detailed documentation provided by this package.


## Tutorials
> **Warning**
Please note that the examples are written in typescript, however you can just convert the code to javascript if you are using plain JS.

### Custom Routes
There are no special syntax for creating routes. You have freedom to create your own as long as it is a valid express route. In this tutorial, we use ready made utilities from this package, but this are optional.
`ErrorHandler` is just a wrapper for handling errors and `routerIdentity` is just an object that will let the application register your custom routes to features collection.

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

to register the custom route to your express app, refer to the code below.

```ts
import appHandler from '@kagiweb-tech/api-core-a'
import noteRoutes from './noteRoutes'
import taskRoutes from './taskRoutes'

...
// register routes
// register public routes
appHandler.addPublicRoute(noteRoutes)
// register private routes
appHandler.addPrivateRoute(taskRoutes)
...
```

### Custom Middleware
As long as it is a valid express middleware it will be good enough.
Refer to the code below to properly register your custom middleware.

```ts
import appHandler from '@kagiweb-tech/api-core-a'
import customMiddleware1 from './customMiddleware1'
import customMiddleware2 from './customMiddleware2'

...
// register middlewares
// register public middlewares
// this will be executed before access checker
appHandler.addPublicMiddleware(customMiddleware1)
// register private middlewares
// this will be executed after access checker
appHandler.addPrivateMiddleware(customMiddleware2)
...
```

### Custom Model
The same as routes, no special syntax is required to create models as long as it is a valid mongoose model. But please **take note** of the mongoose library in the example, it uses mongoose from inside this package.

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
You can just create you own controllers, or just manage your data process inside the routes, its up to you to decide.



### AppEvents
The application emits important events that you could listen. Example is when you request to forgot-password endpoint in which the app will generate otp key that will be use to reset the password. This will let you do anything you want with the otp such as sending it through email or phone.

#### This are the events that this apps emits

| Event Name      | Data                    |     Description                             |
|-----------------|-------------------------|---------------------------------------------|
| `otp-signin`    | device, ip, user, lt    | When signing in and otp signin is enabled   |
| `otp-reset-pass`| device, ip, user, lt    | When you forgot password                    |

#### This are the data passed to the event listener

| Data            |     Description                             |
|-----------------|---------------------------------------------|
| `device`        | Device information or user agent info       |
| `ip`            | IP address                                  |
| `user`          | user account info                           |
| `lt`            | limited transaction info                    |

#### Example
```ts
...
import appHandler, { appEvents } from './app'

const env = appHandler.getEnv()
const appRoutes = appHandler.getAppRoutes()
const app = express().use(appRoutes)

// bind app event callbacks
appEvents.on('otp-signin', (data) => {
    console.log('otp-signin has been emited!: ', data)
    console.log(`otp-signin ${ data.lt.key } key will be sent to ${ data.lt.recipient }`)
})
appEvents.on('otp-reset-pass', (data) => {
    console.log('otp-reset-pass has been emited!: ', data)
    console.log(`otp-reset-pass ${ data.lt.key } key will be sent to ${ data.lt.recipient }`)
})

// start express application
app.listen(env.AppPort, async () => {
...
```



### Request Object
On your router Request Object there are useful data provided by this app.
Depending on the level your router is, you can access this data on the request object.

| Field Name         | Description                                                                                 |
|--------------------|---------------------------------------------------------------------------------------------|
| `userAgentInfo`    | the device that accessing the endpoint. This data is available from level 2 and above       |
| `userData`         | the account that accessing the endpoint. This data is available from level 4 and above      |
| `userActiveWorkspace` | the active workspace of the account that accessing the endpoint. This data is available from level 4 and above |

#### Example
```ts
import express from 'express'
const router = express.Router()

router.get('custom/route', async (req:any, res) => {
  // only available if this route is registered in level 2 and above
  console.log(req.userAgentInfo)

  // only available if this route is registered in level 4 and above
  console.log(req.userData)
  console.log(req.userActiveWorkspace)

  return res.send({})
})
...
```


## References
### App Levels and Main Object
The entire application Contains 5 main levels. Each level accepts router objects.

The Main object implements the app levels. It will register the routes and middlewares into the right levels. To access the main object just import the library.

```ts
import express from 'express'
// appHandler is the main Object
import appHandler from '@kagiweb-tech/api-core-a'

const router = express.Router()
...
```

Each level has its corresponding implementation in the main object methods.

1. `Static level` - Pubic static assets such as images, and other types of files.
    ```ts
      // route is url path,
      // directory is the folder that contains static files you want to be served
      appHandler.addPublicStaticRoute(
        router.use('/route', express.static('directory'))
      )
    ```
2. `Public Middleware` - Middleware that will be executed before access checking.
    ```ts
    // customMiddleware is an express middleware
    appHandler.addPublicMiddleware(customMiddleware)
    ```
3. `Public Routes` - Routes that are accessable to public
    ```ts
    // customRoute is an express route
    appHandler.addPublicRoute(customRoute)
    ```
4. `Private Middleware` - Middleware that will be executed after access checking.
    ```ts
    // customMiddleware is an express middleware
    appHandler.addPrivateMiddleware(customMiddleware)
    ```
5. `Private Routes` - This are routes that user needs access rights before being able to use.
    ```ts
    // customRoute is an express route
    appHandler.addPrivateRoute(customRoute)
    ```


### Models
Mongoose models that are the bases of the core application
- **Feature** - this contains all features that will be the bases of access provider.
  - @kagiweb-tech/api-core-a/models/featureModel
- **Role** - This give users access to features.
  - @kagiweb-tech/api-core-a/models/roleModel
- **User** - application user.
  - @kagiweb-tech/api-core-a/models/userModel
- **Workspace** - this will let users virtually separate data.
  - @kagiweb-tech/api-core-a/models/workspaceModel


### Controllers
Each models has one or more controllers. This are reusable data processors for the models.
- **Feature**
  - @kagiweb-tech/api-core-a/controllers/featureController
- **Role**
  - @kagiweb-tech/api-core-a/controllers/roleController
  - @kagiweb-tech/api-core-a/controllers/roleFeatureController
- **User**
  - @kagiweb-tech/api-core-a/controllers/userClientDeviceAccessTokenController
  - @kagiweb-tech/api-core-a/controllers/userClientDeviceController
  - @kagiweb-tech/api-core-a/controllers/userContactInfoController
  - @kagiweb-tech/api-core-a/controllers/userController
  - @kagiweb-tech/api-core-a/controllers/userLimitedtransactionController
  - @kagiweb-tech/api-core-a/controllers/userPasswordController
  - @kagiweb-tech/api-core-a/controllers/userRoleController
  - @kagiweb-tech/api-core-a/controllers/userUserInfoController
- **Workspace**
  - @kagiweb-tech/api-core-a/controllers/workspaceController
  - @kagiweb-tech/api-core-a/controllers/workspaceUsersController
- **Authentication**
  - @kagiweb-tech/api-core-a/controllers/authController
- **System**
  - @kagiweb-tech/api-core-a/controllers/systemInfoController



### Utilities
- **config** - handles the .env configuration and default values if empty in .env
  - @kagiweb-tech/api-core-a/utils/config
- **dataCache** - handles the server data caching.
  - @kagiweb-tech/api-core-a/utils/dataCache
- **dataCleaner** - cleans some types of data.
  - @kagiweb-tech/api-core-a/utils/dataCleaner
- **dataQuery** - handles some server to database queries with integrated data caching.
  - @kagiweb-tech/api-core-a/utils/dataQuery
- **encryption** - password hashing and checking, base64 encoding and decoding, jwt generation and more.
  - @kagiweb-tech/api-core-a/utils/encryption
- **errorHandler** - handles errors and output a specific format for easy usage in the router.
  - @kagiweb-tech/api-core-a/utils/errorHandler
- **logger** - saves log messages into a file.
  - @kagiweb-tech/api-core-a/utils/logger
- **routerIdentity** - this will identify routes and let the application register it to feature collection.
  - @kagiweb-tech/api-core-a/utils/routerIdentity
