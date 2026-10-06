import Hosetl from "../models/hostel.model.js";
import Room from '../models/room.model.js'
import { v2 as cloudinary } from 'cloudinary'

// Helper: file buffer ko Cloudinary par upload karke secure_url return karta hai
const uploadToCloudinary = (fileBuffer, folder = 'hostels') => {
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
const createHosetl = async (req, res) => {
  try {
    const {
      hostelName,
      description,
      city,
      address,
      facilities,
      rules,
      contact,
    } = req.body;

    if (!hostelName || !city || !address) {
      return res.status(400).json({
        success: false,
        message: "Hostel name, city and address are required",
      });
    }

    // Images Cloudinary par upload karo aur unke URLs save karo
    let images = [];
    if (req.files && req.files.length > 0) {
      images = await Promise.all(
        req.files.map((file) => uploadToCloudinary(file.buffer))
      );
    }

    const hostel = await Hosetl.create({
      hostelName,
      description,
      city,
      owner: req.user._id,
      images,
      facilities,
      rules,
      address,
      contact,
    });

    return res.status(201).json({
      success: true,
      message: "Hostel created successfully",
      hostel,
    });
  } catch (error) {
    console.error("Create Hostel Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const getAllHosetls = async (req, res) => {
  try {
    const hostels = await Hosetl.find();

    return res.status(200).json({
      success: true,
      count: hostels.length,
      hostels,
    });

  } catch (error) {
    console.error("Get All Hosetls Error:", error);

    return res.status(500).json({
      success: false,
      message: "server error",
      error: error.message,
    });
  }
};


const getHostelById = async (req, res) => {
  try {
    const singleHosetl = await Hosetl.findById(req.params.id);

    if (singleHosetl) {
      return res.status(200).json({
        success: true,
        singleHosetl,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "sorry data cannot find",
      });
    }
  } catch (error) {
    console.error("Get Hosetl By Id Error:", error);
    return res.status(500).json({
      success: false,
      message: "server error",
      error: error.message,
    });
  }
};

const updateHostel = async (req, res) => {
  try {
    // 1. URL se hostel ID
    const hostelId = req.params.id;

    // 2. Pehle check karo hostel exist karta hai ya nahi
    const existHostel = await Hosetl.findById(hostelId);

    if (!existHostel) {
      return res.status(404).json({
        success: false,
        message: "This hostel does not exist",
      });
    }

    // 3. Check karo logged-in warden isi hostel ka owner hai ya nahi
    if (existHostel.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to update this hostel",
      });
    }

    // 4. Client se update hone wala data lo
    const {
      hostelName,
      description,
      city,
      address,
      facilities,
      rules,
      contact,
      replaceImages,
    } = req.body;

    // 5. Sirf wohi fields update karo jo bheji gayi hain
    const updateData = {};
    if (hostelName !== undefined) updateData.hostelName = hostelName;
    if (description !== undefined) updateData.description = description;
    if (city !== undefined) updateData.city = city;
    if (address !== undefined) updateData.address = address;
    if (facilities !== undefined) updateData.facilities = facilities;
    if (rules !== undefined) updateData.rules = rules;
    if (contact !== undefined) updateData.contact = contact;

    // 6. Nayi images aayi hain to Cloudinary par upload karo
    if (req.files && req.files.length > 0) {
      const newImages = await Promise.all(
        req.files.map((file) => uploadToCloudinary(file.buffer))
      );

      // replaceImages === "true" ho to purani images hata do, warna nayi add karo
      updateData.images =
        replaceImages === "true" || replaceImages === true
          ? newImages
          : [...(existHostel.images || []), ...newImages];
    }

    const updatedHostel = await Hosetl.findByIdAndUpdate(
      hostelId,
      updateData,
      {
        returnDocument: "after",
        runValidators: true,
      },
    );

    // 7. Response
    return res.status(200).json({
      success: true,
      message: "Hostel updated successfully",
      hostel: updatedHostel,
    });
  } catch (error) {
    console.error("Update Hostel Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const deleteHostel = async (req, res) => {
  try {
    const hostelId = req.params.id;

    const existHosetl = await Hosetl.findById(hostelId);
    if (!existHosetl) {
      return res.status(404).json({
        success: false,
        message: "This hostel does not exist",
      });
    }
    if (existHosetl.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to Delete this hostel",
      });
    }
    const deleteHosetl = await Hosetl.findByIdAndDelete(hostelId);

    return res.status(200).json({
      success: true,
      message: "Hostel Delete successfully",
      hostel: deleteHosetl,
    });
  } catch (error) {
    console.error("Delete Hostel Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};


const searchHostels = async (req, res) => {
  try {
    const {
      city,
      roomType,
      maxPrice,
      facility,
      page = 1,
      limit = 5,
    } = req.query;

    // =========================
    // 1. Validation
    // =========================

    // maxPrice validation
    if (maxPrice && isNaN(Number(maxPrice))) {
      return res.status(400).json({
        success: false,
        message: "Invalid maxPrice",
      });
    }

    // roomType validation
    const allowedRoomTypes = [
      "single",
      "double",
      "triple",
      "dormitory",
    ];

    if (roomType && !allowedRoomTypes.includes(roomType)) {
      return res.status(400).json({
        success: false,
        message: "Invalid roomType",
      });
    }

    // Pagination validation
    if (Number(page) < 1 || Number(limit) < 1) {
      return res.status(400).json({
        success: false,
        message: "Page and limit must be greater than 0",
      });
    }

    // Maximum limit validation
    if (Number(limit) > 50) {
      return res.status(400).json({
        success: false,
        message: "Limit cannot be greater than 50",
      });
    }

    // =========================
    // 2. Hostel filter
    // =========================

    const hostelFilter = {};

    // City filter
    if (city) {
      hostelFilter.city = {
        $regex: city,
        $options: "i",
      };
    }

    // Facility filter
    if (facility) {
      hostelFilter.facilities = {
        $regex: facility,
        $options: "i",
      };
    }

    // =========================
    // 3. Room filtering
    // =========================

    if (roomType || maxPrice) {
      const roomFilter = {
        status: "available",
      };

      // Room type
      if (roomType) {
        roomFilter.roomType = roomType;
      }

      // Maximum price
      if (maxPrice) {
        roomFilter.price = {
          $lte: Number(maxPrice),
        };
      }

      // Find matching rooms
      const rooms = await Room.find(roomFilter);

      // Get hostel IDs from matching rooms
      const matchingHostelIds = rooms.map((room) =>
        room.hostel.toString()
      );

      // Add matching hostel IDs to hostel filter
      hostelFilter._id = {
        $in: matchingHostelIds,
      };
    }

    // =========================
    // 4. Total matching hostels
    // =========================

    const totalHostels = await Hosetl.countDocuments(
      hostelFilter
    );

    // =========================
    // 5. Pagination
    // =========================

    const pageNumber = Number(page);
    const limitNumber = Number(limit);

    const skip = (pageNumber - 1) * limitNumber;

    const totalPages = Math.ceil(
      totalHostels / limitNumber
    );

    // =========================
    // 6. Find hostels
    // =========================

    const hostels = await Hosetl.find(hostelFilter)
      .skip(skip)
      .limit(limitNumber);

    // =========================
    // 7. No hostels found
    // =========================

    if (hostels.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No hostels found",
      });
    }

    // =========================
    // 8. Success response
    // =========================

    return res.status(200).json({
      success: true,
      message: "Hostels fetched successfully",
      currentPage: pageNumber,
      totalHostels,
      totalPages,
      hostels,
    });
  } catch (error) {
    console.error("Search Hostel Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
export { createHosetl, getAllHosetls, getHostelById, updateHostel ,deleteHostel,searchHostels};