import React from 'react';
import { LoginForm } from './LoginForm';
import { Glasses } from 'lucide-react'; // Changed from VrHeadset to Glasses

export function AuthLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-violet-600 text-white mb-4">
            <Glasses className="w-8 h-8" /> {/* Changed icon */}
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            VR Device Manager
          </h1>
          <p className="text-gray-600 mt-2">
            Sign in to manage your VR devices
          </p>
        </div>

        <div className="bg-white shadow-xl rounded-lg p-6">
          <LoginForm />
        </div>

        <p className="text-center mt-4 text-sm text-gray-600">
          Don't have an account?{' '}
          <a
            href="#"
            className="text-violet-600 hover:text-violet-800 font-medium"
          >
            Contact your administrator
          </a>
        </p>
      </div>
    </div>
  );
}
