import mqtt, { IClientOptions } from 'mqtt';
import { createLogger } from '../utils/logger';

const logger = createLogger('MqttService');

export type MqttMessage = string | Record<string, any>;
export type MqttCallback = (message: MqttMessage) => void;

const DEFAULT_OPTIONS: IClientOptions = {
  keepalive: 60,
  clean: true,
  reconnectPeriod: 1000,
  connectTimeout: 30 * 1000,
  rejectUnauthorized: false,
  protocol: 'ws',
  port: 9001,
  path: '/mqtt'  // Ajout du path pour WebSocket
};

class MqttService {
  private client: mqtt.MqttClient | null = null;
  private subscribers: Map<string, Set<MqttCallback>> = new Map();

  connect(brokerUrl: string, options: Partial<IClientOptions> = {}): Promise<void> {
    logger.info('Connexion MQTT initiée', { brokerUrl, options: { ...DEFAULT_OPTIONS, ...options } });
    
    return new Promise((resolve, reject) => {
      try {
        const mqttOptions: IClientOptions = {
          ...DEFAULT_OPTIONS,
          ...options,
          clientId: `xrocculus_${Math.random().toString(16).substr(2, 8)}`,
        };

        // Vérifier si une connexion existe déjà
        if (this.client) {
          logger.info('Fermeture de la connexion existante');
          this.client.end(true);
          this.client = null;
          this.subscribers.clear();
        }

        logger.info('Création du client MQTT', { brokerUrl, options: mqttOptions });
        this.client = mqtt.connect(brokerUrl, mqttOptions);

        // Gérer les événements de connexion
        this.client.on('connect', () => {
          logger.info('Connexion MQTT établie', { brokerUrl });
          resolve();
        });

        this.client.on('message', (topic: string, message: Buffer) => {
          const subscribers = this.subscribers.get(topic);
          if (subscribers) {
            const messageStr = message.toString();
            let parsedMessage: MqttMessage;
            try {
              parsedMessage = JSON.parse(messageStr);
            } catch {
              parsedMessage = messageStr;
            }
            logger.info('Message MQTT reçu', { topic, payload: parsedMessage });
            subscribers.forEach(callback => callback(parsedMessage));
          }
        });

        this.client.on('error', (error) => {
          const errorRecord = error instanceof Error 
            ? { message: error.message, name: error.name, stack: error.stack }
            : { message: String(error) };
          logger.error('Erreur MQTT', { ...errorRecord, brokerUrl });
          reject(error);
        });

        // Ajouter plus d'événements pour le debugging
        this.client.on('close', () => {
          logger.warn('Connexion MQTT fermée', { brokerUrl });
        });

        this.client.on('offline', () => {
          logger.warn('Client MQTT hors ligne', { brokerUrl });
        });

        this.client.on('reconnect', () => {
          logger.info('Tentative de reconnexion MQTT', { brokerUrl });
        });

        // Timeout de connexion
        setTimeout(() => {
          if (this.client && !this.client.connected) {
            const error = new Error('Timeout de connexion MQTT');
            logger.error('Timeout de connexion', { brokerUrl, timeout: DEFAULT_OPTIONS.connectTimeout });
            reject(error);
            this.client.end(true);
            this.client = null;
          }
        }, DEFAULT_OPTIONS.connectTimeout);

      } catch (error) {
        const errorRecord = error instanceof Error 
          ? { message: error.message, name: error.name }
          : { message: String(error) };
        logger.error('Erreur lors de la création du client MQTT', { ...errorRecord, brokerUrl });
        reject(error);
      }
    });
  }

  subscribe(topic: string, callback: MqttCallback): void {
    if (!this.client) {
      const error = new Error('Client MQTT non connecté');
      logger.error('Erreur de souscription', { topic, error: { message: error.message } });
      throw error;
    }

    if (!this.subscribers.has(topic)) {
      this.subscribers.set(topic, new Set());
      this.client.subscribe(topic, (error) => {
        if (error) {
          const errorRecord = error instanceof Error 
            ? { message: error.message, name: error.name }
            : { message: String(error) };
          logger.error('Erreur de souscription au topic', { topic, ...errorRecord });
        } else {
          logger.info('Souscription au topic réussie', { topic });
        }
      });
    }

    const topicSubscribers = this.subscribers.get(topic);
    if (topicSubscribers) {
      topicSubscribers.add(callback);
      logger.info('Callback ajouté pour le topic', { topic });
    }
  }

  unsubscribe(topic: string, callback: MqttCallback): void {
    const topicSubscribers = this.subscribers.get(topic);
    if (topicSubscribers) {
      topicSubscribers.delete(callback);
      if (topicSubscribers.size === 0) {
        this.subscribers.delete(topic);
        this.client?.unsubscribe(topic);
        logger.info(`Unsubscribed from ${topic}`);
      }
    }
  }

  publish(topic: string, message: MqttMessage): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.client) {
        const error = new Error('MQTT client not connected');
        logger.error('Erreur de publication', { topic, error: { message: error.message } });
        reject(error);
        return;
      }

      const messageStr = typeof message === 'string' ? message : JSON.stringify(message);
      
      this.client.publish(topic, messageStr, (error) => {
        if (error) {
          const errorRecord = error instanceof Error 
            ? { message: error.message, name: error.name }
            : { message: String(error) };
          logger.error('Erreur lors de la publication', { 
            topic, 
            payload: messageStr, 
            error: errorRecord 
          });
          reject(error);
        } else {
          logger.info('Message publié avec succès', { 
            topic, 
            payload: messageStr 
          });
          resolve();
        }
      });
    });
  }

  disconnect(): void {
    if (this.client) {
      this.client.end();
      this.client = null;
      this.subscribers.clear();
      logger.info('Déconnexion MQTT effectuée');
    }
  }
}

export const mqttService = new MqttService();
