c
## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

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
$ npm install -g @nestjs/mau
$ mau deploy
```

Módulos a Implementar:
Módulo de Base de Datos:

Objetivo: Gestionar toda la información relacionada con el evento masivo, sirviendo de núcleo central para el almacenamiento de datos.
Datos a Almacenar:
Evento: ID, nombre, fecha, ubicación, tipo, descripción.
Asistentes: ID, nombre, correo electrónico, teléfono, estado (confirmado/no confirmado).
Entradas: ID, tipo (general, VIP), precio, cantidad disponible, cantidad vendida.
Notificaciones: ID, tipo (correo, SMS), mensaje, fecha de envío, destinatario(s).
Responsabilidades: Proporcionar una API para realizar operaciones CRUD (crear, leer, actualizar y eliminar) sobre los datos del evento, asistentes, entradas y notificaciones.
Módulo de Gestión de Entradas:

Objetivo: Gestionar la venta y el control de las entradas para el evento.
Dependencia: Se comunicará con el Módulo de Base de Datos para verificar la disponibilidad de entradas y registrar las ventas.
Funcionalidades:
Verificar la disponibilidad de entradas.
Registrar la compra de entradas, reduciendo el número de entradas disponibles.
Actualizar la información de las entradas (por ejemplo, tipos y precios).
Módulo de Gestión de Asistentes:

Objetivo: Administrar la información de los asistentes al evento.
Dependencia: Utilizará el Módulo de Base de Datos para almacenar y actualizar los datos de los asistentes.
Funcionalidades:
Registrar nuevos asistentes.
Confirmar o cancelar la asistencia de un usuario.
Consultar la lista de asistentes registrados.
Módulo de Notificaciones:

Objetivo: Enviar notificaciones a los asistentes relacionadas con el evento.
Dependencia: Se comunicará con el Módulo de Base de Datos para obtener la lista de destinatarios y registrar el envío de notificaciones.
Funcionalidades:
Enviar notificaciones por correo electrónico o SMS.
Registrar las notificaciones enviadas en la base de datos.
Consultar el historial de notificaciones.
Requisitos Técnicos:
Estructura de Microservicios:

Cada módulo deberá implementarse como un microservicio independiente que exponga su funcionalidad a través de una API REST.
Los microservicios deben desarrollarse utilizando al menos dos lenguajes de programación diferentes (por ejemplo, dos en Node.js con Express y dos en Python con Flask).
Desarrollo de los Módulos: El desarrollo de los módulos debe estar bajo la metodología TDD.

Módulo de Base de Datos: Se encargará de la gestión de datos mediante operaciones CRUD para eventos, asistentes, entradas y notificaciones. Debe utilizar una base de datos SQL o NoSQL y proporcionar una API que permita su interacción.
Módulo de Gestión de Entradas: Interactuará con el Módulo de Base de Datos para verificar la disponibilidad de entradas, registrar ventas y actualizar información.
Módulo de Gestión de Asistentes: Permitirá el registro y la actualización de datos de asistentes, y deberá interactuar con el Módulo de Base de Datos para llevar a cabo estas operaciones.
Módulo de Notificaciones: Enviará notificaciones a los asistentes y registrará dichas notificaciones en la base de datos, requiriendo comunicación con el Módulo de Base de Datos.