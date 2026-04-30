"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CommentSection({ courseId, initialComments = [], isLoggedIn }) {
  const router = useRouter();
  const [comments, setComments] = useState(initialComments || []);
  const [newComment, setNewComment] = useState('');
  const [difficulty, setDifficulty] = useState('Medium'); // Restored difficulty state
  const [grade, setGrade] = useState(null); // Optional/Toggleable grade
  const [error, setError] = useState('');

  const difficultyColor = (d) => {
    if (d === 'Easy') return 'bg-green-100 text-green-700';
    if (d === 'Medium') return 'bg-yellow-100 text-yellow-700';
    return 'bg-red-100 text-red-700';
  };

  const gradeColor = (g) => {
    const colors = { 
      'A': 'bg-green-500', 'B': 'bg-blue-400', 'C': 'bg-yellow-400', 
      'D': 'bg-orange-400', 'F': 'bg-red-500' 
    };
    return colors[g] || 'bg-gray-200 text-gray-500';
  };

  const handleSubmit = async () => {
    if (!isLoggedIn) {
      setError('You must be signed in to post.');
      return;
    }

    if (!newComment.trim()) {
      setError('Please write a comment before submitting.');
      return;
    }

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId, content: newComment, difficulty, grade }),
      });

      if (response.ok) {
        const savedReview = await response.json();
        // Update local UI immediately
        setComments((prev) => [savedReview, ...prev]);
        setNewComment('');
        setGrade(null);
        setError('');
        
        // This triggers the Server Component to refresh the Grade Chart numbers
        router.refresh(); 
        setTimeout(() => {
          router.refresh();
        }, 500);
      } else {
        const errData = await response.json();
        setError(errData.error || 'Failed to post review.');
      }
    } catch (err) {
      setError("Server error. Please try again later.");
    }
  };

  return (
    <div className="mt-6 border-t border-gray-100 pt-6">
      <h4 className="font-bold text-gray-700 mb-4">Student Comments</h4>

      {/* Comment List */}
      <div className="flex flex-col gap-3 mb-6">
        {comments.map((c) => (
          <div key={c.id} className="bg-gray-50 rounded-xl px-4 py-3 border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-400 font-medium">{c.userName || 'student@my.unt.edu'}</span>
              <div className="flex gap-2">
                {c.grade && (
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full text-white ${gradeColor(c.grade)}`}>
                    {c.grade}
                  </span>
                )}
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${difficultyColor(c.difficulty)}`}>
                  {c.difficulty}
                </span>
              </div>
            </div>
            <p className="text-gray-700 text-sm">{c.content || c.text}</p>
          </div>
        ))}
      </div>

      {/* Post Comment Section */}
      {isLoggedIn ? (
        <div className="flex flex-col gap-4">
          {error && <p className="text-red-500 text-xs font-bold">{error}</p>}
          
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Share your experience..."
            className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm text-gray-800 outline-none focus:border-[#00853E] bg-gray-50 resize-none"
            rows={3}
          />

          <div className="flex flex-col gap-4">
            {/* Difficulty Selector - RESTORED */}
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600 font-semibold">Difficulty:</span>
              <div className="flex gap-2">
                {['Easy', 'Medium', 'Hard'].map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDifficulty(d)}
                    className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
                      difficulty === d
                        ? `${difficultyColor(d)} ring-2 ring-offset-1 ring-current shadow-sm`
                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* Expected Grade Selector - FIXED TOGGLE */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600 font-semibold">Grade:</span>
                <div className="flex gap-2">
                  {['A', 'B', 'C', 'D', 'F'].map((g) => (
                    <button
                      key={g}
                      type="button"
                      // Toggle logic: click again to deselect
                      onClick={() => setGrade(prev => prev === g ? null : g)}
                      className={`w-9 h-9 flex items-center justify-center rounded-full text-sm font-black transition-all ${
                        grade === g
                          ? `text-white ${gradeColor(g)} ring-2 ring-offset-1 ring-current shadow-md scale-110`
                          : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleSubmit}
                className="bg-[#00853E] hover:bg-green-700 text-white px-6 py-2 rounded-full text-sm font-bold shadow-sm transition-all active:scale-95"
              >
                Post Review
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-gray-50 p-6 rounded-2xl border border-dashed border-gray-200 text-center">
          <p className="text-gray-500 text-sm">
            <button 
              onClick={() => {
                // DISPATCH THE CUSTOM EVENT
                window.dispatchEvent(new Event('open-login-trigger'));
              }}
              className="text-[#00853E] font-bold hover:underline cursor-pointer"
            >
              Log in
            </button> to leave a comment.
          </p>
        </div>
      )}
    </div>
  );
}