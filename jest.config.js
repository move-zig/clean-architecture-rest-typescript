module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  clearMocks: true,
  coverageDirectory: 'coverage',
  testMatch: [
    '<rootDir>/src/__tests__/**/*.[jt]s?(x)',
    '**/src/**/?(*.)+(spec|test).[tj]s?(x)',
  ],
};
