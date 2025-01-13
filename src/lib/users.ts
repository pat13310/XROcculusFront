import { supabase } from './supabase';

interface CreateUserData {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
}

export async function createUser({ name, email, password, role }: CreateUserData) {
  const { data: { user }, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
        role,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`
      }
    }
  });

  if (signUpError) throw signUpError;
  if (!user) throw new Error('Failed to create user');

  return user;
}