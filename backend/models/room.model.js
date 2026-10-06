import mongoose from 'mongoose'
const roomSchema = new mongoose.Schema(
  {
    hostel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hostel',
      required: true,
    },
    roomType: {
      type: String,
      enum: ['single', 'double', 'triple', 'dormitory'],
      default: 'single',
    },
    occupied: {
      type: Number,
      default: 0,
      min: 0,
    },
    roomNumber: {
      type: String,
      required: [true, 'Room number is required'],
      trim: true,
    },
    capacity: {
      type: Number,
      required: true,
      min: 1,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
    },
    facilities: [
      {
        type: String, // e.g. attached bathroom, balcony, AC
      },
    ],
    images: [
  {
    type: String, // Cloudinary image URLs
  },
],
    status: {
      type: String,
      enum: ['available', 'full', 'unavailable'],
      default: 'available',
    },
    
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Room', roomSchema)