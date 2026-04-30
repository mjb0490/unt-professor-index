"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Home() {
  const [tab, setTab] = useState('professor');
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // Live search functionality
  useEffect(() => {
    // If the search is cleared, stop loading and clear results
    if (search.trim().length === 0) {
      setResults([]);
      setLoading(false);
      return;
    }

    const delayDebounceFn = setTimeout(() => {
      performSearch();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [search, tab]);

  const performSearch = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/search?name=${encodeURIComponent(search)}&type=${tab}`);
      const data = await response.json();

      if (tab === 'course') {
        const uniqueCourses = [];
        const seenCodes = new Set();

        data.forEach(item => {
          const baseCode = item.courseCode.split('.')[0];
          if (!seenCodes.has(baseCode)) {
            seenCodes.add(baseCode);
            uniqueCourses.push({
              ...item,
              displayCode: baseCode 
            });
          }
        });
        setResults(uniqueCourses);
      } else {
        setResults(data);
      }
    } catch (e) { 
      setResults([]); 
    } finally { 
      setLoading(false); 
    }
  };

  // Custom handler for typing
  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    
    // Immediately show loading if there is text to hide the "No results" flicker
    if (value.trim().length > 0) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-[#00853E] text-white py-16 px-6 text-center">
        <h1 className="text-4xl font-bold mb-3">UNT Grade Explorer</h1>
        <p className="text-green-100 text-lg mb-8">Find grade distributions for UNT professors and courses</p>

        {/* Tabs */}
        <div className="flex justify-center gap-2 mb-6">
          <button
            onClick={() => { setTab('professor'); setSearch(''); setResults([]); }}
            className={`px-6 py-2 rounded-full font-semibold transition-colors ${
              tab === 'professor' ? 'bg-white text-[#00853E]' : 'bg-green-700 text-white hover:bg-green-600'
            }`}
          >
            Professor
          </button>
          <button
            onClick={() => { setTab('course'); setSearch(''); setResults([]); }}
            className={`px-6 py-2 rounded-full font-semibold transition-colors ${
              tab === 'course' ? 'bg-white text-[#00853E]' : 'bg-green-700 text-white hover:bg-green-600'
            }`}
          >
            Course
          </button>
        </div>

        {/* Search Bar */}
        <div className="flex justify-center">
          <div className="flex w-full max-w-xl">
            <input
              type="text"
              value={search}
              onChange={handleInputChange}
              placeholder={tab === 'professor' ? 'Search by professor name...' : 'Search by course (e.g. CSCE 1030)'}
              className="flex-1 px-5 py-3 rounded-l-full text-gray-800 outline-none text-base bg-gray-100 border-2 border-gray-300 focus:border-yellow-400"
            />
            <button className="bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold px-8 py-3 rounded-r-full transition-colors min-w-[120px]">
              {loading ? (
                <span className="flex items-center justify-center">
                   <div className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
                </span>
              ) : 'Search'}
            </button>
          </div>
        </div>
      </div>

      {/* Results List */}
      <div className="max-w-3xl mx-auto px-6 py-10">
        <div className="flex flex-col gap-3">
          {/* This conditional is the fix: 
              We only show "No results" if:
              1. There is a search term
              2. Loading is FALSE (meaning the API call is totally finished)
              3. Results are empty
          */}
          {search.trim().length > 0 && !loading && results.length === 0 && (
             <p className="text-center text-gray-400 py-10">No {tab}s found matching "{search}"</p>
          )}

          {!loading && results.map((item, index) => {
            const title = tab === 'professor' ? item.professorName : item.displayCode;
            const subtitle = tab === 'professor' ? item.department : item.courseName;
            const slug = title?.replace(/\s+/g, '-');

            return (
              <Link
                key={item.id || index}
                href={`/${tab}/${slug}`}
                className="flex items-center justify-between border border-gray-200 rounded-xl px-6 py-4 shadow-sm hover:shadow-md hover:border-[#00853E] transition-all bg-white group"
              >
                <div>
                  <p className="font-bold text-gray-800 group-hover:text-[#00853E] transition-colors">{title}</p>
                  <p className="text-gray-500 text-sm">{subtitle}</p>
                </div>
                <div className="bg-[#00853E] text-white px-4 py-1.5 rounded-full font-bold text-xs group-hover:bg-green-700 transition-colors">
                  View Details
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}