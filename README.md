## Description
It is an online rent system which helps business with rents contracts.
Main goal is to try and show test-driven development (TDD).
There is no wishes to build a real system. 

Core entities are:
- Room
- User
- Reservation

Dependensies:
- RoomRepository
- ReservationRepository
- PaymentService
- PricingService
- AvailabilityService

## Business logic
When creating a reservation:
1. Check that the room exists
2. Check that the dates are valid (check-in < check-out)
3. Check that the room is available for this period
4. Calculate the price (number of nights × rate)
5. Make payment
6. Save the reservation
7. Return confirmation

## General cycle TDD (test-driven development)
For each feature:
1. Write a test
2. See that it fails
3. Write minimal code
4. Get it to pass
5. Refactor

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Stay in touch

- Author - [Oleksii Y.](https://github.com/MoloZzz)
- LinkedIn - [Oleksii Y.](https://www.linkedin.com/in/oleksii-y-006222270/)
