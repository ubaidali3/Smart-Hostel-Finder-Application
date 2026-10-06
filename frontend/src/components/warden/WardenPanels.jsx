import React, { useContext, useEffect, useState } from 'react'
import { FiUploadCloud, FiX, FiPlus, FiCheck, FiXCircle, FiTrash2, FiEdit2 } from 'react-icons/fi'
import { HostelContext } from '../../context/HosetlContext'

// first image of a room (supports `images: [url | {url}]` or a single `image`)
export const getRoomImage = (room) => {
  const first = room?.images?.[0] ?? room?.image
  if (!first) return null
  return typeof first === 'string' ? first : first.url || null
}

/* =========================================================
   1) HOSTEL PROFILE — create/update hostel + upload images
   ========================================================= */
export const HostelProfilePanel = () => {
  const { myHostel, saveHostel, fetchMyHostels, deleteHostel } = useContext(HostelContext)

  const [form, setForm] = useState({
    hostelName: '',
    description: '',
    city: '',
    address: '',
    contact: '',
    facilities: '',
  })
  const [files, setFiles] = useState([])
  const [previews, setPreviews] = useState([])
  const [saving, setSaving] = useState(false)
  const [replaceImages, setReplaceImages] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    fetchMyHostels()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (myHostel) {
      setForm({
        hostelName: myHostel.hostelName || '',
        description: myHostel.description || '',
        city: myHostel.city || '',
        address: myHostel.address || '',
        contact: myHostel.contact || '',
        facilities: (myHostel.facilities || []).join(', '),
      })
    } else {
      setForm({ hostelName: '', description: '', city: '', address: '', contact: '', facilities: '' })
    }
  }, [myHostel])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleFiles = (e) => {
    const selected = Array.from(e.target.files || [])
    setFiles(selected)
    setPreviews(selected.map((f) => URL.createObjectURL(f)))
  }

  const removeSelected = (idx) => {
    setFiles(files.filter((_, i) => i !== idx))
    setPreviews(previews.filter((_, i) => i !== idx))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    const facilities = form.facilities
      .split(',')
      .map((f) => f.trim())
      .filter(Boolean)

    await saveHostel({ ...form, facilities }, files, replaceImages)
    setFiles([])
    setPreviews([])
    setReplaceImages(false)
    setSaving(false)
  }

  const handleDeleteHostel = async () => {
    if (!window.confirm('Delete your hostel? This cannot be undone.')) return
    setDeleting(true)
    await deleteHostel()
    setDeleting(false)
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
      <h2 className="text-lg font-bold text-slate-900 mb-1">
        {myHostel ? 'My Hostel Profile' : 'Create Your Hostel'}
      </h2>
      <p className="text-sm text-slate-500 mb-6">
        Upload or update your hostel details and images here. These images will be
        available on student-facing pages (via context).
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-600 uppercase">Hostel Name</label>
            <input
              name="hostelName"
              required
              value={form.hostelName}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10"
              placeholder="e.g. Green Valley Boys Hostel"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-600 uppercase">City</label>
            <input
              name="city"
              required
              value={form.city}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10"
              placeholder="e.g. Peshawar"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-600 uppercase">Address</label>
          <input
            name="address"
            required
            value={form.address}
            onChange={handleChange}
            className="mt-1 w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10"
            placeholder="Street, area, landmark"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-600 uppercase">Description</label>
          <textarea
            name="description"
            rows={3}
            value={form.description}
            onChange={handleChange}
            className="mt-1 w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10"
            placeholder="Write a short description of your hostel..."
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-600 uppercase">Contact (phone/email)</label>
            <input
              name="contact"
              value={form.contact}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10"
              placeholder="03xx-xxxxxxx"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-slate-600 uppercase">Facilities (comma separated)</label>
            <input
              name="facilities"
              value={form.facilities}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10"
              placeholder="WiFi, AC, Laundry, Mess"
            />
          </div>
        </div>

        {/* Existing images */}
        {myHostel?.images?.length > 0 && (
          <div>
            <label className="text-xs font-semibold text-slate-600 uppercase">Current Images</label>
            <div className="mt-2 grid grid-cols-3 sm:grid-cols-4 gap-3">
              {myHostel.images.map((url, i) => (
                <img
                  key={i}
                  src={url}
                  alt={`hostel-${i}`}
                  className="w-full h-24 object-cover rounded-xl border border-slate-200"
                />
              ))}
            </div>
          </div>
        )}

        {/* Upload new images */}
        <div>
          <label className="text-xs font-semibold text-slate-600 uppercase">
            {myHostel ? 'Add More Images' : 'Hostel Images'}
          </label>
          <label className="mt-1 flex flex-col items-center justify-center gap-2 border-2 border-dashed border-slate-200 rounded-xl py-8 cursor-pointer hover:border-blue-400 hover:bg-blue-50/40 transition-all">
            <FiUploadCloud className="w-7 h-7 text-blue-500" />
            <span className="text-sm text-slate-500">Click to select images (max 6)</span>
            <input type="file" accept="image/*" multiple hidden onChange={handleFiles} />
          </label>

          {myHostel && files.length > 0 && (
            <label className="mt-3 flex items-center gap-2 text-sm text-slate-600">
              <input
                type="checkbox"
                checked={replaceImages}
                onChange={(e) => setReplaceImages(e.target.checked)}
              />
              Replace existing images with these new ones
            </label>
          )}

          {previews.length > 0 && (
            <div className="mt-3 grid grid-cols-3 sm:grid-cols-4 gap-3">
              {previews.map((src, i) => (
                <div key={i} className="relative">
                  <img src={src} alt="preview" className="w-full h-24 object-cover rounded-xl border border-slate-200" />
                  <button
                    type="button"
                    onClick={() => removeSelected(i)}
                    className="absolute -top-2 -right-2 bg-white border border-slate-200 rounded-full p-1 text-slate-500 hover:text-red-500 shadow-sm"
                  >
                    <FiX className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-semibold rounded-xl shadow-md shadow-blue-600/20 transition-all"
        >
          {saving ? 'Saving...' : myHostel ? 'Update Hostel' : 'Create Hostel'}
        </button>
      </form>

      {myHostel && (
        <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-slate-800">Delete this hostel</p>
            <p className="text-xs text-slate-500">This permanently removes your hostel profile.</p>
          </div>
          <button
            type="button"
            onClick={handleDeleteHostel}
            disabled={deleting}
            className="flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 disabled:opacity-60 rounded-xl"
          >
            <FiTrash2 /> {deleting ? 'Deleting...' : 'Delete Hostel'}
          </button>
        </div>
      )}
    </div>
  )
}

/* =========================================================
   2) ROOMS — create / read / update / delete
   ========================================================= */
const getRoomImages = (room) =>
  (room?.images || (room?.image ? [room.image] : []))
    .map((i) => (typeof i === 'string' ? i : i?.url))
    .filter(Boolean)

const emptyRoomForm = { roomNumber: '', roomType: 'single', capacity: 1, price: '' }

// Small edit / delete icon buttons used in lists
const RowActions = ({ onEdit, onDelete, deleting }) => (
  <div className="flex gap-2">
    <button
      type="button"
      onClick={onEdit}
      title="Edit"
      className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100"
    >
      <FiEdit2 className="w-4 h-4" />
    </button>
    <button
      type="button"
      onClick={onDelete}
      disabled={deleting}
      title="Delete"
      className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 disabled:opacity-60"
    >
      <FiTrash2 className="w-4 h-4" />
    </button>
  </div>
)

export const RoomsPanel = () => {
  const { myHostel, myRooms, fetchMyRooms, createRoom, updateRoom, deleteRoom } =
    useContext(HostelContext)
  const [form, setForm] = useState(emptyRoomForm)
  const [editingId, setEditingId] = useState(null)
  const [roomFiles, setRoomFiles] = useState([])
  const [roomPreviews, setRoomPreviews] = useState([])
  const [replaceImages, setReplaceImages] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState(null)

  useEffect(() => {
    if (myHostel?._id) fetchMyRooms(myHostel._id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [myHostel?._id])

  const handleRoomFiles = (e) => {
    const selected = Array.from(e.target.files || []).slice(0, 4)
    setRoomFiles(selected)
    setRoomPreviews(selected.map((f) => URL.createObjectURL(f)))
  }

  const removeRoomFile = (idx) => {
    setRoomFiles(roomFiles.filter((_, i) => i !== idx))
    setRoomPreviews(roomPreviews.filter((_, i) => i !== idx))
  }

  const resetForm = () => {
    setForm(emptyRoomForm)
    setEditingId(null)
    setRoomFiles([])
    setRoomPreviews([])
    setReplaceImages(false)
  }

  const startEdit = (r) => {
    setEditingId(r._id)
    setForm({
      roomNumber: r.roomNumber || '',
      roomType: r.roomType || 'single',
      capacity: r.capacity ?? 1,
      price: r.price ?? '',
    })
    setRoomFiles([])
    setRoomPreviews([])
    setReplaceImages(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (r) => {
    if (!window.confirm(`Delete Room ${r.roomNumber}? This cannot be undone.`)) return
    setDeletingId(r._id)
    await deleteRoom(r._id)
    setDeletingId(null)
    if (editingId === r._id) resetForm()
  }

  if (!myHostel) {
    return (
      <EmptyState message="Create your hostel profile before managing rooms." />
    )
  }

  const editingRoom = myRooms.find((r) => r._id === editingId)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    const payload = {
      ...form,
      capacity: Number(form.capacity),
      price: Number(form.price),
    }
    const result = editingId
      ? await updateRoom(editingId, payload, roomFiles, replaceImages)
      : await createRoom(payload, roomFiles)
    if (result) resetForm()
    setSaving(false)
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
      <h2 className="text-lg font-bold text-slate-900 mb-4">
        {editingId ? `Edit Room ${editingRoom?.roomNumber || ''}` : 'Rooms'}
      </h2>

      <form onSubmit={handleSubmit} className="grid sm:grid-cols-4 gap-3 mb-6">
        <input
          required
          placeholder="Room #"
          value={form.roomNumber}
          onChange={(e) => setForm({ ...form, roomNumber: e.target.value })}
          className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-600"
        />
        <select
          value={form.roomType}
          onChange={(e) => setForm({ ...form, roomType: e.target.value })}
          className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-600"
        >
          <option value="single">Single</option>
          <option value="double">Double</option>
          <option value="triple">Triple</option>
          <option value="dormitory">Dormitory</option>
        </select>
        <input
          type="number"
          min={1}
          required
          placeholder="Capacity"
          value={form.capacity}
          onChange={(e) => setForm({ ...form, capacity: e.target.value })}
          className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-600"
        />
        <input
          type="number"
          min={0}
          required
          placeholder="Price/mo"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-600"
        />

        {/* Room images */}
        <div className="sm:col-span-4">
          {editingId && getRoomImages(editingRoom).length > 0 && (
            <div className="mb-3">
              <p className="text-xs font-semibold text-slate-600 uppercase mb-2">Current images</p>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {getRoomImages(editingRoom).map((src, i) => (
                  <img key={i} src={src} alt={`current-${i}`} className="w-full h-20 object-cover rounded-xl border border-slate-200" />
                ))}
              </div>
            </div>
          )}

          <label className="flex items-center justify-center gap-2 border-2 border-dashed border-slate-200 rounded-xl py-4 cursor-pointer hover:border-blue-400 hover:bg-blue-50/40 transition-all">
            <FiUploadCloud className="w-5 h-5 text-blue-500" />
            <span className="text-sm text-slate-500">
              {editingId ? 'Add new room images (optional, max 4)' : 'Add room images (optional, max 4)'}
            </span>
            <input type="file" accept="image/*" multiple hidden onChange={handleRoomFiles} />
          </label>

          {editingId && roomFiles.length > 0 && (
            <label className="mt-3 flex items-center gap-2 text-sm text-slate-600">
              <input
                type="checkbox"
                checked={replaceImages}
                onChange={(e) => setReplaceImages(e.target.checked)}
              />
              Replace existing images with these new ones
            </label>
          )}

          {roomPreviews.length > 0 && (
            <div className="mt-3 grid grid-cols-3 sm:grid-cols-4 gap-3">
              {roomPreviews.map((src, i) => (
                <div key={i} className="relative">
                  <img src={src} alt="room preview" className="w-full h-20 object-cover rounded-xl border border-slate-200" />
                  <button
                    type="button"
                    onClick={() => removeRoomFile(i)}
                    className="absolute -top-2 -right-2 bg-white border border-slate-200 rounded-full p-1 text-slate-500 hover:text-red-500 shadow-sm"
                  >
                    <FiX className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="sm:col-span-4 flex gap-3">
          <button
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-semibold rounded-xl"
          >
            {editingId ? <FiCheck /> : <FiPlus />}
            {saving ? 'Saving...' : editingId ? 'Update Room' : 'Add Room'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {myRooms.length === 0 ? (
        <EmptyState message="No rooms have been added yet." />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] text-sm whitespace-nowrap">
            <thead>
              <tr className="text-left text-xs font-semibold text-slate-500 uppercase border-b border-slate-100">
                <th className="py-2 pr-4">Image</th>
                <th className="py-2 pr-4">Room #</th>
                <th className="py-2 pr-4">Type</th>
                <th className="py-2 pr-4">Capacity</th>
                <th className="py-2 pr-4">Occupied</th>
                <th className="py-2 pr-4">Price</th>
                <th className="py-2 pr-4">Status</th>
                <th className="py-2 pr-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {myRooms.map((r) => (
                <tr
                  key={r._id}
                  className={`border-b border-slate-50 ${editingId === r._id ? 'bg-blue-50/40' : ''}`}
                >
                  <td className="py-2.5 pr-4">
                    {getRoomImage(r) ? (
                      <img
                        src={getRoomImage(r)}
                        alt={`room-${r.roomNumber}`}
                        className="w-14 h-10 object-cover rounded-lg border border-slate-200"
                      />
                    ) : (
                      <span className="text-xs text-slate-400">No image</span>
                    )}
                  </td>
                  <td className="py-2.5 pr-4 font-medium text-slate-800">{r.roomNumber}</td>
                  <td className="py-2.5 pr-4 capitalize">{r.roomType}</td>
                  <td className="py-2.5 pr-4">{r.capacity}</td>
                  <td className="py-2.5 pr-4">{r.occupied}</td>
                  <td className="py-2.5 pr-4">Rs. {r.price}</td>
                  <td className="py-2.5 pr-4">
                    <StatusBadge status={r.status} />
                  </td>
                  <td className="py-2.5 pr-4">
                    <RowActions
                      onEdit={() => startEdit(r)}
                      onDelete={() => handleDelete(r)}
                      deleting={deletingId === r._id}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

/* =========================================================
   3) APPLICATIONS
   ========================================================= */
export const ApplicationsPanel = () => {
  const { wardenApplications, fetchWardenApplications, updateApplicationStatus } =
    useContext(HostelContext)

  useEffect(() => {
    fetchWardenApplications()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
      <h2 className="text-lg font-bold text-slate-900 mb-4">Room Applications</h2>
      {wardenApplications.length === 0 ? (
        <EmptyState message="No applications received yet." />
      ) : (
        <div className="space-y-3">
          {wardenApplications.map((a) => (
            <div
              key={a._id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border border-slate-100 bg-slate-50/50"
            >
              <div>
                <p className="text-sm font-semibold text-slate-800">
                  Room: {a.room?.roomNumber || a.room}
                </p>
                {a.message && <p className="text-xs text-slate-500 mt-0.5">{a.message}</p>}
                <div className="mt-1"><StatusBadge status={a.status} /></div>
              </div>
              {a.status === 'pending' && (
                <div className="flex gap-2">
                  <button
                    onClick={() => updateApplicationStatus(a._id, 'approved')}
                    className="flex items-center gap-1 px-3 py-2 text-xs font-semibold bg-green-50 text-green-700 rounded-lg hover:bg-green-100"
                  >
                    <FiCheck /> Approve
                  </button>
                  <button
                    onClick={() => updateApplicationStatus(a._id, 'rejected')}
                    className="flex items-center gap-1 px-3 py-2 text-xs font-semibold bg-red-50 text-red-700 rounded-lg hover:bg-red-100"
                  >
                    <FiXCircle /> Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/* =========================================================
   4) NOTICES — create / read / update / delete
   ========================================================= */
export const NoticesPanel = () => {
  const { myHostel, notices, fetchWardenNotices, createNotice, updateNotice, deleteNotice } =
    useContext(HostelContext)
  const [form, setForm] = useState({ title: '', message: '' })
  const [editingId, setEditingId] = useState(null)
  const [posting, setPosting] = useState(false)
  const [deletingId, setDeletingId] = useState(null)

  useEffect(() => {
    if (myHostel?._id) fetchWardenNotices()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [myHostel?._id])

  if (!myHostel) return <EmptyState message="Create your hostel profile before posting a notice." />

  const resetForm = () => {
    setForm({ title: '', message: '' })
    setEditingId(null)
  }

  const startEdit = (n) => {
    setEditingId(n._id)
    setForm({ title: n.title || '', message: n.message || '' })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (n) => {
    if (!window.confirm(`Delete notice "${n.title}"?`)) return
    setDeletingId(n._id)
    await deleteNotice(n._id)
    setDeletingId(null)
    if (editingId === n._id) resetForm()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setPosting(true)
    const result = editingId ? await updateNotice(editingId, form) : await createNotice(form)
    if (result) resetForm()
    setPosting(false)
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
      <h2 className="text-lg font-bold text-slate-900 mb-4">
        {editingId ? 'Edit Notice' : 'Notice Board'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-3 mb-6">
        <input
          required
          placeholder="Notice title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-600"
        />
        <textarea
          required
          rows={3}
          placeholder="Notice message"
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-600"
        />
        <div className="flex gap-3">
          <button
            disabled={posting}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-semibold rounded-xl"
          >
            {posting ? 'Saving...' : editingId ? 'Update Notice' : 'Post Notice'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {notices.length === 0 ? (
        <EmptyState message="No notices have been posted yet." />
      ) : (
        <div className="space-y-3">
          {notices.map((n) => (
            <div
              key={n._id}
              className={`p-4 rounded-xl border bg-slate-50/50 ${
                editingId === n._id ? 'border-blue-300' : 'border-slate-100'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-800">{n.title}</p>
                  <p className="text-sm text-slate-600 mt-1">{n.message}</p>
                </div>
                <RowActions
                  onEdit={() => startEdit(n)}
                  onDelete={() => handleDelete(n)}
                  deleting={deletingId === n._id}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/* =========================================================
   5) FEES — create / read / update / delete
   ========================================================= */
const emptyFeeForm = {
  room: '',
  monthlyRent: '',
  messFee: '',
  electricityFee: '',
  otherCharges: '',
}

export const FeesPanel = () => {
  const { myHostel, myRooms, fetchMyRooms, fees, fetchWardenFees, createFee, updateFee, deleteFee } =
    useContext(HostelContext)
  const [form, setForm] = useState(emptyFeeForm)
  const [editingId, setEditingId] = useState(null)
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState(null)

  useEffect(() => {
    if (myHostel?._id) {
      fetchMyRooms(myHostel._id)
      fetchWardenFees()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [myHostel?._id])

  if (!myHostel) return <EmptyState message="Create your hostel profile before setting up a fee structure." />

  const roomLabel = (f) => {
    const id = f.room?._id || f.room
    const room = f.room?.roomNumber ? f.room : myRooms.find((r) => r._id === id)
    return room?.roomNumber ? `Room ${room.roomNumber}` : 'Room fee'
  }

  const resetForm = () => {
    setForm(emptyFeeForm)
    setEditingId(null)
  }

  const startEdit = (f) => {
    setEditingId(f._id)
    setForm({
      room: f.room?._id || f.room || '',
      monthlyRent: f.monthlyRent ?? '',
      messFee: f.messFee ?? '',
      electricityFee: f.electricityFee ?? '',
      otherCharges: f.otherCharges ?? '',
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (f) => {
    if (!window.confirm(`Delete the fee structure for ${roomLabel(f)}?`)) return
    setDeletingId(f._id)
    await deleteFee(f._id)
    setDeletingId(null)
    if (editingId === f._id) resetForm()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    const payload = {
      hostel: myHostel._id,
      room: form.room,
      monthlyRent: Number(form.monthlyRent) || 0,
      messFee: Number(form.messFee) || 0,
      electricityFee: Number(form.electricityFee) || 0,
      otherCharges: Number(form.otherCharges) || 0,
    }
    const result = editingId ? await updateFee(editingId, payload) : await createFee(payload)
    if (result) resetForm()
    setSaving(false)
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
      <h2 className="text-lg font-bold text-slate-900 mb-4">
        {editingId ? 'Edit Fee Structure' : 'Fee Structure'}
      </h2>

      <form onSubmit={handleSubmit} className="grid sm:grid-cols-3 gap-3 mb-6">
        <select
          required
          disabled={!!editingId}
          value={form.room}
          onChange={(e) => setForm({ ...form, room: e.target.value })}
          className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-600 disabled:opacity-60"
        >
          <option value="">Select Room</option>
          {myRooms.map((r) => (
            <option key={r._id} value={r._id}>
              Room {r.roomNumber}
            </option>
          ))}
        </select>
        <input
          type="number" min={0} required placeholder="Monthly Rent"
          value={form.monthlyRent}
          onChange={(e) => setForm({ ...form, monthlyRent: e.target.value })}
          className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-600"
        />
        <input
          type="number" min={0} placeholder="Mess Fee"
          value={form.messFee}
          onChange={(e) => setForm({ ...form, messFee: e.target.value })}
          className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-600"
        />
        <input
          type="number" min={0} placeholder="Electricity Fee"
          value={form.electricityFee}
          onChange={(e) => setForm({ ...form, electricityFee: e.target.value })}
          className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-600"
        />
        <input
          type="number" min={0} placeholder="Other Charges"
          value={form.otherCharges}
          onChange={(e) => setForm({ ...form, otherCharges: e.target.value })}
          className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-blue-600"
        />
        <div className="flex gap-3">
          <button
            disabled={saving}
            className="flex-1 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-semibold rounded-xl"
          >
            {saving ? 'Saving...' : editingId ? 'Update Fee' : 'Create Fee'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {fees.length === 0 ? (
        <EmptyState message="No fee structure has been created yet." />
      ) : (
        <div className="space-y-2">
          {fees.map((f) => (
            <div
              key={f._id}
              className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3 p-3 rounded-xl border bg-slate-50/50 text-sm ${
                editingId === f._id ? 'border-blue-300' : 'border-slate-100'
              }`}
            >
              <div>
                <p className="font-semibold text-slate-800">{roomLabel(f)}</p>
                <p className="text-xs text-slate-500 mt-0.5">
                  Rent {f.monthlyRent ?? 0} · Mess {f.messFee ?? 0} · Electricity {f.electricityFee ?? 0} · Other {f.otherCharges ?? 0}
                </p>
              </div>
              <div className="flex items-center justify-between sm:justify-end gap-4">
                <span className="font-semibold text-slate-800 whitespace-nowrap">Total: Rs. {f.totalAmount}</span>
                <RowActions
                  onEdit={() => startEdit(f)}
                  onDelete={() => handleDelete(f)}
                  deleting={deletingId === f._id}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/* =========================================================
   6) PAYMENTS
   ========================================================= */
export const PaymentsPanel = () => {
  const { wardenPayments, fetchWardenPayments, confirmPayment } = useContext(HostelContext)

  useEffect(() => {
    fetchWardenPayments()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
      <h2 className="text-lg font-bold text-slate-900 mb-4">Payments</h2>
      {wardenPayments.length === 0 ? (
        <EmptyState message="No payment requests received yet." />
      ) : (
        <div className="space-y-3">
          {wardenPayments.map((p) => (
            <div key={p._id} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50/50">
              <div>
                <p className="text-sm font-semibold text-slate-800">Rs. {p.amount} — {p.month}</p>
                <div className="mt-1"><StatusBadge status={p.status} /></div>
              </div>
              {p.status === 'pending' && (
                <button
                  onClick={() => confirmPayment(p._id)}
                  className="flex items-center gap-1 px-3 py-2 text-xs font-semibold bg-green-50 text-green-700 rounded-lg hover:bg-green-100"
                >
                  <FiCheck /> Confirm Paid
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/* =========================================================
   7) COMPLAINTS
   ========================================================= */
export const ComplaintsPanel = () => {
  const { wardenComplaints, fetchWardenComplaints, resolveComplaint } = useContext(HostelContext)

  useEffect(() => {
    fetchWardenComplaints()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
      <h2 className="text-lg font-bold text-slate-900 mb-4">Complaints</h2>
      {wardenComplaints.length === 0 ? (
        <EmptyState message="No complaints received yet." />
      ) : (
        <div className="space-y-3">
          {wardenComplaints.map((c) => (
            <div key={c._id} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-800">{c.subject}</p>
                <StatusBadge status={c.status} />
              </div>
              <p className="text-sm text-slate-600 mt-1">{c.message}</p>
              {c.status === 'pending' && (
                <button
                  onClick={() => resolveComplaint(c._id)}
                  className="mt-2 flex items-center gap-1 px-3 py-2 text-xs font-semibold bg-green-50 text-green-700 rounded-lg hover:bg-green-100"
                >
                  <FiCheck /> Mark Resolved
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/* =========================================================
   Shared small helpers
   ========================================================= */
export const StatusBadge = ({ status }) => {
  const styles = {
    pending: 'bg-amber-50 text-amber-700',
    approved: 'bg-green-50 text-green-700',
    paid: 'bg-green-50 text-green-700',
    resolved: 'bg-green-50 text-green-700',
    rejected: 'bg-red-50 text-red-700',
    available: 'bg-green-50 text-green-700',
    full: 'bg-amber-50 text-amber-700',
    unavailable: 'bg-red-50 text-red-700',
  }
  return (
    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${styles[status] || 'bg-slate-100 text-slate-600'}`}>
      {status}
    </span>
  )
}

export const EmptyState = ({ message }) => (
  <div className="text-center py-10 text-sm text-slate-400">{message}</div>
)