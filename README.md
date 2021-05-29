# Clean Architecture Typescript Rest API

A REST API that attempts to follow [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html).

Uses [express](https://www.npmjs.com/package/express) for the web server, [winston](https://www.npmjs.com/package/winston) for logging, and [prisma](https://www.npmjs.com/package/prisma) for database access. The architectural design allows any of these to be swapped out with minimal difficulty.

The structure of the project is divided into four layers:

* Domain Entities
* [Use Case Interactors](src/interactors/index.md)
* [Interface Adapters](src/adapters/index.md)
* Frameworks and Drivers

## Building

To install dependencies run

```
npm install
```

To compile the project run

```
npm run build
```

## Running

You will need a `.env` file in the root directory, next to `package.json`. See `.env.example` for the format.

After setting up the environment, set up the database by running

```
prisma db push
```

You will need to create your own custom built prisma client library by running

```
prisma generate
```

To start the project run

```
npm start
```

## Testing

Testing is done with [Jest](https://www.npmjs.com/package/jest), using [ts-jest](https://www.npmjs.com/package/ts-jest) for typescript support.

To run tests run

```
npm test
```
