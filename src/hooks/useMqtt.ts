import { useState, useEffect, useCallback } from 'react';
import { mqttService, MqttMessage } from '../services/mqtt';
import { createLogger } from '../utils/logger';

const logger = createLogger('useMqtt');

type MqttStatus = 'disconnected' | 'connected' | 'error';
type MqttMessages = Record<string, MqttMessage>;

const DEFAULT_BROKER_URL = 'ws://localhost:9001';

export const useMqtt = (brokerUrl: string = DEFAULT_BROKER_URL, topics: string[] = []) => {
  const [mqttStatus, setMqttStatus] = useState<MqttStatus>('disconnected');
  const [messages, setMessages] = useState<MqttMessages>({});

  // Callback pour gérer les messages reçus
  const handleMessage = useCallback((topic: string, message: MqttMessage) => {
    logger.info('Message reçu dans useMqtt', { topic, payload: message });
    setMessages(prev => ({
      ...prev,
      [topic]: message
    }));
  }, []);

  // Effet pour gérer la connexion MQTT
  useEffect(() => {
    let mounted = true;

    const connect = async () => {
      try {
        logger.info('Tentative de connexion MQTT', { brokerUrl });
        await mqttService.connect(brokerUrl);
        
        if (!mounted) return;
        
        setMqttStatus('connected');
        logger.info('Connexion MQTT établie', { brokerUrl });

        // S'abonner aux topics
        topics.forEach(topic => {
          logger.info('Souscription au topic', { topic });
          mqttService.subscribe(topic, (message: MqttMessage) => {
            if (mounted) {
              handleMessage(topic, message);
            }
          });
        });

      } catch (error) {
        if (!mounted) return;
        
        const errorRecord = error instanceof Error 
          ? { message: error.message, name: error.name }
          : { message: String(error) };
        logger.error('Erreur de connexion MQTT', errorRecord);
        setMqttStatus('error');
      }
    };

    connect();

    return () => {
      mounted = false;
      mqttService.disconnect();
    };
  }, [brokerUrl, topics, handleMessage]);

  const publish = useCallback(async (topic: string, message: MqttMessage) => {
    try {
      await mqttService.publish(topic, message);
      logger.info('Message publié', { topic, payload: message });
    } catch (error) {
      const errorRecord = error instanceof Error 
        ? { message: error.message, name: error.name }
        : { message: String(error) };
      logger.error('Erreur de publication', errorRecord);
      throw error;
    }
  }, []);

  return { mqttStatus, messages, publish };
};
