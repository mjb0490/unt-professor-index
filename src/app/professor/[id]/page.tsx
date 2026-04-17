import { useParams } from 'react-router-dom'

function Professor() {
  const { id } = useParams()

  // Placeholder data - will be replaced with real API later
  const professor = {
    name: 'Dr. John Smith',
    department: 'Computer Science',
    email: 'john.smith@unt.edu',
    avgGrade: 'B+',
    courses: [
      { code: 'CSCE 1030', name: 'Computer Science I', avgGrade: 'B+', gradeData: { A: 35, B: 30, C: 20, D: 10, F: 5 } },
      { code: 'CSCE 2100', name: 'Computing Foundations', avgGrade: 'B', gradeData: { A: 25, B: 35, C: 25, D: 10, F: 5 } },
      { code: 'CSCE 3110', name: 'Data Structures', avgGrade: 'C+', gradeData: { A: 15, B: 25, C: 35, D: 15, F: 10 } },
    ]
  }

  const gradeColor = (grade) => {
    if (grade === 'A') return 'bg-green-500'
    if (grade === 'B') return 'bg-blue-400'
    if (grade === 'C') return 'bg-yellow-400'
    if (grade === 'D') return 'bg-orange-400'
    return 'bg-red-500'
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">

      {/* Professor Header */}
      <div className="bg-[#00853E] text-white rounded-2xl p-8 mb-8 flex items-center gap-6">
        <div className="bg-white text-[#00853E] w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold shrink-0">
          {professor.name.split(' ').pop()[0]}
        </div>
        <div>
          <h1 className="text-3xl font-bold mb-1">{professor.name}</h1>
          <p className="text-green-100 text-lg">{professor.department}</p>
          <p className="text-green-200 text-sm mt-1">{professor.email}</p>
        </div>
        <div className="ml-auto text-center">
          <div className="bg-white text-[#00853E] rounded-xl px-6 py-3">
            <p className="text-xs font-medium text-gray-500">Overall Avg</p>
            <p className="text-3xl font-bold">{professor.avgGrade}</p>
          </div>
        </div>
      </div>

      {/* Courses */}
      <h2 className="text-xl font-bold text-gray-800 mb-4">Courses Taught</h2>
      <div className="flex flex-col gap-6">
        {professor.courses.map((course) => (
          <div key={course.code} className="border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-bold text-gray-800">{course.code}</h3>
                <p className="text-gray-500">{course.name}</p>
              </div>
              <div className="bg-[#00853E] text-white px-4 py-2 rounded-full font-bold text-lg">
                {course.avgGrade}
              </div>
            </div>

            {/* Grade Bar Chart */}
            <div className="flex items-end gap-3 h-28">
              {Object.entries(course.gradeData).map(([grade, pct]) => (
                <div key={grade} className="flex flex-col items-center flex-1">
                  <span className="text-xs text-gray-500 mb-1">{pct}%</span>
                  <div
                    className={`w-full rounded-t-md ${gradeColor(grade)}`}
                    style={{ height: `${pct * 2}px` }}
                  />
                  <span className="text-xs font-semibold text-gray-700 mt-1">{grade}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Professor
