module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/integration/**/*.test.[jt]s?(x)'],
  // Configuration spécifique aux tests d'intégration
  setupFilesAfterEnv: ['<rootDir>/jest.integration.setup.js'],
  // Augmenter les timeouts pour les tests d'intégration
  testTimeout: 30000
};
