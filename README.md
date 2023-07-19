# Kagiweb api core (type A)
 > Project: kagiweb-api-core-a  
 > Created: Gilbert D. Cuerbo, 2021


## Contents  
- [Overview](#overview)
- [Features](#features)
- [Installation](#installation)
- [Architecture](#architecture)


## Overview
This repository contains the backend part of a web application. The main purpose of this repo is tobe an api
base code application, so we dont need to create a new app from scratch everytime we develop a web api. The main
technology use in this app are NodeJS, Typescript, ExpressJS, Mongoose, Mongo DB.


## Features
Why we should use this boilerplate? below are some of its features
- easy to setup
- use of the best technologies like, **Typescript**, **ExpressJS**, **Mongo DB**,, **JEST** (testing), and **Jswagger** (for api documentation).
- ready to use utilites, endpoints and data models like: **users**, **roles**, **administration**,
  **secure login** and more. You dont need to implement most of the core features because its included.


## Installation
To succesfully run the application. please follow the steps below and please take note of the app versions
and configurations. App configuration resides inside the .env file in the root folder.

### Software dependencies
- make sure a mongodb server is installed. At the time of development mongodb version
  is `6.0.8`
- make sure node and npm are installed on you machine. At the time of development node version
  is `v18.13.0` and npm is `8.17.0`
- Clone this repo to you local machine
- install app dependencies by running `npm i`
 
### Configuration
- open .env file from the root folder of this repository
- change the database settings to your current installed db settings. You can just leave the other settings unchange.
  
### Initialization
- run this command on a terminal in the root folder of the application ```npm run admin```, then select reset app. This will
  initialize the database, collections and data. **Note!** if you already have existing database all your
  data will be lost.

### Execution
- run by typing `npm start` or for development `npm run dev`
- open a browser, then goto localhost:**port** to view the webapp. **port** is the port number inside the
  .env file.

### Note!
**For Security Purposes**. Please do not include the **.env** file from git. The .env file here is
just a example format for this app.


## Architecture
inprogress...