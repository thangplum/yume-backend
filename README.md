<p align="center">
  <img src="./yume+firefly.svg" width="240"/>
  <p align="center" style="color:#E77470;font-size:3em;font-family:sans-serif;">Yume Firefly</p>
</p>

[travis-image]: https://api.travis-ci.org/nestjs/nest.svg?branch=master
[travis-url]: https://travis-ci.org/nestjs/nest
[linux-image]: https://img.shields.io/travis/nestjs/nest/master.svg?label=linux
[linux-url]: https://travis-ci.org/nestjs/nest

</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

The new backend for Yume.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Documentation

```bash
$ npx compodoc -p tsconfig.json -s
```

## Writing migrations

Migration files are created with "migrations" directory and postfixed with a timestamp. The migration tool looks at timestamp and also a migration table in the db, to see which migrations have been run

To create a new migration

```bash
npx typeorm migration:create -n <name>
```

To run a migration

```bash
npx ts-node ./node_modules/.bin/typeorm migration:run
```

## Stay in touch

- Website - [https://yume.me](https://yume.me/)

## License

Yume is property of Yume LLC.
