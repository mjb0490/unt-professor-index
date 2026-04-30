"use client";

import { useState, useMemo } from 'react';
import CommentSection from "@/components/ui/CommentSection";
import { authClient } from "@/lib/auth-client";

export default function ProfessorProfileClient({ professor }) {
  const [tab, setTab] = useState('info');
  const { data: session } = authClient.useSession();
  const isLoggedIn = !!session;

  const groupedSections = useMemo(() => {
    const seasonOrder = { 'Fall': 3, 'Summer': 2, 'Spring': 1 };
    const sorted = [...professor.allSections].sort((a, b) => {
      const [seasonA, yearA] = a.semester.split(' ');
      const [seasonB, yearB] = b.semester.split(' ');
      if (yearA !== yearB) return parseInt(yearB) - parseInt(yearA);
      return seasonOrder[seasonB] - seasonOrder[seasonA];
    });
    const groups = {};
    sorted.forEach(section => {
      if (!groups[section.semester]) groups[section.semester] = [];
      groups[section.semester].push(section);
    });
    return groups;
  }, [professor.allSections]);

  const gradeColor = (grade) => {
    const colors = { 'A': 'bg-green-500', 'B': 'bg-blue-400', 'C': 'bg-yellow-400', 'D': 'bg-orange-400', 'F': 'bg-red-500' };
    return colors[grade] || 'bg-gray-400';
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      {/* Professor Header */}
      <div className="bg-[#00853E] text-white rounded-2xl p-8 mb-6 flex items-center gap-6 shadow-lg">
        <div className="bg-white text-[#00853E] w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold shrink-0 shadow-inner">
          {professor.name.split(' ').pop()[0]}
        </div>
        <div>
          <h1 className="text-3xl font-bold mb-1">{professor.name}</h1>
          <p className="text-green-100 text-lg opacity-90">{professor.department}</p>
        </div>
        
        {/* Overall Grade Card */}
        <div className="ml-auto text-center">
          <div className="bg-white text-[#00853E] rounded-xl px-6 py-3 shadow-sm min-w-[120px]">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">Overall Avg</p>
            <p className="text-4xl font-black">{professor.overallAvg}</p>
          </div>
        </div>
      </div>

      {/* Tabs Pill Design */}
      <div className="flex gap-2 mb-6">
        {['info', 'reviews', 'courses'].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-6 py-2 rounded-full font-semibold transition-all capitalize text-sm ${
              tab === t 
                ? 'bg-[#00853E] text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="transition-all duration-300">
        {tab === 'info' && (
          <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Professor Information</h2>
            <div className="flex flex-col">
              {[
                { label: 'Department', value: professor.department },
                { label: 'Email', value: professor.email },
                { label: 'Phone', value: professor.phone },
                { label: 'Education', value: professor.education }
              ].map((item) => (
                <div 
                  key={item.label} 
                  className="flex items-start gap-4 py-4 border-b border-gray-100 last:border-0"
                >
                  <span className="text-gray-500 w-32 text-sm font-medium shrink-0 mt-0.5">
                    {item.label}
                  </span>
                  
                  <div className="flex-1">
                    {item.label === 'Education' && item.value ? (
                      <div className="flex flex-col gap-5">
                        {item.value.split(/[|\n]/).map((block, i) => {
                          const lines = block.split(/(?=Major:|Dissertation:|Specialization:)/g);
                          return (
                            <div key={i} className="flex flex-col gap-1">
                              {lines.map((line, j) => {
                                const trimmed = line.trim();
                                if (!trimmed) return null;
                                
                                // Degree Line (First line)
                                if (j === 0) {
                                  return (
                                    <div key={j} className="flex gap-2 text-gray-800 text-sm">
                                      <span className="text-[#00853E] font-bold">•</span>
                                      <span className="font-bold">{trimmed}</span>
                                    </div>
                                  );
                                }

                                // Major/Dissertation Lines
                                const [title, ...rest] = trimmed.split(':');
                                return (
                                  <div key={j} className="ml-6 text-gray-800 text-sm leading-relaxed">
                                    <span className="font-bold">{title}:</span>
                                    <span>{rest.join(':')}</span>
                                  </div>
                                );
                              })}
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <span className="text-gray-800 font-semibold text-sm whitespace-pre-wrap leading-relaxed">
                        {item.value || 'N/A'}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'reviews' && (
          <div className="flex flex-col gap-8">
            {professor.aggregatedCourses.map((course) => (
              <div key={course.code} className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h3 className="text-2xl font-black text-gray-800">{course.code}</h3>
                    <p className="text-gray-500 font-medium">{course.name}</p>
                  </div>
                  <div className="bg-[#00853E] text-white px-5 py-2 rounded-2xl font-black text-xl shadow-sm">
                    {course.avgGrade}
                  </div>
                </div>
                
                <div className="mb-10">
                   <div className="flex items-end gap-3 h-40 px-4 border-b border-gray-50 pb-6">
                    {Object.entries(course.gradeData).map(([grade, pct]) => (
                      <div key={grade} className="flex flex-col justify-end items-center h-full flex-1 group">
                        <span className="text-[10px] text-gray-400 font-black mb-2 group-hover:text-gray-800 transition-colors">{pct}%</span>
                        <div
                          className={`w-full rounded-t-lg transition-all duration-700 ease-out ${gradeColor(grade)} shadow-sm`}
                          style={{ height: `${Math.max(pct, 2)}%` }}
                        />
                        <span className="text-xs font-black text-gray-700 mt-3">{grade}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <CommentSection courseId={course.id} initialComments={course.comments} isLoggedIn={isLoggedIn} />
              </div>
            ))}
          </div>
        )}

        {tab === 'courses' && (
          <div className="flex flex-col gap-6">
            {Object.entries(groupedSections).map(([semester, sections]) => (
              <div key={semester} className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="bg-gray-50 px-6 py-3 border-b border-gray-100">
                  <h3 className="text-sm font-black text-[#00853E] uppercase tracking-widest">{semester}</h3>
                </div>
                <div className="flex flex-col">
                  {sections.map((section, idx) => (
                    <div key={idx} className="flex items-center justify-between px-6 py-4 border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                      <span className="font-bold text-gray-800">{section.courseCode}</span>
                      {section.syllabusLink ? (
                        <a href={section.syllabusLink} target="_blank" rel="noopener noreferrer" className="text-[#00853E] font-bold text-xs bg-green-50 px-3 py-1 rounded-full hover:bg-[#00853E] hover:text-white transition-all">
                          Syllabus ↗
                        </a>
                      ) : (
                        <span className="text-gray-300 text-[10px] font-bold uppercase italic">No Syllabus</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}