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
technology use in this app are NodeJS, ExpressJS, Sequelize, SQL DB. The compatible databases or atleast tested
database use in development are mysql, mssql, sqlite and postgresql.


## Features
Why we should use this boilerplate? below are some of its features
- easy to setup
- use of the best frameworks like, **expressJS**, **sequelize** (ORM), **JEST** (testing), **swagger** (for documentation).
- ready to use utilites, endpoints and data models like: **accounts**, **logging**, **administration**, **secure login** and more. You dont need to
  implement most of the core features because its included on this base app.
- because of ORM, sql database compatibility is flexible, so you can choose **wide range of database server** as long as it
  is supported by squelize.
- use different methods of signing in and logging in, from **bearer authentication** to **External identity login** like: google, microsoft, yahoo, facebook. Note! There are few steps to enable the use of external identity.


## Installation
To succesfully run the application. please follow the steps below and please take note of the app versions
and configurations. App configuration resides inside the .env file in the root folder.

### Software dependencies
- make sure a sql database server is installed
- make sure node and npm are installed on you machine, at the time of development node version
  is `v14.17.0` and npm is `6.14.13`
- Clone this repo to you local machine
- install app dependencies by running `npm i`
- install global app development dependencies by running `npm install -g sequelize-cli nodemon`,
  at the time of development sequelize-cli version is `6.2.0` and nodemon is `2.0.13`
 
### Configuration
- open .env file from the root folder of this repository
- change the database settings to your current installed db settings like: the dialect, username, password,
  host and more. You can just leave the other settings unchange.
- you may need to install or uninstall some npm dependencies if you are using sql server other than postgres. For more instructions
  about this dependencies, please refer to sequelize installation documentation https://sequelize.org/master/manual/getting-started.html
  
### Initialization
- run this command on a terminal in the root folder of the application ```npm run localScript:resetApp```. This will create the database, tables and the initial data. **Note!** if you already have existing database all your data will be lost.

### Execution
- run by typing `npm start` or for development `npm run dev`
- open a browser, then goto localhost:**port** to view the webapp. **port** is the port number inside the .env file.

### Note!
**For Security Purposes**. Please do not include the **.env** file from git. The .env file here is
just a example format for this app.


## Architecture
inprogress...