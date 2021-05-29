# Clean Architecture Typescript Rest API

A REST API that attempts to follow [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html).

Uses [Express](https://www.npmjs.com/package/express) for the web server, [Winston](https://www.npmjs.com/package/winston) for logging, and [Prisma](https://www.npmjs.com/package/prisma) for database access. The architectural design allows any of these to be swapped out with minimal difficulty.

The structure of the project is divided into four layers:

* Domain Entities
* [Use Case Interactors](src/interactors/index.md)
* [Interface Adapters](src/adapters/index.md)
* Frameworks and Drivers
