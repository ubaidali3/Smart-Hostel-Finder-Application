import mongoose from 'mongoose'
const hostelSchema = new mongoose.Schema(
  {
    hostelName: {
      type: String,
      required: [true, 'Hostel name is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true,
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
      trim: true,
    },
    // Hostel ka owner ya warden (User model se link)
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    images: [
      {
        type: String, // image URLs
      },
    ],
    facilities: [
      {
        type: String, // e.g. WiFi, AC, Laundry, Mess, Parking
      },
    ],
    rules: [
      {
        type: String, // hostel ke rules/policies
      },
    ],
    contact: {
      type: String, // phone number ya email
      trim: true,
    },
  },
  {
    timestamps: true, // createdAt, updatedAt auto
  }
);


export default mongoose.model('Hostel', hostelSchema)