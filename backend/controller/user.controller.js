
import User from '../models/user.model.js'
import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken";


const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

const regitserUser = async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required',
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists',
      });
    }

    // Only allow known roles; anything else falls back to student
    const safeRole = ['student', 'warden'].includes(role) ? role : 'student';

    const user = await User.create({
      name,
      email,
      password,
      phone,
      role: safeRole,
    });

    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Register Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    });
  }
};


const loginUser = async (req, res) => {
  try {

    // 1. email, password lo
    const { email, password } = req.body

    // 2. check karo dono aaye hain
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'email, password are required'
      })
    }

    // 3. email se user find karo +password bhi lena hai
    const user = await User.findOne({ email }).select('+password')

    // 4. user nahi mila → error
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'User are not found'
      })
    }

    // 5. password compare karo
    const isMatch = await bcrypt.compare(password, user.password)

    // 6. password wrong → error

    // 7. successful login response
    if (isMatch) {

      const token = createToken(user._id)

      return res.json({
        success: true,
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role
        }
      })

    } else {
      return res.json({
        success: false,
        message: "your password war incorrect"
      })
    }

  } catch (error) {
    console.log(error);

    return res.json({
      success: false,
      message: error.message
    });
  }
}


const getProfile = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      user: req.user
    })
  } catch (error) {
    console.log(error)

    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}


export { regitserUser, loginUser, getProfile };

