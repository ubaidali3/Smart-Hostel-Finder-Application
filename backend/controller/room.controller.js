import Room from '../models/room.model.js'
import Hosetl from '../models/hostel.model.js'
import { v2 as cloudinary } from 'cloudinary'

// Helper: buffer ko cloudinary pe upload karega
const uploadToCloudinary = (fileBuffer, folder = 'rooms') => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) return reject(error)
        resolve(result.secure_url)
      }
    )
    stream.end(fileBuffer)
  })
}

// ================= CREATE ROOM =================

const createRoom = async (req, res) => {
  try {
    const {
      hostel,
      roomType,
      occupied,
      roomNumber,
      capacity,
      price,
      facilities,
      status,
    } = req.body

    // Check hostel exists
    const hostelId = await Hosetl.findById(hostel)

    if (!hostelId) {
      return res.status(404).json({
        success: false,
        message: 'This hostel does not exist',
      })
    }

    // Check hostel belongs to logged-in warden
    if (hostelId.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not allowed to add a room to this hostel',
      })
    }

    // Upload images to cloudinary (agar files aayi hain)
    let imagesUrls = []
    if (req.files && req.files.length > 0) {
      imagesUrls = await Promise.all(
        req.files.map((file) => uploadToCloudinary(file.buffer))
      )
    }

    // Create room
    const room = await Room.create({
      hostel,
      roomType,
      occupied,
      roomNumber,
      capacity,
      price,
      facilities,
      images: imagesUrls,
      status,
    })

    return res.status(201).json({
      success: true,
      message: 'Room created successfully',
      room,
    })

  } catch (error) {
    console.error('Create Room Error:', error)

    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    })
  }
}


// ================= GET ALL ROOMS =================

const getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.find()

    return res.status(200).json({
      success: true,
      count: rooms.length,
      rooms,
    })

  } catch (error) {
    console.error('Get All Rooms Error:', error)

    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    })
  }
}


// ================= GET ROOM BY ID =================

const getRoomById = async (req, res) => {
  try {
    const singleRoom = await Room.findById(req.params.id)

    if (!singleRoom) {
      return res.status(404).json({
        success: false,
        message: 'Sorry, room data was not found',
      })
    }

    return res.status(200).json({
      success: true,
      singleRoom,
    })

  } catch (error) {
    console.error('Get Room By Id Error:', error)

    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    })
  }
}


// ================= UPDATE ROOM =================

const updateRoom = async (req, res) => {
  try {
    const roomId = req.params.id

    // Find room
    const existRoom = await Room.findById(roomId)

    if (!existRoom) {
      return res.status(404).json({
        success: false,
        message: 'This room does not exist',
      })
    }

    // Find hostel connected to this room
    const hostel = await Hosetl.findById(existRoom.hostel)

    if (!hostel) {
      return res.status(404).json({
        success: false,
        message: 'Hostel for this room does not exist',
      })
    }

    // Check hostel ownership
    if (hostel.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not allowed to update this room',
      })
    }

    // Do not allow hostel to be changed
    const {
      roomType,
      occupied,
      roomNumber,
      capacity,
      price,
      facilities,
      status,
    } = req.body

    let updateData = {
      roomType,
      occupied,
      roomNumber,
      capacity,
      price,
      facilities,
      status,
    }

    // Agar naye images aayi hain to unko bhi cloudinary pe upload kar ke add karein
    if (req.files && req.files.length > 0) {
      updateData.images = await Promise.all(
        req.files.map((file) => uploadToCloudinary(file.buffer))
      )
    }

    // Update room
    const roomUpdate = await Room.findByIdAndUpdate(
      roomId,
      updateData,
      {
        returnDocument: 'after',
        runValidators: true,
      }
    )

    return res.status(200).json({
      success: true,
      message: 'Room updated successfully',
      room: roomUpdate,
    })

  } catch (error) {
    console.error('Update Room Error:', error)

    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    })
  }
}


const deleteRoom = async (req, res) => {
  try {
    const roomId = req.params.id

    const existRoom = await Room.findById(roomId)

    if (!existRoom) {
      return res.status(404).json({
        success: false,
        message: 'This Room Does not exist'
      })
    }

    const hostel = await Hosetl.findById(existRoom.hostel)

    if (!hostel) {
      return res.status(404).json({
        success: false,
        message: 'Hostel for this room does not exist',
      })
    }
    if (hostel.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'You are not allowed to delete this room',
      })
    }

    const deleteRoom = await Room.findByIdAndDelete(roomId)
    return res.status(200).json({
      success: true,
      message: 'Room Delete Successfully',
      deleteRoom
    })
  } catch (error) {
    console.error("Delete Room Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
}

export {
  createRoom,
  getAllRooms,
  getRoomById,
  updateRoom,
  deleteRoom
}