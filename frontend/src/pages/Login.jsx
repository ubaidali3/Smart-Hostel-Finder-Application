
import React, { useContext, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FiMail,
  FiLock,
  FiUser,
  FiEye,
  FiEyeOff,
  FiArrowRight,
  FiLogIn,
  FiUserPlus,
  FiHome
} from 'react-icons/fi'
import { useLocation, useNavigate } from 'react-router-dom'
import { HostelContext } from '../context/HosetlContext'

// Animation Variants
const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" }
  }
}

const inputContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.2 }
  }
}

const inputItemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 }
  }
}

// Form switch hote waqt ki animation
const formSwitchVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.35, ease: "easeOut" }
  },
  exit: {
    opacity: 0,
    x: -20,
    transition: { duration: 0.2 }
  }
}

const Login = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const {
    token,
    authLoading,
    registerUser,
    loginUser,
  } = useContext(HostelContext)

  // 'login' ya 'register'
  const [mode, setMode] = useState(
    location.pathname === '/register' ? "register" : "login"
  )

  const [showPassword, setShowPassword] = useState(false)

  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  })

  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'student',
  })

  const handleLoginChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value
    })
  }

  const handleRegisterChange = (e) => {
    setRegisterData({
      ...registerData,
      [e.target.name]: e.target.value
    })
  }

  const handleLoginSubmit = async (e) => {
    e.preventDefault()

    const user = await loginUser(loginData)

    if (user) {
      // Warden ko dashboard par le jao
      // Student ko home par
      navigate(user.role === 'warden' ? '/dashboard' : '/')
    }
  }

  const handleRegisterSubmit = async (e) => {
    e.preventDefault()

    const success = await registerUser(registerData)

    if (success) {
      setLoginData({
        email: registerData.email,
        password: ''
      })

      setMode('login')
    }
  }

  const switchToRegister = () => {
    setShowPassword(false)
    setMode('register')
  }

  const switchToLogin = () => {
    setShowPassword(false)
    setMode('login')
  }

  // ✅ Yahan == nahi, === use hoga
  const isLogin = mode === 'login'

  return (

    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 px-4 py-12 relative overflow-hidden">

      {/* Background Decorative Blur Blobs */}
      <div className="absolute top-1/4 -left-20 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl pointer-events-none" />

      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-indigo-400/20 rounded-full blur-3xl pointer-events-none" />

      {/* Main Card */}
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-100 p-8 sm:p-10 relative z-10"
      >

        {/* Header Section */}
        <div className="text-center mb-8">

          <motion.div
            key={mode + '-icon'}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 200,
              delay: 0.1
            }}
            className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-blue-100"
          >
            {isLogin
              ? <FiLogIn className="w-7 h-7" />
              : <FiUserPlus className="w-7 h-7" />
            }
          </motion.div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {isLogin ? 'Welcome Back!' : 'Create Account'}
          </h2>

          <p className="text-slate-500 text-sm mt-2">
            {isLogin
              ? 'Please enter your details to sign in'
              : 'Fill in your details to get started'
            }
          </p>
        </div>

        {/* Forms */}
        <AnimatePresence mode="wait">

          {isLogin ? (

            <motion.form
              key="login-form"
              variants={formSwitchVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onSubmit={handleLoginSubmit}
            >

              <motion.div
                variants={inputContainerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-5"
              >

                {/* Email Input */}
                <motion.div
                  variants={inputItemVariants}
                  className="space-y-1.5"
                >
                  <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Email Address
                  </label>

                  <div className="relative flex items-center">

                    <FiMail className="absolute left-4 text-slate-400 w-5 h-5 pointer-events-none" />

                    <input
                      type="email"
                      name="email"
                      required
                      value={loginData.email}
                      onChange={handleLoginChange}
                      placeholder="enter your email"
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-600/10 transition-all duration-200"
                    />

                  </div>
                </motion.div>

                {/* Password Input */}
                <motion.div
                  variants={inputItemVariants}
                  className="space-y-1.5"
                >

                  <div className="flex justify-between items-center">

                    <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Password
                    </label>

                    <a
                      href="#forgot"
                      className="text-xs text-blue-600 hover:text-blue-700 font-medium transition-colors"
                    >
                      Forgot Password?
                    </a>

                  </div>

                  <div className="relative flex items-center">

                    <FiLock className="absolute left-4 text-slate-400 w-5 h-5 pointer-events-none" />

                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      required
                      value={loginData.password}
                      onChange={handleLoginChange}
                      placeholder="enter your password"
                      className="w-full pl-11 pr-11 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-600/10 transition-all duration-200"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 text-slate-400 hover:text-slate-600 focus:outline-none"
                    >
                      {showPassword
                        ? <FiEyeOff className="w-5 h-5" />
                        : <FiEye className="w-5 h-5" />
                      }
                    </button>

                  </div>
                </motion.div>

                {/* Submit Button */}
                <motion.div
                  variants={inputItemVariants}
                  className="pt-2"
                >

                  <motion.button
                    type="submit"
                    disabled={authLoading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-3.5 px-6 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {authLoading ? 'Signing In...' : 'Sign In'}

                    {!authLoading && (
                      <FiArrowRight className="w-4 h-4" />
                    )}
                  </motion.button>

                </motion.div>

              </motion.div>

            </motion.form>

          ) : (

            <motion.form
              key="register-form"
              variants={formSwitchVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onSubmit={handleRegisterSubmit}
            >

              <motion.div
                variants={inputContainerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-5"
              >

                {/* Name Input */}
                <motion.div
                  variants={inputItemVariants}
                  className="space-y-1.5"
                >

                  <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Full Name
                  </label>

                  <div className="relative flex items-center">

                    <FiUser className="absolute left-4 text-slate-400 w-5 h-5 pointer-events-none" />

                    <input
                      type="text"
                      name="name"
                      required
                      value={registerData.name}
                      onChange={handleRegisterChange}
                      placeholder="enter your full name"
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-600/10 transition-all duration-200"
                    />

                  </div>

                </motion.div>

                {/* Email Input */}
                <motion.div
                  variants={inputItemVariants}
                  className="space-y-1.5"
                >

                  <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Email Address
                  </label>

                  <div className="relative flex items-center">

                    <FiMail className="absolute left-4 text-slate-400 w-5 h-5 pointer-events-none" />

                    <input
                      type="email"
                      name="email"
                      required
                      value={registerData.email}
                      onChange={handleRegisterChange}
                      placeholder="enter your email"
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-600/10 transition-all duration-200"
                    />

                  </div>

                </motion.div>

                {/* Password Input */}
                <motion.div
                  variants={inputItemVariants}
                  className="space-y-1.5"
                >

                  <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Password
                  </label>

                  <div className="relative flex items-center">

                    <FiLock className="absolute left-4 text-slate-400 w-5 h-5 pointer-events-none" />

                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      required
                      minLength={6}
                      value={registerData.password}
                      onChange={handleRegisterChange}
                      placeholder="create a password"
                      className="w-full pl-11 pr-11 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-600/10 transition-all duration-200"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 text-slate-400 hover:text-slate-600 focus:outline-none"
                    >
                      {showPassword
                        ? <FiEyeOff className="w-5 h-5" />
                        : <FiEye className="w-5 h-5" />
                      }
                    </button>

                  </div>

                </motion.div>
                {/* Role Input */}
<motion.div
  variants={inputItemVariants}
  className="space-y-1.5"
>
  <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
    Select Role
  </label>

  <div className="relative flex items-center">
    <FiHome className="absolute left-4 text-slate-400 w-5 h-5 pointer-events-none" />

    <select
      name="role"
      value={registerData.role}
      onChange={handleRegisterChange}
      className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-600/10 transition-all duration-200"
    >
      <option value="student">Student</option>
      <option value="warden">Warden</option>
    </select>
  </div>
</motion.div>

                {/* Submit Button */}
                <motion.div
                  variants={inputItemVariants}
                  className="pt-2"
                >

                  <motion.button
                    type="submit"
                    disabled={authLoading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-3.5 px-6 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {authLoading ? 'Creating Account...' : 'Create Account'}

                    {!authLoading && (
                      <FiArrowRight className="w-4 h-4" />
                    )}
                  </motion.button>

                </motion.div>

              </motion.div>

            </motion.form>
            

          )}

        </AnimatePresence>

        {/* Footer Link */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center text-xs text-slate-500 mt-8"
        >

          {isLogin ? (

            <>
              Don't have an account?{' '}

              <button
                type="button"
                onClick={switchToRegister}
                className="text-blue-600 font-bold hover:underline"
              >
                Create Account
              </button>
            </>

          ) : (

            <>
              Already have an account?{' '}

              <button
                type="button"
                onClick={switchToLogin}
                className="text-blue-600 font-bold hover:underline"
              >
                Sign In
              </button>
            </>

          )}

        </motion.p>

      </motion.div>

    </div>
  )
}

export default Login
