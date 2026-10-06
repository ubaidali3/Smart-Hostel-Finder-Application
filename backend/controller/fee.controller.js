import Fee from "../models/fee.model.js";
import Hosetl from "../models/hostel.model.js";
import Room from "../models/room.model.js";
import Application from "../models/application.model.js";

const createFee = async (req, res) => {
  try {
    const { hostel, room, monthlyRent, messFee, electricityFee, otherCharges } =
      req.body;

    const existHosetl = await Hosetl.findById(hostel);
    if (!existHosetl) {
      return res.status(404).json({
        success: false,
        message: "Hostel not found",
      });
    }
    if (existHosetl.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to manage this hostel",
      });
    }
    const existRoom = await Room.findById(room);
    if (!existRoom) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }
    if (existRoom.hostel.toString() !== existHosetl._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to manage this room",
      });
    }
    const totalAmount = monthlyRent + messFee + electricityFee + otherCharges;

    const feecreate = await Fee.create({
      hostel,
      room,
      monthlyRent,
      messFee,
      electricityFee,
      otherCharges,
      totalAmount,
    });

    return res.status(201).json({
      success: true,
      message: "Fee Structure created successfully",
      feecreate,
    });
  } catch (error) {
    console.error("Create Fee Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const getMyFee = async (req, res) => {
  try {
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

    const fee = await Fee.findOne({
      room: application.room,
    });
    if (!fee) {
      return res.status(404).json({
        success: false,
        message: "Fee structure not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Fee structure fetched successfully",
      fee,
    });
  } catch (error) {
    console.error("Get Fee Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

export { createFee,getMyFee };
