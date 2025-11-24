
jest.mock('sequelize', () => {
    const sequelizeMock = jest.fn().mockImplementation(() => ({
        authenticate: jest.fn()
    }));
    return { Sequelize: sequelizeMock };
});

describe('Simulacion de conexion a la base de datos', () => {
    beforeEach(() => {
        process.env.DB_NAME = 'testdb';
        process.env.DB_USER = 'testuser';
        process.env.DB_PASSWORD = 'testpassword';
        process.env.DB_HOST = 'localhost';
        process.env.DB_PORT = '5432';
        jest.resetModules();
    });

    test('Verifica que las credenciales en las variables de entorno son correctas', () => {
        const { Sequelize } = require('sequelize');
        require('../config/database');

        expect(Sequelize).toHaveBeenCalledWith(
            'testdb',
            'testuser',
            'testpassword',
            expect.objectContaining({
                host: 'localhost',
                dialect: 'postgres',
                port: '5432'
            })
        );

    });
});

