import Notice from "../models/notice.model.js";
import Hostel from "../models/hostel.model.js";
import Application from "../models/application.model.js";
const createNotice = async (req, res) => {
  try {
    const { hostel, title, message } = req.body;

    // 1. Required fields check
    if (!hostel || !title || !message) {
      return res.status(400).json({
        success: false,
        message: "Hostel, title and message are required",
      });
    }

    // 2. Find hostel
    const existHostel = await Hostel.findById(hostel);

    if (!existHostel) {
      return res.status(404).json({
        success: false,
        message: "Hostel not found",
      });
    }

    // 3. Check hostel belongs to logged-in warden
    if (existHostel.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to create notice for this hostel",
      });
    }

    // 4. Create notice
    const notice = await Notice.create({
      hostel,
      title,
      message,
      createdBy: req.user._id,
    });

    return res.status(201).json({
      success: true,
      message: "Notice created successfully",
      notice,
    });
  } catch (error) {
    console.error("Create Notice Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
const getMyNotices = async (req, res) => {
  try {
    // 1. Student ki approved application find karo
    const application = await Application.findOne({
      student: req.user._id,
      status: "approved",
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "You don't have an approved hostel",
      });
    }

    // 2. Student ke hostel ke notices find karo
    const notices = await Notice.find({
      hostel: application.hostel,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Notices fetched successfully",
      notices,
    });
  } catch (error) {
    console.error("Get My Notices Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
const getWardenNotices = async (req, res) => {
  try {
    const hostel = await Hostel.findOne({
      owner: req.user._id,
    });

    if (!hostel) {
      return res.status(404).json({
        success: false,
        message: "You don't have a hostel",
      });
    }

    const notices = await Notice.find({
      hostel: hostel._id,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Warden notices fetched successfully",
      notices,
    });
  } catch (error) {
    console.error("Get Warden Notices Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
const deleteNotice = async (req, res) => {
  try {
    const { id } = req.params;

    // Notice find karo
    const notice = await Notice.findById(id);

    if (!notice) {
      return res.status(404).json({
        success: false,
        message: "Notice not found",
      });
    }

    // Check karo notice isi logged-in warden ka hai
    if (notice.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to delete this notice",
      });
    }

    // Database se delete
    await Notice.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Notice deleted successfully",
    });

  } catch (error) {
    console.error("Delete Notice Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export { createNotice ,getMyNotices,getWardenNotices, deleteNotice};