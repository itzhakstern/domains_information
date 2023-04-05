## Description

Sonto is a system that combines a REST API server and a scheduling system for information about domains.

The system is written in TypeScript using NestJS as a framework.

The objective of the system is to provide a user interface that allows to retrieval a relevant information through dedicated service integration.

The REST API is built from two endpoints.
- Endpoint to receive GET requests with a domain in the body and does the following:
  - If the domain exists in the system and is in DONE status -> return the information about it.
  - If the domain exists in the system but with PENDING status -> return a message that there is no information about the domain and please come back later to check.
  - If the domain does not exist in the system -> enter it into the system with PENDING status and return a message that there is no information about the domain and please come back later to check.
- Endpoint to receive POST requests with domain in the body of the request and:
  - If the domain exists in the system -> update the status to PENDING.
  - Otherwise, enter it into the system with PENDING status.

In addition, the system has a scheduler that performs the following actions:
- Once per minute, pulls all the domains in PENDING status from the database and runs a scan on them to get the desired information, and updates it in the database.
- Once every 10 minutes, pulls from the database all the domains whose updateAt was before a certain predetermined period of time (by default I set a month) and runs a repeat scan on them to update the information.

Note: For this task I used the object status setting to manage the system, if there is a requirement for the high-scale functioning of the system it would be better to use queues to manage the server and scheduler.

<img width="1136" alt="צילום מסך 2023-04-04 ב-19 58 36" src="https://user-images.githubusercontent.com/83215154/229878426-6ca8ebc9-8e08-479d-807b-abd5057bbc18.png">

## Run on your computer

### Installation
- Make sure you have Node:16, Yarn installed.
- Pull the project from github using git clone
- In the project's main folder, create an .env.stage.dev file according to the shape of .env.stage.dev.example and the deductive values ​​there (note that you must create an ApiKey to use in [VirusTotal](https://support.virustotal.com/hc/en-us/articles/115002088769-Please-give-me-an-API-key), [WHOIS](https://whois.whoisxmlapi.com/documentation/generate-new-api-key) and [SecurityTrails](https://securitytrails.com/corp/api)).
### Running the app
``` bash
# install node modules
$ yarn

# install the NestJS cli
$ npm install -g @nestjs/cli

# postgres db on docker
$ docker run --name postgres-nest -p 3002:5432 \
-e POSTGRES_USER=postgres \
-e POSTGRES_PASSWORD=postgres \
-e POSTGRES_DB=domain-information \
-d postgres

# running development
$ STAGE=dev yarn stert:dev
```

## Run system using Docker
- Pull the project from github using the git clone command.
- In the docker-compose.yml file, update the environment: VIRUS_TOTAL_API_KEY and WHOIS_API_KEY with the    necessary values.
### Running the app
``` bash
# start system
$ docker-compose up -d --build

# check logs
$ docker-compose logs sonto

# teardown
$ docker-compose down
```


  
