"use client";

import Link from "next/link";

export default function CourseProfileClient({ courseInfo, professors, overallAvg }) {
  const gradeColor = (grade) => {
    const colors = { 
      'A': 'bg-green-500', 'B': 'bg-blue-400', 
      'C': 'bg-yellow-400', 'D': 'bg-orange-400', 'F': 'bg-red-500' 
    };
    return colors[grade] || 'bg-gray-400';
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      {/* Course Header */}
      <div className="bg-[#00853E] text-white rounded-2xl p-8 mb-8 shadow-lg">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-green-200 font-medium mb-1 uppercase tracking-wide text-xs">
              {courseInfo.department}
            </p>
            <h1 className="text-4xl font-bold mb-1">{courseInfo.code}</h1>
            <p className="text-green-50 text-xl opacity-90">{courseInfo.name}</p>
            <p className="text-green-200 text-sm mt-4">
              {courseInfo.totalStudents.toLocaleString()} Students Total
            </p>
          </div>
          <div className="bg-white text-[#00853E] rounded-2xl px-8 py-4 text-center shadow-md">
            <p className="text-[10px] font-black text-gray-400 uppercase mb-1">Overall Avg</p>
            <p className="text-4xl font-black">{overallAvg}</p>
          </div>
        </div>
      </div>

      {/* Professors List */}
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Grade Distribution by Professor</h2>
      <div className="flex flex-col gap-6">
        {professors.map((professor) => {
          // Generate the URL-friendly slug for the professor
          const profSlug = professor.name.replace(/\s+/g, '-');

          return (
            <Link 
              key={professor.name} 
              href={`/professor/${profSlug}`}
              className="block bg-white border border-gray-200 rounded-3xl p-8 shadow-sm hover:shadow-xl hover:border-[#00853E] transition-all group"
            >
              <div className="flex justify-between items-center mb-10">
                <div className="flex items-center gap-4">
                  <div className="bg-[#00853E] text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl shadow-inner group-hover:scale-110 transition-transform">
                    {professor.name.split(' ').pop()[0]}
                  </div>
                  <div>
                    <p className="font-bold text-xl text-gray-800 group-hover:text-[#00853E] transition-colors">
                      {professor.name}
                    </p>
                    <p className="text-xs text-gray-400 uppercase font-bold tracking-tighter">
                      Click to view full profile
                    </p>
                  </div>
                </div>
                <div className="bg-[#00853E] text-white px-5 py-1.5 rounded-xl font-black text-xl">
                  {professor.avgGrade}
                </div>
              </div>

              {/* Fixed Grade Bar Chart */}
              <div className="flex items-end gap-3 h-40 px-4 border-b border-gray-50 pb-6">
                {Object.entries(professor.gradeData).map(([grade, pct]) => (
                  <div key={grade} className="flex flex-col justify-end items-center h-full flex-1">
                    <span className="text-[10px] text-gray-400 font-black mb-2 group-hover:text-gray-800 transition-colors">
                      {pct}%
                    </span>
                    <div
                      className={`w-full rounded-t-lg transition-all duration-700 ease-out ${gradeColor(grade)} shadow-sm`}
                      style={{ height: `${Math.max(pct, 2)}%` }}
                    />
                    <span className="text-xs font-black text-gray-700 mt-3">{grade}</span>
                  </div>
                ))}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}