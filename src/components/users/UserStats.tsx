import React from 'react';
import { Users, UserCheck, UserPlus, Clock } from 'lucide-react';
import { useTranslation } from '../../contexts/TranslationContext';
import type { UserStats as UserStatsType } from '../../types/users';

interface UserStatsProps {
  stats: UserStatsType;
}

export function UserStats({ stats }: UserStatsProps) {
  const { t } = useTranslation();

  const statCards = [
    {
      icon: Users,
      label: t('users.stats.total', 'Total Utilisateurs'),
      value: stats.total.toString(),
      color: 'blue'
    },
    {
      icon: UserCheck,
      label: t('users.stats.active', 'Utilisateurs actifs'),
      value: stats.active.toString(),
      color: 'green'
    },
    {
      icon: UserPlus,
      label: t('users.stats.new', 'Nouveaux utilisateurs'),
      value: stats.newThisMonth.toString(),
      color: 'purple'
    },
    {
      icon: Clock,
      label: t('users.stats.session', 'Moyenne des sessions'),
      value: `${stats.avgSessionTime}m`,
      color: 'yellow'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map(({ icon: Icon, label, value, color }) => (
        <div key={label} className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Icon className={`h-8 w-8 text-${color}-500`} />
            <div className="ml-4">
              <p className="text-gray-600">{label}</p>
              <h3 className="text-2xl font-bold">{value}</h3>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}