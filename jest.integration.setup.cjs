// Configuration globale pour les tests d'intégration
// Peut inclure des configurations spécifiques, des mocks, etc.

// Exemple : configurer un timeout global plus long
jest.setTimeout(30000);

// Activer les logs détaillés sans récursion
const originalConsole = { ...console };

global.console = {
  ...originalConsole,
  log: (...args) => {
    const timestamp = new Date().toISOString();
    originalConsole.log(`[${timestamp}]`, ...args);
  },
  warn: (...args) => {
    const timestamp = new Date().toISOString();
    originalConsole.warn(`[${timestamp}] WARN:`, ...args);
  },
  error: (...args) => {
    const timestamp = new Date().toISOString();
    originalConsole.error(`[${timestamp}] ERROR:`, ...args);
  }
};

// Gestion des erreurs non capturées
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});
