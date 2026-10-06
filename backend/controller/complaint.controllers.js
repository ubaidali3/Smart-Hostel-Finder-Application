import Complaint from "../models/complaint.model.js";
import Application from "../models/application.model.js";
import Hostel from "../models/hostel.model.js";
const createComplaint = async (req, res) => {
  try {
    const { subject, message } = req.body;

    // 1. Required fields check
    if (!subject || !message) {
      return res.status(400).json({
        success: false,
        message: "Subject and message are required",
      });
    }

    // 2. Find student's approved application
    const application = await Application.findOne({
      student: req.user._id,
      status: "approved",
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "You don't have an approved room",
      });
    }

    // 3. Create complaint
    const complaint = await Complaint.create({
      student: req.user._id,
      hostel: application.hostel,
      room: application.room,
      subject,
      message,
    });

    return res.status(201).json({
      success: true,
      message: "Complaint submitted successfully",
      complaint,
    });
  } catch (error) {
    console.error("Create Complaint Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
const getWardenComplaints = async (req, res) => {
  try {
    // 1. Warden ke hostels find karo
    const hostels = await Hostel.find({
      owner: req.user._id,
    });

    // 2. Hostel IDs nikalo
    const hostelIds = hostels.map((hostel) => hostel._id);

    // 3. In hostels ki complaints find karo
    const complaints = await Complaint.find({
      hostel: { $in: hostelIds },
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Warden complaints fetched successfully",
      complaints,
    });
  } catch (error) {
    console.error("Get Warden Complaints Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const resolveComplaint = async (req, res) => {
  try {
    const complaintId = req.params.id;

    // 1. Complaint find karo
    const complaint = await Complaint.findById(complaintId);

    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: "Complaint not found",
      });
    }

    // 2. Check complaint already resolved hai ya nahi
    if (complaint.status === "resolved") {
      return res.status(400).json({
        success: false,
        message: "Complaint is already resolved",
      });
    }

    // 3. Hostel find karo
    const hostel = await Hostel.findById(complaint.hostel);

    if (!hostel) {
      return res.status(404).json({
        success: false,
        message: "Hostel not found",
      });
    }

    // 4. Check hostel belongs to logged-in warden
    if (hostel.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to resolve this complaint",
      });
    }

    // 5. Complaint resolve karo
    complaint.status = "resolved";
    complaint.resolvedAt = new Date();

    await complaint.save();

    return res.status(200).json({
      success: true,
      message: "Complaint resolved successfully",
      complaint,
    });
  } catch (error) {
    console.error("Resolve Complaint Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export { createComplaint,getWardenComplaints,resolveComplaint};