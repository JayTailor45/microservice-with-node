- [Microservices](#microservices)
  - [Difference between monolithic and microservice architecture](#difference-between-monolithic-and-microservice-architecture)
    - [Monolithic server architecture](#monolithic-server-architecture)
    - [Microservice server architecture](#microservice-server-architecture)
  - [Data in microservices](#data-in-microservices)
    - [Each service gets its own database (as per database-per-service pattern)](#each-service-gets-its-own-database-as-per-database-per-service-pattern)
      - [*why?*](#why)
    - [Services will never reach into another service database](#services-will-never-reach-into-another-service-database)
      - [*why?*](#why-1)
    - [Big problems with data](#big-problems-with-data)
    - [Communication strategies between services](#communication-strategies-between-services)
    - [Event bus:](#event-bus)
  - [Kubernetes](#kubernetes)
    - [Kubernets glossary](#kubernets-glossary)
    - [Kubernets config file](#kubernets-config-file)

# Microservices

## Difference between monolithic and microservice architecture

### Monolithic server architecture
- Monolithic contains all the `routing`, `middlewares`, `business logic`, `database access` to implement **all features** of an app

### Microservice server architecture
- A single microservice contains all the `routing`, `middlewares`, `business logic`, `database access` to implement **one feature** of an app


## Data in microservices
### Each service gets its own database (as per database-per-service pattern)
#### *why?*
1. We want every single services to run independently from one another
2. Problem with monolithic architecture is that, they use one database for everything, anything bad happnes to the database entire app will crash
3. There will be problem with scaling while using single db for everything
4. Some service might function more effeciently with different types of databases (sql dbs or no-sql dbs)

### Services will never reach into another service database
#### *why?*
1. When a service communicate with other service for example A -> B, and for some reason service B goes down then ultimately it will cause service A also to crash
2. If there's a schema change in B's database, then changes needs to be implemented on service A as well, otherwise it can result A service to crash


### Big problems with data
As mentioned above we use one database per service with microservices, and as mentioned, services will never each into another service db. This introduce a problem in getting relevent data (where join between one or more tables are needed).

### Communication strategies between services

1. **Sync** : Services communicate with each other using direct requests

    - Goods:
        - Conceptually easy to understand
        - Some services don't even need database

    - Bads:
        - It introduces a dependency between services
        - If any one of the request fails, overall request fails
        - Entire request is only as fast as the slowest request
        - It can create complex webs of requests *(eg: if we make a call do service D which calls A, B and C services, there's a possibility where A, B or C will also make other services to get required data)*

2. **Async** : Services communicate with each other using events

    - Goods:
        - Some services don't even need database

    - Bads:
        - Conceptually not easy to understand
        - It introduces a dependency between services
        - If any one of the request fails, overall request fails
        - Entire request is only as fast as the slowest request
        - It can create complex webs of requests *(eg: if we make a call do service D which calls A, B and C services, there's a possibility where A, B or C will also make other services to get required data)*

    - Another implementation of async communication with event broker:

        - Goods: 
            -   Another approach consist of storing only essential relational data like foreign ids in tables of a service. While creating records using some service, we emit an event to message broker which some micro service will recieve and process events as required
            - This grately improve the speed of service which depends on data from another service database as the service call is reduced

        -  Bads:
           -  Data duplication
           -  Harder to understand flow of events

### Event bus:
- Receives events and publish events to listeners
- There are many event bus avaliable such as NATs, Kafka, RabbitMQ etc ...
- Event bus has many features which makes async communication easier

## Kubernetes

### Kubernets glossary
- `Kubernetes cluster` :- collection of nodes + a master to manage nodes
- `Node` :- virtual machine that will run our containers
- `Pod` :- it is smililar to a running container but it can run multiple containers
- `Deployement` :- monitors set of pods, make sure they are running and restarts then if they crash
- `Service` :- provides an easy-to-remember URL to access a running containers

### Kubernets config file
- It tells kubernets about the deployement, pods, and services (refered to as Objects) that we want to create