import { useState } from 'react'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleLogin = () => {
    if (!email.endsWith('@my.unt.edu')) {
      setError('Only UNT students with a @my.unt.edu email can log in.')
      return
    }
    if (!password) {
      setError('Please enter your password.')
      return
    }
    setError('')
    // TODO: connect to backend auth later
    alert('Logging in...')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-md w-full max-w-md p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="bg-[#00853E] text-white w-14 h-14 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
            U
          </div>
          <h1 className="text-2xl font-bold text-gray-800">UNT Grades</h1>
          <p className="text-gray-500 text-sm mt-1">Sign in with your UNT student email</p>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-3 text-sm mb-6">
            {error}
          </div>
        )}

        {/* Form */}
        <div className="flex flex-col gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              UNT Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="yourname@my.unt.edu"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-800 outline-none focus:border-[#00853E] bg-gray-50 text-sm"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-800 outline-none focus:border-[#00853E] bg-gray-50 text-sm"
            />
          </div>

          <button
            onClick={handleLogin}
            className="w-full bg-[#00853E] hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-colors mt-2"
          >
            Sign In
          </button>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          Only UNT students with a @my.unt.edu email are allowed access.
        </p>
      </div>
    </div>
  )
}

export default Login