"use client"; // Mandatory for components using useState or event handlers

import { useState } from 'react'

function Home() {
  const [tab, setTab] = useState('professor')
  const [search, setSearch] = useState('')
  const [results, setResults] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!search) return
    
    setLoading(true)
    setResults(null) 

    try {
      // Use a relative URL so it works on any port (3000, 3002, etc.)
      const response = await fetch(`/api/search?name=${encodeURIComponent(search)}`)
      
      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`)
      }

      const data = await response.json()
      setResults(data)
    } catch (error) {
      console.error("Connection failed:", error)
      setResults({ 
        error: "Could not connect to the backend. Ensure the Next.js server is running." 
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Hero Section using UNT Green (#00853E) */}
      <div className="bg-[#00853E] text-white py-16 px-6 text-center">
        <h1 className="text-4xl font-bold mb-3">UNT Professor Index</h1>
        <p className="text-green-100 text-lg mb-8">
          Access grade distributions and faculty teaching styles for the UNT community.
        </p>

        {/* Tabs for Professor vs Course Selection */}
        <div className="flex justify-center gap-2 mb-6">
          <button
            onClick={() => setTab('professor')}
            className={`px-6 py-2 rounded-full font-semibold transition-all ${
              tab === 'professor'
                ? 'bg-white text-[#00853E] shadow-md'
                : 'bg-green-700 text-white hover:bg-green-600'
            }`}
          >
            Professor
          </button>
          <button
            onClick={() => setTab('course')}
            className={`px-6 py-2 rounded-full font-semibold transition-all ${
              tab === 'course'
                ? 'bg-white text-[#00853E] shadow-md'
                : 'bg-green-700 text-white hover:bg-green-600'
            }`}
          >
            Course
          </button>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex justify-center">
          <div className="flex w-full max-w-xl shadow-2xl rounded-full overflow-hidden border-2 border-white/20">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={
                tab === 'professor'
                  ? 'Search by professor name...'
                  : 'Search by course name or code...'
              }
              className="flex-1 px-6 py-4 text-gray-800 outline-none text-base bg-white"
            />
            <button 
              type="submit"
              disabled={loading}
              className="bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold px-8 py-4 transition-colors disabled:bg-gray-400"
            >
              {loading ? '...' : 'Search'}
            </button>
          </div>
        </form>
      </div>

      {/* Results Area */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        {results ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-center mb-4 border-b pb-2 border-gray-100">
              <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                Search Results (JSON)
              </h2>
              <button 
                onClick={() => setResults(null)}
                className="text-xs text-red-500 hover:underline"
              >
                Clear Data
              </button>
            </div>
            
            <div className="bg-gray-900 rounded-2xl p-6 shadow-2xl overflow-hidden border border-gray-800">
              <pre className="text-blue-300 font-mono text-sm overflow-x-auto whitespace-pre-wrap leading-relaxed">
                {JSON.stringify(results, null, 2)}
              </pre>
            </div>
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg italic">
              {loading 
                ? 'Querying the UNT Faculty Database...' 
                : `Enter a ${tab} name to see verified historical performance data.`}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Home