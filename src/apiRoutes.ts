import axios from 'axios';
import * as qs from 'qs';

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface ApiTestResult {
  status: number;
  data: any;
}

export interface UserCreationData {
  username: string;
  email: string;
  full_name: string;
  password: string;
  role: string;
  group_id: number;
}

export class ApiRoutes {
  private baseUrl: string;

  constructor(baseUrl: string = 'http://localhost:8000') {
    this.baseUrl = baseUrl;
  }

  async login(credentials: LoginCredentials): Promise<ApiTestResult> {
    try {
      console.log(' Tentative de login');
      const response = await axios.post(`${this.baseUrl}/login`, 
        qs.stringify(credentials), 
        {
          timeout: 5000,
          validateStatus: (status) => status >= 200 && status < 500,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );
      
      console.log(` Statut de login : ${response.status}`);
      console.log(' Détails de la réponse de login :', JSON.stringify(response.data, null, 2));

      return {
        status: response.status,
        data: response.data
      };
    } catch (error) {
      console.error(' Erreur de login :', error);
      throw error;
    }
  }

  async getDevicesList(token: string): Promise<ApiTestResult> {
    try {
      console.log(' Tentative d\'accès à /devices/list');
      const response = await axios.get(`${this.baseUrl}/devices/list`, {
        timeout: 5000,
        validateStatus: (status) => status >= 200 && status < 500,
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log(` Statut /devices/list : ${response.status}`);
      console.log(' Contenu /devices/list :', JSON.stringify(response.data, null, 2));

      return {
        status: response.status,
        data: response.data
      };
    } catch (error) {
      console.error(' Erreur lors de l\'accès à /devices/list :', error);
      throw error;
    }
  }

  async getUsersList(token: string): Promise<ApiTestResult> {
    try {
      console.log(' Tentative d\'accès à /users/list');
      const response = await axios.get(`${this.baseUrl}/users/list`, {
        timeout: 5000,
        validateStatus: (status) => status >= 200 && status < 500,
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log(` Statut /users/list : ${response.status}`);
      console.log(' Contenu /users/list :', JSON.stringify(response.data, null, 2));

      return {
        status: response.status,
        data: response.data
      };
    } catch (error) {
      console.error(' Erreur lors de l\'accès à /users/list :', error);
      throw error;
    }
  }

  async ping(): Promise<ApiTestResult> {
    try {
      console.log(` Tentative de connexion à : ${this.baseUrl}`);
      const response = await axios.get(this.baseUrl, {
        timeout: 5000,
        validateStatus: (status) => status === 200 || status === 404
      });
      
      console.log(` Statut de ping : ${response.status}`);
      
      return {
        status: response.status,
        data: response.data
      };
    } catch (error) {
      console.error(' Impossible de pinguer :', error);
      throw error;
    }
  }

  async createUser(token: string, userData: UserCreationData): Promise<ApiTestResult> {
    try {
      console.log(' Tentative de création d\'utilisateur');
      const response = await axios.post(`${this.baseUrl}/users/add`, 
        userData,
        {
          timeout: 5000,
          validateStatus: (status) => status >= 200 && status < 500,
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log(` Statut création d'utilisateur : ${response.status}`);
      console.log(' Détails de la réponse :', JSON.stringify(response.data, null, 2));

      return {
        status: response.status,
        data: response.data
      };
    } catch (error) {
      console.error(' Erreur lors de la création d\'utilisateur :', error);
      throw error;
    }
  }
}

const apiRoutesInstance = new ApiRoutes();

export const createUser = async (token: string, userData: UserCreationData): Promise<ApiTestResult> => {
  try {
    console.log(' Tentative de création d\'utilisateur');
    const response = await axios.post(`http://localhost:8000/users/add`, 
      userData,
      {
        timeout: 5000,
        validateStatus: (status) => status >= 200 && status < 500,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log(` Statut création d'utilisateur : ${response.status}`);
    console.log(' Détails de la réponse :', JSON.stringify(response.data, null, 2));

    return {
      status: response.status,
      data: response.data
    };
  } catch (error) {
    console.error(' Erreur lors de la création d\'utilisateur :', error);
    throw error;
  }
};

export default { apiRoutesInstance, createUser };
