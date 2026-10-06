import React, { useContext, useEffect, useState } from 'react'
import { FiMapPin, FiFrown, FiX } from 'react-icons/fi'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { HostelContext } from '../context/HosetlContext'

const norm = (val) => (val ?? '').toString().trim().toLowerCase()

const getImage = (hostel) => {
  const first = hostel.images?.[0]
  if (!first) return 'https://placehold.co/600x400?text=No+Image'
  return typeof first === 'string' ? first : first.url
}

// first image of a room (supports `images: [url | {url}]` or a single `image`)
const getRoomImage = (room) => {
  const first = room?.images?.[0] ?? room?.image
  if (!first) return null
  return typeof first === 'string' ? first : first.url || null
}

/* =========================================================
   Apply-for-room modal (student picks a room of this hostel)
   ========================================================= */
const ApplyModal = ({ hostel, onClose }) => {
  const { fetchHostelRooms, applyForRoom, myApplications, fetchMyApplications } =
    useContext(HostelContext)
  const navigate = useNavigate()

  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)
  const [roomId, setRoomId] = useState('')
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)

  useEffect(() => {
    let active = true
    ;(async () => {
      setLoading(true)
      const [list] = await Promise.all([fetchHostelRooms(hostel._id), fetchMyApplications()])
      if (active) {
        setRooms(list || [])
        setLoading(false)
      }
    })()
    return () => {
      active = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hostel._id])

  // rooms the student already applied to (pending/approved)
  const appliedIds = new Set(
    (myApplications || [])
      .filter((a) => a.status !== 'rejected')
      .map((a) => String(a.room?._id || a.room))
  )

  const isFull = (r) =>
    r.status === 'full' || r.status === 'unavailable' || Number(r.occupied || 0) >= Number(r.capacity || 0)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!roomId) return
    setSending(true)
    const created = await applyForRoom({
      hostel: hostel._id,
      room: roomId,
      message: message.trim(),
    })
    setSending(false)
    if (created) {
      onClose()
      navigate('/dashboard/room') // student can track the request here
    }
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/50 px-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-xl p-6"
      >
        <div className="flex items-start justify-between mb-1">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Apply for a Room</h3>
            <p className="text-xs text-slate-500">{hostel.hostelName}</p>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700">
            <FiX className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-500 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2 my-4">
          Admission fee is paid in cash directly to the warden after your application is approved.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {loading ? (
            <p className="text-sm text-slate-500 text-center py-6">Loading rooms...</p>
          ) : rooms.length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-6">
              This hostel has not added any rooms yet.
            </p>
          ) : (
            <div className="space-y-2">
              {rooms.map((r) => {
                const applied = appliedIds.has(String(r._id))
                const disabled = isFull(r) || applied
                return (
                  <label
                    key={r._id}
                    className={`flex items-center justify-between gap-3 p-3 rounded-xl border text-sm ${
                      roomId === r._id
                        ? 'border-blue-600 bg-blue-50/50'
                        : 'border-slate-200 bg-slate-50/50'
                    } ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={getRoomImage(r) || 'https://placehold.co/160x120?text=No+Image'}
                        alt={`Room ${r.roomNumber}`}
                        className="w-20 h-14 object-cover rounded-lg border border-slate-200 shrink-0"
                      />
                      <input
                        type="radio"
                        name="room"
                        disabled={disabled}
                        checked={roomId === r._id}
                        onChange={() => setRoomId(r._id)}
                      />
                      <div>
                        <p className="font-semibold text-slate-800">
                          Room {r.roomNumber}{' '}
                          <span className="capitalize font-normal text-slate-500">({r.roomType})</span>
                        </p>
                        <p className="text-xs text-slate-500">
                          {r.occupied ?? 0}/{r.capacity} occupied · Rs. {r.price}/month
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-slate-500">
                      {applied ? 'Applied' : isFull(r) ? 'Full' : ''}
                    </span>
                  </label>
                )
              })}
            </div>
          )}

          <textarea
            rows={3}
            placeholder="Message for the warden (optional)"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-600"
          />

          <button
            disabled={!roomId || sending}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-semibold rounded-xl"
          >
            {sending ? 'Submitting...' : 'Submit Application'}
          </button>
        </form>
      </motion.div>
    </div>
  )
}

/* =========================================================
   Hostel list
   ========================================================= */
const Hostelfound = ({ filter }) => {
  const { allHostels, hostelsLoading, user } = useContext(HostelContext)
  const navigate = useNavigate()
  const [applyHostel, setApplyHostel] = useState(null)

  const role = String(user?.role || '').toLowerCase()
  const canApply = !user || role === 'student' // wardens cannot apply

  const handleApply = (hostel) => {
    if (!user) {
      navigate('/login')
      return
    }
    setApplyHostel(hostel)
  }

  const hostels = Array.isArray(allHostels) ? allHostels : []

  const isAny = (value) =>
    ['', 'any', 'all', 'all cities', 'select city'].includes(norm(value))

  // ================= FILTER =================
  const filteredHostels = filter
    ? hostels.filter((hostel) => {
        // Only city filter for now: hostels don't store roomType/price directly
        const cityMatch =
          isAny(filter.city) ||
          norm(hostel.city).includes(norm(filter.city)) ||
          norm(hostel.address).includes(norm(filter.city))
        return cityMatch
      })
    : hostels

  // ================= LOADING =================
  if (hostelsLoading) {
    return (
      <div className="mt-10 text-center py-16 text-slate-500 font-medium">
        Loading hostels...
      </div>
    )
  }

  // ================= UI =================
  return (
    <div className="mt-10">
      {/* Counter */}
      <div className="flex justify-between items-center mb-6 px-1">
        <h3 className="text-xl font-extrabold text-slate-900">
          Available Hostels <span className="text-blue-700">({filteredHostels.length})</span>
        </h3>

        {filter && (
          <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
            Filtered Search
          </span>
        )}
      </div>

      <AnimatePresence mode="wait">
        {filteredHostels.length > 0 ? (
          <motion.div
            key={JSON.stringify(filter)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredHostels.map((hostel, index) => (
              <motion.div
                key={hostel._id || index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.08, ease: 'easeOut' }}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                className="bg-white p-5 rounded-2xl shadow-sm hover:shadow-xl border border-slate-200/80 space-y-3 transition-shadow duration-300 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  {/* Image */}
                  <div className="relative overflow-hidden rounded-xl h-48 bg-slate-100">
                    <img
                      src={getImage(hostel)}
                      alt={hostel.hostelName || 'Hostel'}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  {/* Name + Location */}
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 line-clamp-1">
                      {hostel.hostelName}
                    </h2>
                    <p className="text-xs font-medium text-slate-500 flex items-center gap-1 mt-1">
                      <FiMapPin className="text-blue-700 shrink-0" />
                      {hostel.address}, {hostel.city}
                    </p>
                  </div>

                  {/* Facilities */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {hostel.facilities?.slice(0, 3).map((facility, i) => (
                      <span
                        key={`${facility}-${i}`}
                        className="text-[11px] font-semibold px-2.5 py-1 bg-blue-50/70 text-blue-700 rounded-md border border-blue-100"
                      >
                        {facility}
                      </span>
                    ))}

                    {hostel.facilities?.length > 3 && (
                      <span className="text-[11px] font-semibold px-2.5 py-1 bg-slate-100 text-slate-600 rounded-md">
                        +{hostel.facilities.length - 3} more
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-sm text-slate-500 line-clamp-2">
                    {hostel.description || 'No description available'}
                  </p>
                </div>

                {/* Bottom */}
                <div className="pt-4 border-t border-slate-100 flex justify-end items-center gap-3 mt-2">
                  <Link
                    to={`/details/${hostel._id}`}
                    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm rounded-xl transition-all duration-200"
                  >
                    View Details
                  </Link>

                  {canApply && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleApply(hostel)}
                      className="px-4 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-bold text-sm rounded-xl shadow-md shadow-blue-700/20 transition-all duration-200"
                    >
                      Apply for Room
                    </motion.button>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="empty-state"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="col-span-full text-center py-16 px-4 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-3"
          >
            <div className="w-14 h-14 bg-blue-50 text-blue-700 rounded-full flex items-center justify-center mx-auto text-2xl">
              <FiFrown />
            </div>
            <h4 className="text-lg font-bold text-slate-900">No Hostels Found</h4>
            <p className="text-slate-500 text-sm max-w-sm mx-auto">
              We couldn't find any hostel matching your selected city.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {applyHostel && <ApplyModal hostel={applyHostel} onClose={() => setApplyHostel(null)} />}
    </div>
  )
}

export default Hostelfound