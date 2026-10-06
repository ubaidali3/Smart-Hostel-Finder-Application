import Payment from "../models/payment.model.js";
import Fee from "../models/fee.model.js";
import Application from "../models/application.model.js";
import Room from '../models/room.model.js'
import Hostel from '../models/hostel.model.js'
import { application } from "express";
const createPayment = async (req, res) => {
  try {
    const { fee, month } = req.body;

    // Check student has an approved room
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

    // Find fee structure
    const existFee = await Fee.findById(fee);

    if (!existFee) {
      return res.status(404).json({
        success: false,
        message: "Fee structure not found",
      });
    }

    // Check fee belongs to student's room
    if (existFee.room.toString() !== application.room.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to pay this fee",
      });
    }

    // Create payment request
    const payment = await Payment.create({
      student: req.user._id,
      fee: fee,
      amount: existFee.totalAmount,
      month: month,
      paymentMethod: "cash",
    });

    return res.status(201).json({
      success: true,
      message: "Payment request created successfully",
      payment,
    });
  } catch (error) {
    console.error("Create Payment Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

const getWardenPayment = async (req, res) => {
  try {
    // 1. Warden ke hostels find karo
    const hostels = await Hostel.find({
      owner: req.user._id,
    });

    // 2. Hostel IDs nikalo
    const hostelIds = hostels.map((hostel) => hostel._id);

    // 3. In hostels ke rooms find karo
    const rooms = await Room.find({
      hostel: { $in: hostelIds },
    });

    // 4. Room IDs nikalo
    const roomIds = rooms.map((room) => room._id);

    // 5. In rooms ki fee structures find karo
    const fees = await Fee.find({
      room: { $in: roomIds },
    });

    // 6. Fee IDs nikalo
    const feeIds = fees.map((fee) => fee._id);

    // 7. In fees ki payments find karo
    const payments = await Payment.find({
      fee: { $in: feeIds },
    });

    return res.status(200).json({
      success: true,
      message: "Warden payments fetched successfully",
      payments,
    });
  } catch (error) {
    console.error("Get Warden Payment Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
const confirmPayment = async (req, res) => {
  try {
    const paymentId = req.params.id;

    // 1. Payment find karo
    const payment = await Payment.findById(paymentId);

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    // 2. Check payment already paid hai ya nahi
    if (payment.status === "paid") {
      return res.status(400).json({
        success: false,
        message: "Payment is already paid",
      });
    }

    // 3. Fee find karo
    const fee = await Fee.findById(payment.fee);

    if (!fee) {
      return res.status(404).json({
        success: false,
        message: "Fee structure not found",
      });
    }

    // 4. Room find karo
    const room = await Room.findById(fee.room);

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }

    // 5. Hostel find karo
    const hostel = await Hostel.findById(room.hostel);

    if (!hostel) {
      return res.status(404).json({
        success: false,
        message: "Hostel not found",
      });
    }

    // 6. Check this hostel belongs to logged-in warden
    if (hostel.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to confirm this payment",
      });
    }

    // 7. Payment confirm karo
    payment.status = "paid";
    payment.paidAt = new Date();

    await payment.save();

    return res.status(200).json({
      success: true,
      message: "Payment confirmed successfully",
      payment,
    });
  } catch (error) {
    console.error("Confirm Payment Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
export { createPayment ,getWardenPayment,confirmPayment};