# Notification Microservice

Este microservicio está diseñado para manejar notificaciones en una aplicación. Utiliza NestJS y TypeScript, y está estructurado de manera que se mantenga desacoplado del proyecto principal.

## Estructura del Proyecto

```
notification-microservice
├── src
│   ├── config
│   ├── modules
│   ├── common
│   ├── app.module.ts
│   └── main.ts
├── test
│   ├── app.e2e-spec.ts
│   └── smoke
├── .eslintrc.js
├── .prettierrc
├── nest-cli.json
├── package.json
├── tsconfig.build.json
└── tsconfig.json
```

## Instalación

Para instalar las dependencias del proyecto, ejecuta:

```
npm install
```

## Ejecución

Para iniciar el microservicio, utiliza el siguiente comando:

```
npm run start
```

Esto iniciará el servidor y podrás acceder a las funcionalidades del microservicio.

## Pruebas Unitarias

Para ejecutar las pruebas unitarias, utiliza:

```
npm run test
```

Esto ejecutará todas las pruebas definidas en el proyecto utilizando Jest.

## Pruebas de Extremo a Extremo

Para ejecutar las pruebas de extremo a extremo, utiliza:

```
npm run test:e2e
```

## Pruebas de Humo

Las pruebas de humo están diseñadas para validar la disponibilidad del microservicio. Se encuentran en el directorio `test/smoke`. Para ejecutarlas, utiliza:

```
npm run test:smoke
```

## Contribuciones

Las contribuciones son bienvenidas. Si deseas contribuir, por favor abre un issue o un pull request en el repositorio.

## Licencia

Este proyecto está bajo la licencia MIT.