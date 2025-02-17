import { useState, useEffect } from 'react';
import apiRoutesInstance from '../apiRoutes';

export const useIP = (baseUrl?: string) => {
  const [ip, setIP] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchIP = async () => {
      try {
        if (baseUrl) {
          apiRoutesInstance.baseUrl = baseUrl;
        }
        const ipAddress = await apiRoutesInstance.getIpAddress();
        setIP(ipAddress);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error(String(err)));
        setIP(null);
      } finally {
        setLoading(false);
      }
    };

    fetchIP();
  }, [baseUrl]);

  return { ip, loading, error };
};
