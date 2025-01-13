/*
  # Add users view and permissions

  1. Changes
    - Creates a view for accessing user data safely
    - Grants necessary permissions to authenticated users
    - Adds sample users for testing

  2. Security
    - Only exposes necessary user fields
    - Restricts access to authenticated users only
*/

-- Create a view for users that only exposes safe fields
CREATE OR REPLACE VIEW users_view AS
SELECT 
  id,
  email,
  raw_user_meta_data->>'name' as name,
  raw_user_meta_data->>'role' as role,
  CASE 
    WHEN last_sign_in_at > NOW() - INTERVAL '15 minutes' THEN 'active'
    ELSE 'inactive'
  END as status,
  raw_user_meta_data->>'avatar' as avatar,
  last_sign_in_at as last_active,
  created_at
FROM auth.users;

-- Grant access to authenticated users
GRANT SELECT ON users_view TO authenticated;

-- Insert sample users if they don't exist
DO $$
BEGIN
  -- Only insert if the users don't exist
  IF NOT EXISTS (
    SELECT 1 FROM auth.users 
    WHERE email IN ('admin@example.com', 'user1@example.com', 'user2@example.com')
  ) THEN
    -- Insert admin user
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      last_sign_in_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      confirmation_token,
      email_change,
      email_change_token_new,
      recovery_token
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'admin@example.com',
      crypt('admin123', gen_salt('bf')),
      NOW(),
      NOW(),
      '{"provider":"email","providers":["email"]}',
      jsonb_build_object(
        'name', 'Admin User',
        'role', 'admin',
        'avatar', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400'
      ),
      NOW(),
      NOW(),
      '',
      '',
      '',
      ''
    );

    -- Insert regular users
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      last_sign_in_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at,
      confirmation_token,
      email_change,
      email_change_token_new,
      recovery_token
    ) VALUES 
    (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'user1@example.com',
      crypt('user123', gen_salt('bf')),
      NOW(),
      NOW(),
      '{"provider":"email","providers":["email"]}',
      jsonb_build_object(
        'name', 'John Doe',
        'role', 'user',
        'avatar', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400'
      ),
      NOW(),
      NOW(),
      '',
      '',
      '',
      ''
    ),
    (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'user2@example.com',
      crypt('user123', gen_salt('bf')),
      NOW(),
      NOW(),
      '{"provider":"email","providers":["email"]}',
      jsonb_build_object(
        'name', 'Jane Smith',
        'role', 'user',
        'avatar', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400'
      ),
      NOW(),
      NOW(),
      '',
      '',
      '',
      ''
    );
  END IF;
END $$;