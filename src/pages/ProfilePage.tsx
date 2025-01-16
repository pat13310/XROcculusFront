import React, { useState } from 'react';
import { User, Mail, Lock, Edit } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useAuth } from '../hooks/useAuth';
import { useTranslation } from '../contexts/TranslationContext';
import GradientHeader from '../components/GradientHeader';

export function ProfilePage() {
  const { t } = useTranslation();
  const { user, isAuthenticated } = useAuth(); // Récupérer les informations de l'utilisateur

  console.log('Profile Page - User:', user);
  console.log('Profile Page - Is Authenticated:', isAuthenticated);
  const [isEditing, setIsEditing] = useState(false);
  const [userProfile, setUserProfile] = useState({
    username: user ? user.username : 'non renseigné',
    email: user ? user.email : 'non renseignée'  ,
    address: user?.address || 'non renseignée',
    postalCode: user?.postalCode || 'non renseigné',
    city: user?.city || 'non renseignée',
    country: user?.country || 'non renseigné',
    phoneNumber: user?.phoneNumber || 'non renseigné',
    birthDate: user?.birthDate || 'non renseignée',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserProfile(prevProfile => ({
      ...prevProfile,
      [name]: value
    }));
  };

  const handleSaveProfile = () => {
    // Logique de sauvegarde du profil
    console.log('Profil mis à jour :', userProfile);
    setIsEditing(false);
  };

  if (!user) {
    return <div>Chargement du profil...</div>;
  }

  return (
    <div className="text-gray-700 mt-0 p-2 px-4 bg-white rounded-lg shadow-md">
      <GradientHeader 
        titleKey="profile.title" 
        defaultTitle="Mon Profil" 
        Icon={User} 
      />
      
      {isEditing ? (
        <form onSubmit={(e) => {
          e.preventDefault();
          handleSaveProfile();
        }}>
          <div className="mt-8 text-smgrid grid-cols-1 gap-4 ">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">{t('profile.username', 'Nom d\'utilisateur')}</label>
                <input
                  type="text"
                  name="username"
                  value={userProfile.username}
                  onChange={handleInputChange}
                  className="text-sm font-normal mt-1 mb-4 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm transition duration-200 ease-in-out focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-300 focus:ring-opacity-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">{t('profile.email', 'Adresse Email')}</label>
                <input
                  type="email"
                  name="email"
                  value={userProfile.email}
                  onChange={handleInputChange}
                  className="text-sm font-normal mt-1 mb-4 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm transition duration-200 ease-in-out focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-300 focus:ring-opacity-50"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">{t('profile.address', 'Adresse')}</label>
              <input
                type="text"
                name="address"
                value={userProfile.address}
                onChange={handleInputChange}
                className="text-sm font-normal mt-1 mb-4 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm transition duration-200 ease-in-out focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-300 focus:ring-opacity-50"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">{t('profile.postalCode', 'Code Postal')}</label>
                <input
                  type="text"
                  name="postalCode"
                  value={userProfile.postalCode}
                  onChange={handleInputChange}
                  className="text-sm font-normal mt-1 mb-4 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm transition duration-200 ease-in-out focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-300 focus:ring-opacity-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">{t('profile.city', 'Ville')}</label>
                <input
                  type="text"
                  name="city"
                  value={userProfile.city}
                  onChange={handleInputChange}
                  className="text-sm font-normal mt-1 mb-4 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm transition duration-200 ease-in-out focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-300 focus:ring-opacity-50"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">{t('profile.country', 'Pays')}</label>
              <input
                type="text"
                name="country"
                value={userProfile.country}
                onChange={handleInputChange}
                className="text-sm font-normal mt-1 mb-4 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm transition duration-200 ease-in-out focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-300 focus:ring-opacity-50"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">{t('profile.phoneNumber', 'Téléphone')}</label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={userProfile.phoneNumber}
                  onChange={handleInputChange}
                  className="text-sm font-normal mt-1 mb-4 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm transition duration-200 ease-in-out focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-300 focus:ring-opacity-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">{t('profile.birthDate', 'Date de Naissance')}</label>
                <input
                  type="date"
                  name="birthDate"
                  value={userProfile.birthDate}
                  onChange={handleInputChange}
                  className="text-sm font-normal mt-1 mb-0 block w-full rounded-lg border border-gray-300 px-3 py-2 shadow-sm transition duration-200 ease-in-out focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-300 focus:ring-opacity-50"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-4 mt-6">
              <Button 
                type="button" 
                variant="secondary" 
                onClick={() => setIsEditing(false)}
              >
                {t('common.cancel', 'Annuler')}
              </Button>
              <Button 
                type="submit"
                variant="primary"
              >
                {t('common.save', 'Enregistrer')}
              </Button>
            </div>
          </div>
        </form>
      ) : (
        <div>
          <div className="text-sm grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-600">{t('profile.username', 'Nom d\'utilisateur')}</p>
              <p className="font-normal">{userProfile.username}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">{t('profile.email', 'Email')}</p>
              <p className="font-normal">{userProfile.email}</p>
            </div>
            <div className="col-span-2">
              <p className="text-sm font-medium text-gray-600">{t('profile.address', 'Adresse')}</p>
              <p className="font-normal">{userProfile.address}</p>
            </div>
            <div>
              <p className="font-medium text-sm font-medium text-gray-600">{t('profile.postalCode', 'Code Postal')}</p>
              <p className="font-normal">{userProfile.postalCode}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">{t('profile.city', 'Ville')}</p>
              <p className="font-normal">{userProfile.city}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">{t('profile.country', 'Pays')}</p>
              <p className="font-normal">{userProfile.country}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">{t('profile.phoneNumber', 'Téléphone')}</p>
              <p className="font-normal">{userProfile.phoneNumber}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">{t('profile.birthDate', 'Date de Naissance')}</p>
              <p className="font-normal">{userProfile.birthDate}</p>
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <Button 
              onClick={() => setIsEditing(true)}
              variant="primary"
            >
              <Edit className="mr-2 h-4 w-4" />
              {t('profile.edit', 'Modifier le profil')}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
