module.exports = {
  rootDir: '.',
  testMatch: [
    '<rootDir>/src/**/*.spec.ts',
    '<rootDir>/src/**/*.test.ts',

    '<rootDir>/test/unitary/**/*.spec.ts',

    '<rootDir>/test/integration/**/*.spec.ts',

    '<rootDir>/test/**/*.e2e-spec.ts',

    '<rootDir>/test/smoke/**/*.smoke.?(spec).ts'
  ],

  moduleFileExtensions: ['js', 'json', 'ts'],
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },

  moduleNameMapper: {
    '^@app/(.*)$': '<rootDir>/src/$1',
  },

  coverageDirectory: './coverage',
  collectCoverage: true,
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],

  collectCoverageFrom: [
    '<rootDir>/src/**/*.(t|j)s',
    '!<rootDir>/src/**/main.ts',
    '!<rootDir>/src/**/*.module.ts',
    '!<rootDir>/src/**/*.spec.ts',
    '!<rootDir>/src/**/*.test.ts',
    '!<rootDir>/src/config/*.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  testEnvironment: 'node',
};
