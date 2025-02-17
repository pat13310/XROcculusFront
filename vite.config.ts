import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { networkInterfaces } from 'os';

// Récupérer l'IP une seule fois au démarrage
const localIp = (() => {
  const nets = networkInterfaces();
  for (const name of Object.keys(nets)) {
    const interfaces = nets[name];
    if (interfaces) {
      for (const net of interfaces) {
        if (net.family === 'IPv4' && !net.internal) {
          return net.address;
        }
      }
    }
  }
  return 'localhost';
})();

console.log(`IP locale détectée: ${localIp}`);

// Plugin pour l'endpoint /whoami
const whoamiPlugin: Plugin = {
  name: 'whoami',
  configureServer(server) {
    server.middlewares.use('/whoami', (_, res) => {
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ ip: localIp }));
    });
  },
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), whoamiPlugin],
  resolve: {
    alias: {
      'jwt-decode': 'jwt-decode'
    }
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    host: true,
  },
});
