"use client";

import { useState } from 'react';
import { authClient } from "@/lib/auth-client"; 
import { useRouter } from "next/navigation";

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    if (!email.endsWith('@my.unt.edu')) {
      setError('Only UNT students with a @my.unt.edu email can log in.');
      return;
    }
    
    setLoading(true);
    setError('');

    const { data, error: authError } = await authClient.signIn.email({
      email,
      password,
      callbackURL: "/dashboard", // Where to go after login
    });

    if (authError) {
      // Better Auth provides specific error messages (e.g., "Invalid email or password")
      setError(authError.message || "An error occurred during sign in.");
      setLoading(false);
    } else {
      router.push("/");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-md w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="bg-[#00853E] text-white w-14 h-14 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">U</div>
          <h1 className="text-2xl font-bold text-gray-800">UNT Grades</h1>
          <p className="text-gray-500 text-sm mt-1">Sign in with your UNT student email</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-3 text-sm mb-6">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="yourname@my.unt.edu"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-[#00853E] outline-none"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-[#00853E] outline-none"
          />
          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-[#00853E] hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:bg-gray-400"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;