"use client";
import { useState } from 'react';
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import Link from 'next/link';

export default function SignUpPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!form.email.endsWith('@my.unt.edu')) {
      return setError('Must be a UNT student email.');
    }
    setLoading(true);
    
    const { error: authError } = await authClient.signUp.email({
      email: form.email,
      password: form.password,
      name: form.name,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
    } else {
      router.push("/"); // Send home after signup
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <form onSubmit={handleSignUp} className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Create Account</h1>
        
        {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">{error}</div>}

        <div className="space-y-4">
          <input 
            required 
            placeholder="Full Name" 
            className="w-full p-3 border rounded-lg"
            onChange={e => setForm({...form, name: e.target.value})}
          />
          <input 
            required 
            type="email" 
            placeholder="yourname@my.unt.edu" 
            className="w-full p-3 border rounded-lg"
            onChange={e => setForm({...form, email: e.target.value})}
          />
          <input 
            required 
            type="password" 
            placeholder="Password" 
            className="w-full p-3 border rounded-lg"
            onChange={e => setForm({...form, password: e.target.value})}
          />
          <button 
            disabled={loading}
            className="w-full bg-[#00853E] text-white py-3 rounded-lg font-bold hover:bg-green-700"
          >
            {loading ? 'Creating...' : 'Sign Up'}
          </button>
        </div>
        <p className="mt-4 text-center text-sm text-gray-500">
          Already have an account? <Link href="/" className="text-[#00853E] font-bold">Sign In</Link>
        </p>
      </form>
    </div>
  );
}