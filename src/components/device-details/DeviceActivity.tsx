import React from 'react';
import { Clock, AlertCircle } from 'lucide-react';

interface DeviceActivityProps {
  deviceId: string;
}

export function DeviceActivity({ deviceId }: DeviceActivityProps) {
  const activities = [
    {
      type: 'status',
      message: 'Device went online',
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      icon: Clock
    },
    {
      type: 'alert',
      message: 'Low storage warning',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      icon: AlertCircle
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
      <div className="space-y-4">
        {activities.map((activity, index) => {
          const Icon = activity.icon;
          return (
            <div key={index} className="flex items-start space-x-3">
              <div className={`p-2 rounded-full ${
                activity.type === 'alert' ? 'bg-red-100' : 'bg-blue-100'
              }`}>
                <Icon className={`w-4 h-4 ${
                  activity.type === 'alert' ? 'text-red-600' : 'text-blue-600'
                }`} />
              </div>
              <div>
                <p className="text-sm text-gray-900">{activity.message}</p>
                <p className="text-xs text-gray-500">
                  {activity.timestamp.toLocaleString()}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}