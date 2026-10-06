import React, { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiGrid, FiLogOut } from 'react-icons/fi'
import { HostelContext } from '../context/HosetlContext'

// Put <UserMenu /> inside your Navbar (replace the Login button/link there)
const UserMenu = () => {
  const { user, logoutUser } = useContext(HostelContext)
  const navigate = useNavigate()

  if (!user) {
    return (
      <Link
        to="/login"
        className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700"
      >
        Login
      </Link>
    )
  }

  const handleLogout = () => {
    logoutUser()
    navigate('/login', { replace: true })
  }

  return (
    <div className="flex items-center gap-2">
      <Link
        to="/dashboard"
        className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-slate-700 bg-slate-100 rounded-xl hover:bg-slate-200"
      >
        <FiGrid className="w-4 h-4" />
        <span className="hidden sm:inline">Dashboard</span>
      </Link>
      <button
        onClick={handleLogout}
        className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-red-600 bg-red-50 rounded-xl hover:bg-red-100"
      >
        <FiLogOut className="w-4 h-4" />
        <span className="hidden sm:inline">Logout</span>
      </button>
    </div>
  )
}

export default UserMenu