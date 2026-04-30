"use client";
import { useState } from 'react';
import { authClient } from "@/lib/auth-client";
import Link from 'next/link';

export default function LoginDropdown({ onClose }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.endsWith('@my.unt.edu')) {
      setError('Use @my.unt.edu email');
      return;
    }
    setLoading(true);
    const { error: authError } = await authClient.signIn.email({ email, password });
    
    if (authError) {
      setError(authError.message);
      setLoading(false);
    } else {
      onClose();
      window.location.reload(); 
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-2xl border border-gray-200 w-80 p-6 text-gray-800">
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-[#00853E] text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">U</div>
        <h3 className="font-bold text-lg">Sign In</h3>
      </div>

      {error && <p className="text-red-500 text-xs mb-3 bg-red-50 p-2 rounded">{error}</p>}

      <div className="space-y-3">
        <input
          type="email"
          placeholder="yourname@my.unt.edu"
          className="w-full px-3 py-2 border rounded-lg text-sm focus:border-[#00853E] outline-none"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full px-3 py-2 border rounded-lg text-sm focus:border-[#00853E] outline-none"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-[#00853E] text-white font-bold py-2 rounded-lg hover:bg-green-700 transition-colors"
        >
          {loading ? '...' : 'Sign In'}
        </button>

        {/* Signup Message directly under the Sign In button */}
        <div className="text-center pt-2">
          <p className="text-xs text-gray-500">
            Don't have an account?{' '}
            <Link href="/signup" onClick={onClose} className="text-[#00853E] font-bold hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}