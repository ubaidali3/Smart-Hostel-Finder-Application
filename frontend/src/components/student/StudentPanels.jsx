import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { HostelContext } from '../../context/HosetlContext'
import { StatusBadge, EmptyState } from '../warden/WardenPanels'

// first image of a room (supports `images: [url | {url}]` or a single `image`)
const getRoomImage = (room) => {
  const first = room?.images?.[0] ?? room?.image
  if (!first) return null
  return typeof first === 'string' ? first : first.url || null
}

const CASH_NOTE =
  'Admission and monthly fees are paid in cash directly to the warden. After paying, send a payment request from the "Fee & Payments" tab so the warden can confirm it.'

/* Message shown to the student for each application status */
const statusInfo = {
  pending: {
    box: 'border-amber-200 bg-amber-50/60',
    title: 'Under review',
    text: 'Your application has been sent. The warden will approve or reject it soon.',
  },
  approved: {
    box: 'border-green-200 bg-green-50/60',
    title: 'Application approved',
    text: `Congratulations! The warden approved your request and your room is now assigned. ${CASH_NOTE}`,
  },
  rejected: {
    box: 'border-red-200 bg-red-50/60',
    title: 'Application rejected',
    text: 'Sorry, the warden rejected this request. You can apply for another room from the Hostels page.',
  },
}

/* =========================================================
   1) MY ROOM / APPLICATIONS
   ========================================================= */
export const MyRoomPanel = () => {
  const { myRoom, fetchMyRoom, myApplications, fetchMyApplications, fetchAllRooms, allHostels } =
    useContext(HostelContext)
  const [roomMap, setRoomMap] = useState({})

  useEffect(() => {
    fetchMyRoom()
    fetchMyApplications()
    // full room details (incl. images) so the room shows even if the API returns only an id
    ;(async () => {
      const rooms = await fetchAllRooms()
      setRoomMap(Object.fromEntries(rooms.map((r) => [String(r._id), r])))
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // application/room reference (id or object) -> full room object
  const resolveRoom = (ref) => {
    if (!ref) return null
    const id = typeof ref === 'object' ? ref._id : ref
    const full = roomMap[String(id)]
    return typeof ref === 'object' ? { ...full, ...ref, images: ref.images ?? full?.images } : full || null
  }

  const hostelNameOf = (ref) => {
    if (!ref) return null
    if (typeof ref === 'object') return ref.hostelName || null
    return (allHostels || []).find((h) => String(h._id) === String(ref))?.hostelName || null
  }

  const assignedRoom = resolveRoom(myRoom?.room)

  return (
    <div className="space-y-6">
      {/* Assigned room (only after the warden approves) */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <h2 className="text-lg font-bold text-slate-900 mb-4">My Room</h2>
        {myRoom?.room ? (
          <div className="space-y-4">
            {getRoomImage(assignedRoom) && (
              <img
                src={getRoomImage(assignedRoom)}
                alt={`Room ${myRoom.room?.roomNumber || ''}`}
                className="w-full h-48 object-cover rounded-xl border border-slate-200"
              />
            )}
            <div className="grid sm:grid-cols-2 gap-4 text-sm">
              <div className="p-4 rounded-xl bg-slate-50/60 border border-slate-100">
                <p className="text-slate-500">Hostel</p>
                <p className="font-semibold text-slate-800">{myRoom.hostel?.hostelName}</p>
                <p className="text-slate-500 mt-2">Address</p>
                <p className="font-medium text-slate-700">{myRoom.hostel?.address}</p>
                {myRoom.hostel?.contact && (
                  <>
                    <p className="text-slate-500 mt-2">Warden contact</p>
                    <p className="font-medium text-slate-700">{myRoom.hostel.contact}</p>
                  </>
                )}
              </div>
              <div className="p-4 rounded-xl bg-slate-50/60 border border-slate-100">
                <p className="text-slate-500">Room</p>
                <p className="font-semibold text-slate-800 capitalize">
                  {myRoom.room?.roomNumber} — {myRoom.room?.roomType}
                </p>
                <p className="text-slate-500 mt-2">Price</p>
                <p className="font-medium text-slate-700">Rs. {myRoom.room?.price} / month</p>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-blue-100 bg-blue-50/50 text-sm text-slate-700">
              <p className="font-semibold text-slate-900 mb-1">Admission: Cash on hand</p>
              <p>{CASH_NOTE}</p>
              <Link
                to="/dashboard/fees"
                className="inline-block mt-3 px-4 py-2 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                Go to Fee & Payments
              </Link>
            </div>
          </div>
        ) : (
          <EmptyState message="You don't have an approved room yet. Check the status of your applications below." />
        )}
      </div>

      {/* Applications with warden decision */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <h2 className="text-lg font-bold text-slate-900 mb-4">My Applications</h2>
        {myApplications.length === 0 ? (
          <div className="text-center py-10 text-sm text-slate-400">
            You haven't applied for any room yet.{' '}
            <Link to="/hostels" className="text-blue-600 font-semibold hover:underline">
              Browse hostels
            </Link>{' '}
            and apply for a room.
          </div>
        ) : (
          <div className="space-y-3">
            {myApplications.map((a) => {
              const info = statusInfo[a.status] || statusInfo.pending
              const appliedRoom = resolveRoom(a.room)
              const roomNumber = appliedRoom?.roomNumber || null
              const hostelName = hostelNameOf(a.hostel || appliedRoom?.hostel)
              const roomImg = getRoomImage(appliedRoom)

              return (
                <div key={a._id} className={`p-4 rounded-xl border ${info.box}`}>
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {roomImg && (
                        <img
                          src={roomImg}
                          alt={`Room ${roomNumber || ''}`}
                          className="w-24 h-16 object-cover rounded-lg border border-slate-200 shrink-0"
                        />
                      )}
                      <div>
                        <p className="text-sm font-semibold text-slate-800">
                          {hostelName || 'Hostel'}
                          {roomNumber ? ` — Room ${roomNumber}` : ''}
                        </p>
                        {appliedRoom && (
                          <p className="text-xs text-slate-500 capitalize">
                            {appliedRoom.roomType} · Rs. {appliedRoom.price}/month
                          </p>
                        )}
                        {a.createdAt && (
                          <p className="text-xs text-slate-500">
                            Applied on {new Date(a.createdAt).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    </div>
                    <StatusBadge status={a.status} />
                  </div>

                  <p className="text-sm font-semibold text-slate-800 mt-3">{info.title}</p>
                  <p className="text-sm text-slate-600 mt-0.5">{info.text}</p>

                  {a.status === 'rejected' && (
                    <Link
                      to="/hostels"
                      className="inline-block mt-3 px-4 py-2 text-xs font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                    >
                      Find another room
                    </Link>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

/* =========================================================
   2) NOTICES
   ========================================================= */
export const StudentNoticesPanel = () => {
  const { myNotices, fetchMyNotices } = useContext(HostelContext)

  useEffect(() => {
    fetchMyNotices()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
      <h2 className="text-lg font-bold text-slate-900 mb-4">Notice Board</h2>
      {myNotices.length === 0 ? (
        <EmptyState message="No notices yet. Notices are only visible to students with an approved room." />
      ) : (
        <div className="space-y-3">
          {myNotices.map((n) => (
            <div key={n._id} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50">
              <p className="text-sm font-semibold text-slate-800">{n.title}</p>
              <p className="text-sm text-slate-600 mt-1">{n.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/* =========================================================
   3) FEE & PAYMENTS (cash)
   ========================================================= */
export const FeePaymentsPanel = () => {
  const { myFee, fetchMyFee, myPayments, createPayment } = useContext(HostelContext)
  const [month, setMonth] = useState('')
  const [paying, setPaying] = useState(false)

  useEffect(() => {
    fetchMyFee()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handlePay = async (e) => {
    e.preventDefault()
    if (!myFee?._id || !month) return
    setPaying(true)
    await createPayment({ fee: myFee._id, month })
    setMonth('')
    setPaying(false)
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <h2 className="text-lg font-bold text-slate-900 mb-4">My Fee Structure</h2>
        {!myFee ? (
          <EmptyState message="Your fee structure has not been set yet. Please contact the warden." />
        ) : (
          <div className="grid sm:grid-cols-2 gap-3 text-sm">
            <Row label="Monthly Rent" value={`Rs. ${myFee.monthlyRent}`} />
            <Row label="Mess Fee" value={`Rs. ${myFee.messFee}`} />
            <Row label="Electricity Fee" value={`Rs. ${myFee.electricityFee}`} />
            <Row label="Other Charges" value={`Rs. ${myFee.otherCharges}`} />
            <Row label="Total" value={`Rs. ${myFee.totalAmount}`} bold />
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <h2 className="text-lg font-bold text-slate-900 mb-2">Pay Fee (Cash)</h2>
        <p className="text-xs text-slate-500 bg-blue-50/60 border border-blue-100 rounded-lg px-3 py-2 mb-4">
          {CASH_NOTE}
        </p>
        <form onSubmit={handlePay} className="flex flex-col sm:flex-row gap-3 mb-6">
          <input
            required
            disabled={!myFee}
            placeholder="Month, e.g. October 2026"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-600 disabled:opacity-60"
          />
          <button
            disabled={!myFee || paying}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-semibold rounded-xl"
          >
            {paying ? 'Sending...' : 'Send Payment Request'}
          </button>
        </form>

        {myPayments.length === 0 ? (
          <EmptyState message="You haven't sent any payment request in this session yet." />
        ) : (
          <div className="space-y-2">
            {myPayments.map((p) => (
              <div key={p._id} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50/50 text-sm">
                <span className="text-slate-700">Rs. {p.amount} — {p.month}</span>
                <StatusBadge status={p.status} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

/* =========================================================
   4) COMPLAINTS
   ========================================================= */
export const StudentComplaintsPanel = () => {
  const { createComplaint } = useContext(HostelContext)
  const [form, setForm] = useState({ subject: '', message: '' })
  const [submitted, setSubmitted] = useState([])
  const [sending, setSending] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSending(true)
    const created = await createComplaint(form)
    if (created) {
      setSubmitted((prev) => [created, ...prev])
      setForm({ subject: '', message: '' })
    }
    setSending(false)
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
      <h2 className="text-lg font-bold text-slate-900 mb-4">Submit a Complaint</h2>
      <form onSubmit={handleSubmit} className="space-y-3 mb-6">
        <input
          required
          placeholder="Subject"
          value={form.subject}
          onChange={(e) => setForm({ ...form, subject: e.target.value })}
          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-600"
        />
        <textarea
          required
          rows={3}
          placeholder="Describe the issue..."
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-600"
        />
        <button
          disabled={sending}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-semibold rounded-xl"
        >
          {sending ? 'Submitting...' : 'Submit Complaint'}
        </button>
      </form>

      {submitted.length === 0 ? (
        <EmptyState message="You haven't submitted any complaint in this session yet." />
      ) : (
        <div className="space-y-3">
          {submitted.map((c) => (
            <div key={c._id} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-800">{c.subject}</p>
                <StatusBadge status={c.status} />
              </div>
              <p className="text-sm text-slate-600 mt-1">{c.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const Row = ({ label, value, bold }) => (
  <div className="flex justify-between p-3 rounded-xl bg-slate-50/60 border border-slate-100">
    <span className="text-slate-500">{label}</span>
    <span className={bold ? 'font-bold text-slate-900' : 'font-medium text-slate-700'}>{value}</span>
  </div>
)