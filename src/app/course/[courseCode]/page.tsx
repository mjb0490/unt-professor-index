import { useParams } from 'react-router-dom'

function Course() {
  const { id } = useParams()

  // Placeholder data - will be replaced with real API later
  const course = {
    code: 'CSCE 1030',
    name: 'Computer Science I',
    department: 'Computer Science',
    avgGrade: 'B+',
    totalStudents: 450,
    professors: [
      {
        name: 'Dr. John Smith',
        avgGrade: 'B+',
        gradeData: { A: 35, B: 30, C: 20, D: 10, F: 5 }
      },
      {
        name: 'Dr. Jane Doe',
        avgGrade: 'A-',
        gradeData: { A: 50, B: 25, C: 15, D: 7, F: 3 }
      },
      {
        name: 'Dr. Bob Johnson',
        avgGrade: 'C+',
        gradeData: { A: 15, B: 25, C: 35, D: 15, F: 10 }
      },
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

      {/* Course Header */}
      <div className="bg-[#00853E] text-white rounded-2xl p-8 mb-8">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-green-200 font-medium mb-1">{course.department}</p>
            <h1 className="text-3xl font-bold mb-1">{course.code}</h1>
            <p className="text-green-100 text-lg">{course.name}</p>
            <p className="text-green-200 text-sm mt-2">{course.totalStudents} students total</p>
          </div>
          <div className="bg-white text-[#00853E] rounded-xl px-6 py-3 text-center">
            <p className="text-xs font-medium text-gray-500">Overall Avg</p>
            <p className="text-3xl font-bold">{course.avgGrade}</p>
          </div>
        </div>
      </div>

      {/* Professors */}
      <h2 className="text-xl font-bold text-gray-800 mb-4">Grade Distribution by Professor</h2>
      <div className="flex flex-col gap-6">
        {course.professors.map((professor) => (
          <div key={professor.name} className="border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <div className="bg-[#00853E] text-white w-10 h-10 rounded-full flex items-center justify-center font-bold">
                  {professor.name.split(' ').pop()[0]}
                </div>
                <p className="font-bold text-gray-800">{professor.name}</p>
              </div>
              <div className="bg-[#00853E] text-white px-4 py-2 rounded-full font-bold text-lg">
                {professor.avgGrade}
              </div>
            </div>

            {/* Grade Bar Chart */}
            <div className="flex items-end gap-3 h-28">
              {Object.entries(professor.gradeData).map(([grade, pct]) => (
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

export default Course
