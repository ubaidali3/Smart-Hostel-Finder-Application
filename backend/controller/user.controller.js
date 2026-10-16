import User from "../models/user.model.js";
import Otp from "../models/otp.model.js";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "node:crypto";
import nodemailer from "nodemailer";

// ====================================
// HELPERS
// ====================================

const normalizeEmail = (email) => {
  return typeof email === "string"
    ? email.trim().toLowerCase()
    : "";
};

const validEmail = (email) => {
  return /^\S+@\S+\.\S+$/.test(email);
};

const validRole = (role) => {
  return ["student", "warden"].includes(role);
};

const createToken = (id) => {
  return jwt.sign(
    { id: id.toString() },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
};

const generateOtp = () => {
  return crypto.randomInt(100000, 1000000).toString();
};

const hashOtp = (email, code) => {
  return crypto
    .createHmac(
      "sha256",
      process.env.REGISTRATION_OTP_SECRET
    )
    .update(`${email}:${code}`)
    .digest("hex");
};

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT || 465),
  secure: Number(process.env.SMTP_PORT || 465) === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sendOtpEmail = async (email, code) => {
  await transporter.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: email,
    subject: "HostelHub - Email Verification",
    text: `Your HostelHub verification code is ${code}. It expires in 5 minutes.`,
  });
};

const publicUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  role: user.role,
});

// ====================================
// STEP 1: REQUEST REGISTRATION OTP
// ====================================

export const requestOtp = async (req, res) => {
  try {
    const { name, password, phone, role } = req.body;
    const email = normalizeEmail(req.body.email);

    if (
      typeof name !== "string" ||
      !name.trim() ||
      !validEmail(email) ||
      typeof password !== "string" ||
      password.length < 6
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Valid name, email and password of at least 6 characters are required",
      });
    }

    const selectedRole = role || "student";

    if (!validRole(selectedRole)) {
      return res.status(400).json({
        success: false,
        message: "Only student and warden registration is allowed",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "This email is already registered",
      });
    }

    const now = new Date();
    const lockUntil = new Date(Date.now() + 30000);

    // Atomically reserve the email for a new OTP request.
    // For an existing pending record, enforce the cooldown.
    let pending = await Otp.findOneAndUpdate(
      {
        email,
        $and: [
          {
            $or: [
              { lastSentAt: { $lte: new Date(Date.now() - 60000) } },
              { lastSentAt: { $exists: false } },
            ],
          },
          {
            $or: [
              { sendLockUntil: null },
              { sendLockUntil: { $lte: now } },
            ],
          },
          {
            $or: [
              { verifyingUntil: null },
              { verifyingUntil: { $lte: now } },
            ],
          },
        ],
      },
      {
        $set: {
          sendLockUntil: lockUntil,
        },
      },
      {  returnDocument: "after" }
    );

    if (!pending) {
      const existingPending = await Otp.findOne({ email });

      if (existingPending) {
        return res.status(429).json({
          success: false,
          message:
            "Please wait 60 seconds before requesting another OTP",
        });
      }

      try {
        pending = await Otp.create({
          email,
          name: name.trim(),
          passwordHash: await bcrypt.hash(password, 12),
          phone: typeof phone === "string" ? phone.trim() : "",
          role: selectedRole,
          codeHash: hashOtp(email, generateOtp()),
          attempts: 0,
          expireAt: new Date(Date.now() + 5 * 60 * 1000),
          lastSentAt: new Date(0),
          sendLockUntil: lockUntil,
        });
      } catch (error) {
        if (error.code === 11000) {
          return res.status(429).json({
            success: false,
            message: "An OTP request is already in progress",
          });
        }
        throw error;
      }
    }

    const code = generateOtp();
    const codeHash = hashOtp(email, code);
    const passwordHash = await bcrypt.hash(password, 12);

    // Update the reserved pending registration.
    const updated = await Otp.findOneAndUpdate(
      {
        _id: pending._id,
        sendLockUntil: lockUntil,
      },
      {
        $set: {
          name: name.trim(),
          passwordHash,
          phone: typeof phone === "string" ? phone.trim() : "",
          role: selectedRole,
          codeHash,
          attempts: 0,
          expireAt: new Date(Date.now() + 5 * 60 * 1000),
          lastSentAt: now,
        },
      },
      {  returnDocument: "after" }
    );

    if (!updated) {
      return res.status(409).json({
        success: false,
        message: "OTP request conflict. Please try again.",
      });
    }

    try {
      await sendOtpEmail(email, code);
    } catch (mailError) {
      console.error("SMTP Error:", mailError);

      await Otp.deleteOne({
        _id: updated._id,
        codeHash,
        sendLockUntil: lockUntil,
      });

      return res.status(502).json({
        success: false,
        message: "Unable to send OTP email. Check SMTP settings.",
      });
    }

    await Otp.updateOne(
      {
        _id: updated._id,
        codeHash,
        sendLockUntil: lockUntil,
      },
      {
        $set: { sendLockUntil: null },
      }
    );

    return res.status(200).json({
      success: true,
      requiresOtp: true,
      email,
      message: "OTP sent successfully. Check your email.",
    });
  } catch (error) {
    console.error("Request OTP Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to start registration",
    });
  }
};

// ====================================
// STEP 2: VERIFY OTP AND CREATE USER
// ====================================

export const verifyOtp = async (req, res) => {
  try {
    const email = normalizeEmail(req.body.email);
    const code = String(
      req.body.otp ?? req.body.code ?? ""
    ).trim();

    if (!validEmail(email) || !/^\d{6}$/.test(code)) {
      return res.status(400).json({
        success: false,
        message: "Valid email and 6-digit OTP are required",
      });
    }

    const now = new Date();
    const verificationLock = new Date(Date.now() + 30000);

    // Atomically reserve a verification attempt.
    const pending = await Otp.findOneAndUpdate(
      {
        email,
        expireAt: { $gt: now },
        attempts: { $lt: 5 },
        $or: [
          { verifyingUntil: null },
          { verifyingUntil: { $lte: now } },
        ],
      },
      {
        $set: { verifyingUntil: verificationLock },
      },
      {  returnDocument: "after" }
    );

    if (!pending) {
      return res.status(400).json({
        success: false,
        message:
          "OTP invalid, expired, locked or maximum attempts reached",
      });
    }

    const suppliedHash = Buffer.from(
      hashOtp(email, code),
      "hex"
    );

    const expectedHash = Buffer.from(
      pending.codeHash,
      "hex"
    );

    const isValid =
      suppliedHash.length === expectedHash.length &&
      crypto.timingSafeEqual(suppliedHash, expectedHash);

    if (!isValid) {
      await Otp.updateOne(
        {
          _id: pending._id,
          verifyingUntil: verificationLock,
        },
        {
          $inc: { attempts: 1 },
          $set: { verifyingUntil: null },
        }
      );

      return res.status(400).json({
        success: false,
        message: "Incorrect OTP",
      });
    }

    // Prevent an OTP being used while an email resend is active.
    if (
      pending.sendLockUntil &&
      pending.sendLockUntil > now
    ) {
      await Otp.updateOne(
        {
          _id: pending._id,
          verifyingUntil: verificationLock,
        },
        {
          $set: { verifyingUntil: null },
        }
      );

      return res.status(409).json({
        success: false,
        message: "OTP email is being sent. Please try again.",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      await Otp.deleteOne({ _id: pending._id });

      return res.status(409).json({
        success: false,
        message: "Email already registered",
      });
    }

    const user = new User({
      name: pending.name,
      email: pending.email,
      phone: pending.phone,
      role: pending.role,
      password: pending.passwordHash,
    });

    // Password was already hashed when requesting OTP.
    user.$locals.passwordAlreadyHashed = true;

    await user.save();

    await Otp.deleteOne({
      _id: pending._id,
      verifyingUntil: verificationLock,
    });

    return res.status(201).json({
      success: true,
      message: "Email verified. Registration successful.",
      user: publicUser(user),
    });
  } catch (error) {
    console.error("Verify OTP Error:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Email already registered",
      });
    }

    return res.status(500).json({
      success: false,
      message: "OTP verification failed",
    });
  }
};

// ====================================
// STEP 3: LOGIN
// ====================================

export const loginUser = async (req, res) => {
  try {
    const email = normalizeEmail(req.body.email);
    const { password } = req.body;

    if (
      !validEmail(email) ||
      typeof password !== "string" ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = createToken(user._id);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: publicUser(user),
    });
  } catch (error) {
    console.error("Login Error:", error);

    return res.status(500).json({
      success: false,
      message: "Login failed",
    });
  }
};

// ====================================
// STEP 4: PROFILE
// ====================================

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user: publicUser(user),
    });
  } catch (error) {
    console.error("Profile Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch profile",
    });
  }
};