# Seidor Backend Test - API Mobility

## Table of Contents
- [Overview](#overview)
- [Requirements](#requirements)
- [Running the Project](#running-the-project)
- [Testing](#testing)
- [Screenshots](#screenshots)

## Overview
This project is a backend API for managing a fleet of vehicles and drivers.  <br> 
<b>API Mobility</b> project is designed to manage vehicles, drivers, and their usage records. This API is built using <b>Node.js</b>, <b>Typescript</b>, <b>Docker</b> and <b>Docker Compose</b> to containerize application, <b>Express</b>, <b>express-validator</b> lib to validate body of requests, <b>Jest</b> for unit tests, and <b>TypeORM</b>, and it uses <b>PostgreSQL</b> as the database.

## Requirements
- Docker
- Docker Compose
- Node.js
- npm / yarn
- PostgreSQL


## Running the Project
##### Obs: You can run this project just using ```docker-compose up --build``` and ignore the bellow steps, by default project runs on ```PORT 3000```.

 - use ```npm instal``` or ```yarn instal``` to install dependencies
 - generate ```.env``` file based on values from ```.env.example```
 - run ```npm migration:run``` to create tables on database
 - run ```npm run dev``` to start project

## Testing
  After start up the project you can access ```localhost:3000/api-docs``` to see a documentation based on Swagger and test all of endpoints. 
  This projects has a unit tests and you can run that using the command ```npm run test```. Below are screenshots of the documentation and unit test results.

  <img src="https://i.ibb.co/RjxzKWj/f216908b-d67e-4277-88fb-298944dd66a9.jpg" alt="Unit tests result">
  <hr>
  <hr>
  <hr>
  <img src="https://i.ibb.co/dJPf3kW/ddb35676-9980-4e61-9b4a-e69d27750601.jpg" alt="Unit tests result">
