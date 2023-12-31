- [Microservices](#microservices)
  - [Difference between monolithic and microservice architecture](#difference-between-monolithic-and-microservice-architecture)
    - [Monolithic server architecture](#monolithic-server-architecture)
    - [Microservice server architecture](#microservice-server-architecture)
  - [Data in microservices](#data-in-microservices)
    - [Each service gets its own database (as per database-per-service pattern)](#each-service-gets-its-own-database-as-per-database-per-service-pattern)
      - [_why?_](#why)
    - [Services will never reach into another service database](#services-will-never-reach-into-another-service-database)
      - [_why?_](#why-1)
    - [Big problems with data](#big-problems-with-data)
    - [Communication strategies between services](#communication-strategies-between-services)
    - [Event bus:](#event-bus)
  - [Kubernetes](#kubernetes)
    - [Kubernets glossary](#kubernets-glossary)
    - [Kubernets config file](#kubernets-config-file)
    - [Re-deploy updated changes to kubernets](#re-deploy-updated-changes-to-kubernets)
    - [Networking with services](#networking-with-services)
      - [Types of services](#types-of-services)
    - [Managing secrets](#managing-secrets)
- [Projects:](#projects)
  - [Blog app](#blog-app)
  - [Ticketing](#ticketing)
    - [Steps to run](#steps-to-run)

# Microservices

## Difference between monolithic and microservice architecture

### Monolithic server architecture

- Monolithic contains all the `routing`, `middlewares`, `business logic`, `database access` to implement **all features** of an app

### Microservice server architecture

- A single microservice contains all the `routing`, `middlewares`, `business logic`, `database access` to implement **one feature** of an app

## Data in microservices

### Each service gets its own database (as per database-per-service pattern)

#### _why?_

1. We want every single services to run independently from one another
2. Problem with monolithic architecture is that, they use one database for everything, anything bad happnes to the database entire app will crash
3. There will be problem with scaling while using single db for everything
4. Some service might function more effeciently with different types of databases (sql dbs or no-sql dbs)

### Services will never reach into another service database

#### _why?_

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
     - It can create complex webs of requests _(eg: if we make a call do service D which calls A, B and C services, there's a possibility where A, B or C will also make other services to get required data)_

2. **Async** : Services communicate with each other using events

   - Goods:

     - Some services don't even need database

   - Bads:

     - Conceptually not easy to understand
     - It introduces a dependency between services
     - If any one of the request fails, overall request fails
     - Entire request is only as fast as the slowest request
     - It can create complex webs of requests _(eg: if we make a call do service D which calls A, B and C services, there's a possibility where A, B or C will also make other services to get required data)_

   - Another implementation of async communication with event broker:

     - Goods:

       - Another approach consist of storing only essential relational data like foreign ids in tables of a service. While creating records using some service, we emit an event to message broker which some micro service will recieve and process events as required
       - This grately improve the speed of service which depends on data from another service database as the service call is reduced

     - Bads:
       - Data duplication
       - Harder to understand flow of events

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

### Re-deploy updated changes to kubernets

- make changes to the code, build image, push image (potentially with updated tags) and run `kubectl rollout restart deployment [depl_name]`

### Networking with services

Service provides networking between pods. we also use services to access pod from outside the cluster.

#### Types of services

1. Cluster IP

   Sets up easy-to-remember URL access a pod, Only expose pods in the cluster

2. Node Port

   Makes a pod accessible from outside of the cluster, Usually used for dev purposes

3. Load Balancer

   Makes pod accessible from outside of the cluster. It is right way to expose a pod to outside world.

4. External Name

   Redirects in-cluster request to a CNAME url.

### Managing secrets

To manage secrets in kubernets we can either create a seperate config file or run command directly to create a secret. Creating config file can expose secrets on code level so manually creating secrets is preferred here. Later we can expose env variables in the deployment configurations.

Secrets can be created by following commands
`kubectl create secret generic <jwt-secret> --from-litral=<JWT_KEY>=<secure_value>`
or
`minikube kubectl -- create secret generic jwt-secret --from-literal=JWT_KEY=secured`

# Projects:

## Blog app

- A application created with intention to explaing how microservices works internally.
- Learn about data duplication while using microservices
- Learn about passing data with events (using http requests)
- Created a app where user can create post and add comments on the post, comments can not contain `orange`, if it does then comment will be display as `Comment is rejected`
- Best way to start the app is using `skaffold dev`

## Ticketing

- A application that demonstrate basic implementation of microservice architecture.
- User can sign up and sign in with email and password.
- User can create tickets which other people can order.
- Once user click order, they are require to pay with in 10 minutes.
- The ticket get locked while user payment (10 minute) session is going on and it get unblocked after that.
- If timer expires the ticket is unblocked and order get cancelled.
- Application uses `nats-streaming-server` for event streaming.
- App has following microservices
  - `auth` - to handle authentication (sign up, sign in, get details of logged in user)
  - `tickets` - to create ticket or update ticket
  - `orders` - to keep track of orders
  - `payments` - to keep track of paid orders which is paid with stripe
  - `expiration` - to keep track of expiration of payment sessions using bulljs library along with redis
- Aditionally app uses custom common module to share common code across different microservices

### Steps to run
> NOTE: You must push each docker images to registry and update code to use correct docker images before moving ahead

>NOTE: Common lib must be published to npm registry
1. Install [kubernetes](https://kubernetes.io/docs/tasks/tools/) or [docker engine with kubernetes](https://docs.docker.com/get-docker/)
2. Start cluster `minikube start`
3. Install [skaffold](https://skaffold.dev/docs/install/#standalone-binary)
4. Set env variables
   1. JWT secret - `kubectl create secret generic jwt-secret --from-literal=JWT_KEY=xxx`
   2. stripe private key - `kubectl create secret generic stripe-secret --from-literal=STRIPE_KEY=sk_test_xxx`
5. Add ingress controller
   `kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.8.2/deploy/static/provider/cloud/deploy.yaml`
6. Run `skaffold dev`
7. Add host file entry if running locally. `127.0.0.1 ticketing.dev`
8. Visit [ticketing.dev](https:ticketing.dev)
9. If you see ssl error then you can bypass it by typing `thisisunsafe` in the main chrome window