import React, { useContext } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import {
  FiHome, FiGrid, FiFileText, FiBell, FiDollarSign, FiCreditCard, FiAlertCircle, FiLogOut,
} from 'react-icons/fi'
import { HostelContext } from '../context/HosetlContext'
import {
  HostelProfilePanel, RoomsPanel, ApplicationsPanel, NoticesPanel, FeesPanel,
  PaymentsPanel, ComplaintsPanel,
} from '../components/warden/WardenPanels'
import {
  MyRoomPanel, StudentNoticesPanel, FeePaymentsPanel, StudentComplaintsPanel,
} from '../components/student/StudentPanels'

const wardenTabs = [
  { key: 'hostel', label: 'My Hostel', icon: FiHome, Panel: HostelProfilePanel },
  { key: 'rooms', label: 'Rooms', icon: FiGrid, Panel: RoomsPanel },
  { key: 'applications', label: 'Applications', icon: FiFileText, Panel: ApplicationsPanel },
  { key: 'notices', label: 'Notices', icon: FiBell, Panel: NoticesPanel },
  { key: 'fees', label: 'Fees', icon: FiDollarSign, Panel: FeesPanel },
  { key: 'payments', label: 'Payments', icon: FiCreditCard, Panel: PaymentsPanel },
  { key: 'complaints', label: 'Complaints', icon: FiAlertCircle, Panel: ComplaintsPanel },
]

const studentTabs = [
  { key: 'room', label: 'My Room', icon: FiHome, Panel: MyRoomPanel },
  { key: 'notices', label: 'Notices', icon: FiBell, Panel: StudentNoticesPanel },
  { key: 'fees', label: 'Fee & Payments', icon: FiDollarSign, Panel: FeePaymentsPanel },
  { key: 'complaints', label: 'Complaints', icon: FiAlertCircle, Panel: StudentComplaintsPanel },
]

const tabsByRole = { warden: wardenTabs, student: studentTabs }

const Dashboard = () => {
  const { user, logoutUser } = useContext(HostelContext)
  const { tab } = useParams()
  const navigate = useNavigate()

  const handleLogout = () => {
    logoutUser()
    navigate('/login', { replace: true })
  }

  // 1) Not logged in -> login page
  if (!user) return <Navigate to="/login" replace />

  // 2) Role decides the whole UI (case-insensitive: "Warden" / "warden")
  const role = String(user.role || '').toLowerCase().trim()
  const tabs = tabsByRole[role]

  // Unknown role from backend: don't silently show the wrong UI
  if (!tabs) {
    return (
      <div className="max-w-md mx-auto bg-white rounded-2xl border border-slate-100 shadow-sm p-8 text-center">
        <p className="text-sm text-slate-600 mb-4">
          Your account role ("{String(user.role)}") is not recognised. Please log in again.
        </p>
        <button
          onClick={handleLogout}
          className="px-5 py-2.5 text-sm font-semibold text-red-600 bg-red-50 rounded-xl hover:bg-red-100"
        >
          Logout
        </button>
      </div>
    )
  }

  // 3) /dashboard or a tab that belongs to the other role -> first tab of this role
  const current = tabs.find((t) => t.key === tab)
  if (!current) return <Navigate to={`/dashboard/${tabs[0].key}`} replace />

  const ActivePanel = current.Panel

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[220px_minmax(0,1fr)] gap-4 sm:gap-6">
      {/* Sidebar */}
      <aside className="min-w-0 bg-white rounded-2xl border border-slate-100 shadow-sm p-3 sm:p-4 h-fit lg:sticky lg:top-24">
        <div className="flex items-start justify-between gap-2 px-2 pb-4 mb-2 border-b border-slate-100">
          <div>
            <p className="text-sm font-bold text-slate-900">{user.name}</p>
            <p className="text-xs text-slate-500 capitalize">{role} dashboard</p>
          </div>
          {/* Logout (top) - mainly for mobile */}
          <button
            onClick={handleLogout}
            title="Logout"
            className="lg:hidden flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-red-600 bg-red-50 rounded-lg hover:bg-red-100"
          >
            <FiLogOut className="w-3.5 h-3.5" /> Logout
          </button>
        </div>

        <nav className="flex lg:flex-col gap-1 overflow-x-auto pb-1 lg:pb-0">
          {tabs.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => navigate(`/dashboard/${key}`)}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
                current.key === key
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </nav>

        {/* Logout (bottom) - desktop */}
        <button
          onClick={handleLogout}
          className="hidden lg:flex mt-4 w-full items-center justify-center gap-2 py-2.5 text-xs font-semibold text-red-600 bg-red-50 rounded-xl hover:bg-red-100 transition-all"
        >
          <FiLogOut className="w-4 h-4" />
          Logout
        </button>
      </aside>

      {/* Active panel (changes with role + tab) */}
      <div className="min-w-0">
        <ActivePanel />
      </div>
    </div>
  )
}

export default Dashboard