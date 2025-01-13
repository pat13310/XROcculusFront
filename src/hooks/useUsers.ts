import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import type { User, UserStats } from '../types/users';

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<UserStats>({
    total: 0,
    active: 0,
    newThisMonth: 0,
    avgSessionTime: 0
  });
  const [loading, setLoading] = useState(true);

  const loadUsers = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('users_view')
        .select('*');

      if (error) throw error;

      const formattedUsers = data.map(user => ({
        id: user.id,
        name: user.name || 'Unknown User',
        email: user.email,
        role: user.role || 'user',
        status: user.status || 'inactive',
        avatar: user.avatar,
        lastActive: user.last_active,
        created_at: user.created_at
      }));

      setUsers(formattedUsers);
      
      // Calculate stats
      const activeUsers = formattedUsers.filter(user => user.status === 'active');
      const now = new Date();
      const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const newUsers = formattedUsers.filter(user => 
        new Date(user.created_at) >= firstOfMonth
      );

      setStats({
        total: formattedUsers.length || 0,
        active: activeUsers.length || 0,
        newThisMonth: newUsers.length || 0,
        avgSessionTime: 45 // Example value
      });
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  return { users, stats, loading, refreshUsers: loadUsers };
}