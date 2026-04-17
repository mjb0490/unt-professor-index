import  Link  from 'next/link'

function Navbar() {
  return (
    <nav className="bg-[#00853E] text-white px-6 py-4 flex items-center justify-between shadow-md">
      <Link href="/" className="text-xl font-bold tracking-tight">
        UNT Grades
      </Link>
      <div className="flex gap-6 items-center">
        <Link href="/" className="hover:text-green-200 transition-colors">
          Home
        </Link>
        <Link href="/login" className="bg-white text-[#00853E] px-4 py-1.5 rounded-full font-semibold hover:bg-green-100 transition-colors">
          Login
        </Link>
      </div>
    </nav>
  )
}

export default Navbar