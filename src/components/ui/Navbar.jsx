"use client";
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import LoginDropdown from './LoginDropdown';
import { authClient } from "@/lib/auth-client";

export default function Navbar() {
  const { data: session } = authClient.useSession();
  const [isLoginOpen, setLoginOpen] = useState(false);
  const dropdownRef = useRef(null);

  // LISTEN FOR TRIGGER FROM COMMENT SECTION
  useEffect(() => {
    const handleTrigger = () => {
      window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll up so they see it
      setLoginOpen(true);
    };

    window.addEventListener('open-login-trigger', handleTrigger);
    return () => window.removeEventListener('open-login-trigger', handleTrigger);
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setLoginOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isLoginOpen]);

  const handleSignOut = async () => {
    await authClient.signOut();
    window.location.reload();
  };

  return (
    <nav className="bg-[#00853E] text-white px-6 py-4 flex items-center justify-between shadow-md relative z-50">
      <Link href="/" className="text-xl font-bold tracking-tight italic">UNT Grades</Link>

      <div className="flex gap-6 items-center">
        <Link href="/" className="hover:text-green-200 transition-colors text-sm font-medium">Home</Link>
        
        {session ? (
          <button 
            onClick={handleSignOut}
            className="bg-white text-[#00853E] px-5 py-2 rounded-full font-bold hover:bg-red-50 hover:text-red-600 transition-all shadow-sm text-sm"
          >
            Sign Out
          </button>
        ) : (
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setLoginOpen(!isLoginOpen)}
              className="bg-white text-[#00853E] px-5 py-2 rounded-full font-bold hover:bg-green-100 transition-colors shadow-sm text-sm"
            >
              Sign In
            </button>

            <div className={`absolute right-0 mt-3 transition-all duration-300 transform origin-top-right ${
              isLoginOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
            }`}>
              <LoginDropdown onClose={() => setLoginOpen(false)} />
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}