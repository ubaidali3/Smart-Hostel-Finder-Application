import React from 'react'
import { Link } from 'react-router-dom'
import banner from '../assets/hostelhub_illustration_clean.png'
import { motion } from "framer-motion";

const Home = () => {
  // Container variant for staggering children animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  }

  // Item variant for sliding up text & buttons
  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  }

  // Stat cards entrance
  const statVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  }

  return (
    <section className="relative w-full min-h-[calc(100vh-6rem)] flex items-center overflow-hidden py-8 lg:py-12">

      {/* Brand-shape backdrop with soft pulse motion */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <motion.div 
          animate={{ scale: [1, 1.05, 1], rotate: [0, 3, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-24 -left-32 w-lg h-lg rounded-[45%_55%_60%_40%/50%_45%_55%_50%] bg-blue-50" 
        />
        <motion.div 
          animate={{ scale: [1, 1.08, 1], rotate: [0, -4, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/3 -right-40 w-md h-md rounded-[55%_45%_40%_60%/45%_55%_45%_55%] bg-indigo-50" 
        />
        <svg className="absolute bottom-8 left-6 opacity-40" width="72" height="72" viewBox="0 0 72 72">
          {Array.from({ length: 4 }).map((_, row) =>
            Array.from({ length: 4 }).map((_, col) => (
              <circle key={`${row}-${col}`} cx={8 + col * 18} cy={8 + row * 18} r="2.5" fill="#2563EB" />
            ))
          )}
        </svg>
      </div>

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-[1.05fr_1fr] gap-12 lg:gap-10 items-center">

        {/* Left Content with Staggered Entrance */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-start text-left space-y-7"
        >

          {/* Badge */}
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-blue-50 border border-blue-100 rounded-full text-blue-700 font-semibold text-xs sm:text-sm shadow-sm">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            Welcome to HostelHub
          </motion.div>

          {/* Heading */}
          <motion.h1 variants={itemVariants} className="text-4xl sm:text-5xl lg:text-[3.75rem] font-extrabold text-slate-900 tracking-tight leading-[1.1]">
            Your comfort,
            <br />
            <span className="text-blue-700">our priority.</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p variants={itemVariants} className="text-slate-600 text-base sm:text-lg max-w-md leading-relaxed">
            A safe, comfortable, and affordable hostel experience designed to
            feel like your second home — from move-in day to graduation.
          </motion.p>

          {/* Call-to-Action Buttons */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto pt-1">
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link
                to="/apply"
                className="block px-7 py-3.5 text-center text-sm font-bold text-white bg-blue-700 rounded-xl shadow-lg shadow-blue-700/25 hover:bg-blue-800 transition-all duration-200"
              >
                Apply for a room
              </Link>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link
                to="/facilities"
                className="block px-7 py-3.5 text-center text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 shadow-sm"
              >
                See the facilities
              </Link>
            </motion.div>
          </motion.div>

          {/* Quick Facts Grid */}
          <motion.div variants={itemVariants} className="grid grid-cols-3 gap-4 sm:gap-6 pt-6 mt-2 border-t border-slate-200 w-full max-w-md">
            
            <motion.div 
              variants={statVariants}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className='shadow-lg hover:shadow-xl px-4 sm:px-5 py-4 rounded-xl bg-white border border-slate-100 transition-shadow'
            >
              <p className="text-xl sm:text-2xl font-extrabold text-slate-900">24/7</p>
              <p className="text-xs text-slate-500 font-medium mt-0.5">On-site security</p>
            </motion.div>

            <motion.div 
              variants={statVariants}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className='shadow-lg hover:shadow-xl px-4 sm:px-5 py-4 rounded-xl bg-white border border-slate-100 transition-shadow'
            >
              <p className="text-xl sm:text-2xl font-extrabold text-slate-900">300+</p>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Residents today</p>
            </motion.div>

            <motion.div 
              variants={statVariants}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className='shadow-lg hover:shadow-xl px-4 sm:px-5 py-4 rounded-xl bg-white border border-slate-100 transition-shadow'
            >
              <p className="text-xl sm:text-2xl font-extrabold text-slate-900">4.8/5</p>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Resident rating</p>
            </motion.div>

          </motion.div>
        </motion.div>

        {/* Right Image with Slide & Scale Entrance */}
        <motion.div 
          initial={{ opacity: 0, x: 50, scale: 0.95 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="relative flex justify-center items-center"
        >
          <img
            src={banner}
            alt="Students relaxing outside a HostelHub building"
            className="w-full max-w-lg lg:max-w-none h-auto object-contain drop-shadow-sm"
          />

          {/* Floating Trust Badge */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: 1, 
              y: [0, -8, 0] // Soft infinite float animation
            }}
            transition={{ 
              opacity: { delay: 0.8, duration: 0.5 },
              y: { duration: 4, repeat: Infinity, ease: "easeInOut" }
            }}
            className="absolute bottom-4 left-2 sm:left-6 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl shadow-slate-900/10 border border-slate-100 px-4 py-3 flex items-center gap-3"
          >
            <div className="flex -space-x-2">
              <span className="w-8 h-8 rounded-full bg-blue-200 border-2 border-white shadow-xs" />
              <span className="w-8 h-8 rounded-full bg-indigo-200 border-2 border-white shadow-xs" />
              <span className="w-8 h-8 rounded-full bg-amber-200 border-2 border-white shadow-xs" />
            </div>
            <div className="leading-tight">
              <p className="text-sm font-extrabold text-slate-900">300+ residents</p>
              <p className="text-xs text-slate-500 font-medium">call HostelHub home</p>
            </div>
          </motion.div>

        </motion.div>
      </div>
    </section>
  )
}

export default Home