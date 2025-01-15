import axios from 'axios';
import * as qs from 'qs';
import ApiRoutes from '../../apiRoutes';

describe('Test de connexion API', () => {
  const BASE_URL = 'http://localhost:8000';

  const testUrl = async (baseUrl: string) => {
    try {
      // Vérification de la connectivité de base
      const pingResult = await ApiRoutes.ping();
      console.log(`📡 Statut de ping pour ${baseUrl}: ${pingResult.status}`);

      // Test de connexion login pour admin
      const loginResult = await ApiRoutes.login({
        username: 'admin',
        password: 'adminpassword'
      });
      
      if (loginResult.status !== 200) {
        throw new Error(`Erreur de login admin. Statut : ${loginResult.status}`);
      }

      const adminAccessToken = loginResult.data.access_token;
      console.log(`✅ Token admin obtenu : ${adminAccessToken.substring(0, 10)}...`);

      // Test de la route /devices/list pour admin
      const devicesResult = await ApiRoutes.getDevicesList(adminAccessToken);
      
      if (devicesResult.status === 200) {
        console.log(`📊 Nombre d'appareils : ${devicesResult.data.devices.length}`);
      } else {
        throw new Error(`Erreur /devices/list. Statut : ${devicesResult.status}`);
      }

      // Test de la route /users/list pour admin
      const usersResult = await ApiRoutes.getUsersList(adminAccessToken);
      
      if (usersResult.status === 200) {
        console.log(`👥 Nombre d'utilisateurs : ${usersResult.data.length}`);
      } else {
        throw new Error(`Erreur /users/list. Statut : ${usersResult.status}`);
      }

      // Test de la route /users/add pour créer un nouvel utilisateur
      const newUserData = {
        username: "roger_" + Math.random().toString(36).substring(7),
        email: "roger_" + Math.random().toString(36).substring(7) + "@example.com",
        full_name: "Roger Dupont",
        password: "newpassword",
        role: "user",
        group: -1
      };

      const createUserResult = await axios.post(`${baseUrl}/users/add`, 
        newUserData,
        {
          timeout: 5000,
          validateStatus: (status) => status >= 200 && status < 500,
          headers: {
            'Authorization': `Bearer ${adminAccessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (createUserResult.status === 200) {
        console.log(`✨ Utilisateur ${newUserData.username} créé avec succès`);
        console.log('📋 Détails de création :', JSON.stringify(createUserResult.data, null, 2));
      } else {
        throw new Error(`Erreur /users/add. Statut : ${createUserResult.status}`);
      }

      // Test de la route /users/update pour modifier un utilisateur existant
      try {
        const updateUserResult = await axios.put(`${baseUrl}/users/update/1`, 
          {
            username: "gilbert",
            full_name: "Gilbert Dupont",
            email: "noe@example.com", // Conserver l'email original
            role: "user",
            group: -1,
            disabled: false,
            password: "defaultPassword123" // Ajout d'un mot de passe factice
          },
          {
            timeout: 5000,
            validateStatus: (status) => status >= 200 && status < 500,
            headers: {
              'Authorization': `Bearer ${adminAccessToken}`,
              'Content-Type': 'application/json'
            }
          }
        );
        
        if (updateUserResult.status === 200) {
          console.log(`🔄 Utilisateur avec ID 4 mis à jour avec succès`);
          console.log('📋 Détails de mise à jour :', JSON.stringify(updateUserResult.data, null, 2));
        } else {
          console.error('❌ Détails de l\'erreur de mise à jour :', JSON.stringify(updateUserResult.data, null, 2));
          throw new Error(`Erreur /users/update. Statut : ${updateUserResult.status}`);
        }
      } catch (error) {
        console.error('❌ Erreur complète de mise à jour :', error.response ? JSON.stringify(error.response.data, null, 2) : error.message);
        throw error;
      }

      // Test de la route /users/delete pour supprimer un utilisateur existant
      const userToDeleteId = 4; // ID de l'utilisateur à supprimer
      const deleteUserResult = await axios.delete(`${baseUrl}/users/delete/${userToDeleteId}`, {
        timeout: 5000,
        validateStatus: (status) => status >= 200 && status < 500,
        headers: {
          'Authorization': `Bearer ${adminAccessToken}`
        }
      });
      
      if (deleteUserResult.status === 200) {
        console.log(`🗑️ Utilisateur avec ID ${userToDeleteId} supprimé avec succès`);
        console.log('📋 Détails de suppression :', JSON.stringify(deleteUserResult.data, null, 2));
      } else {
        throw new Error(`Erreur /users/delete. Statut : ${deleteUserResult.status}`);
      }

      // Si tous les tests passent, on retourne l'URL
      return baseUrl;
    } catch (error) {
      console.error(`❌ Erreur générale pour ${baseUrl}:`, error);
      throw new Error(`Erreur générale pour ${baseUrl}: ${error.message}`);
    }
  };

  it('devrait se connecter à l\'API', async () => {
    console.log('🚀 Début du test de connexion API');
    const successfulUrl = await testUrl(BASE_URL);
    console.log(`✨ Connexion réussie à : ${successfulUrl}`);
  }, 30000);
});
