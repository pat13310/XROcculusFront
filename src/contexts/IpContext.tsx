import React, { createContext, useContext } from 'react';
import { useIP } from '../hooks/useIP';

interface IpContextType {
  ip: string | null;
  loading: boolean;
  error: Error | null;
}

const IpContext = createContext<IpContextType | undefined>(undefined);

export const IpProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { ip, loading, error } = useIP();

  return (
    <IpContext.Provider value={{ ip, loading, error }}>
      {children}
    </IpContext.Provider>
  );
};

export const useIpContext = () => {
  const context = useContext(IpContext);
  if (context === undefined) {
    throw new Error('useIpContext doit être utilisé à l\'intérieur d\'un IpProvider');
  }
  return context;
};
