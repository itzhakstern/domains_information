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

In addition, the system has a timer that performs the following actions:
- Once a minute, fetches from the database all the domains with PENDING status and runs a scan on them to get the desired information on them, and updates it in the database.
- Once every 10 minutes, fetches from the database all the domains whose updatedAt was before a certain predetermined period of time (by default I set a month) and runs a repeat scan on them to update the information on them

<img width="1138" alt="צילום מסך 2023-04-04 ב-19 40 20" src="https://user-images.githubusercontent.com/83215154/229877949-7d63cb5f-9491-4495-b997-484f4ac0375e.png">

## Run on your computer

### Installation
- Make sure you have Node:16, Yarn installed.
- Pull the project from github using git clone
- In the project's main folder, create an .env.stage.dev file according to the shape of .env.stage.dev.example and the deductive values ​​there (note that you must create an ApiKey to use in VirusTotal and WHOIS).
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
$ yarn stert:dev
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


  
