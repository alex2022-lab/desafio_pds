import * as nock from 'nock';

// Este archivo de configuración se ejecuta antes de cada archivo de prueba (setupFiles).
// Su principal objetivo es asegurar que Jest no realice llamadas de red reales.

// Deshabilitar la conectividad de red para todas las pruebas, excepto para las locales (localhost/127.0.0.1)
// Esto asegura que si una prueba intenta hacer una llamada no mockeada, Jest fallará inmediatamente.
nock.disableNetConnect();
nock.enableNetConnect('127.0.0.1');

// Nota importante: Las pruebas individuales (como assistant.repository.integration.spec.ts)
// deben usar nock() en el bloque beforeEach/afterEach para interceptar las URLs específicas
// del Módulo de Base de Datos. Este archivo solo establece la política general.