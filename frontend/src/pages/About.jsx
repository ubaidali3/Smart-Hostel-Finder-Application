import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import image from '../assets/About-image.png'

import {
  FiSearch,
  FiHome,
  FiCheckCircle,
  FiMapPin,
  FiUsers,
  FiShield,
  FiArrowRight
} from 'react-icons/fi'

// Animation Variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
}

const About = () => {
  return (
    <div className="w-full py-8 sm:py-12 lg:py-16 space-y-20 overflow-x-hidden">

      {/* ================= HERO ================= */}
      <section>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Image */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative order-2 lg:order-1"
          >

            <div className="absolute -inset-3 bg-blue-100 rounded-3xl blur-2xl opacity-60"></div>

            <div className="relative overflow-hidden rounded-3xl bg-white border border-slate-200 shadow-xl">

              <img
                src={image}
                alt="Students finding hostel accommodation"
                className="w-full h-auto object-cover"
              />

              {/* Floating Card with continuous Floating Animation */}
              <motion.div 
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-5 left-5 right-5 sm:right-auto bg-white/95 backdrop-blur-md rounded-2xl shadow-lg border border-slate-100 px-4 py-3 flex items-center gap-3"
              >

                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <FiMapPin className="w-5 h-5" />
                </div>

                <div>
                  <p className="text-sm font-bold text-slate-900">
                    Find hostels anywhere
                  </p>

                  <p className="text-xs text-slate-500">
                    Explore multiple cities
                  </p>
                </div>

              </motion.div>

            </div>
          </motion.div>


          {/* Content */}
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="space-y-6 order-1 lg:order-2"
          >

            {/* Badge */}
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-blue-50 border border-blue-100 rounded-full">

              <span className="w-2 h-2 rounded-full bg-blue-600"></span>

              <span className="text-blue-600 font-bold text-xs tracking-widest uppercase">
                ABOUT HOSTELHUB
              </span>

            </motion.div>


            {/* Heading */}
            <motion.h1 variants={fadeInUp} className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">

              Find a place that
              <br />

              <span className="text-blue-600">
                feels like home.
              </span>

            </motion.h1>


            {/* Description */}
            <motion.p variants={fadeInUp} className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-xl">

              HostelHub is a hostel discovery platform designed to make
              finding student accommodation simple, transparent and
              convenient.

            </motion.p>

            <motion.p variants={fadeInUp} className="text-slate-500 text-sm sm:text-base leading-relaxed max-w-xl">

              Whether you're moving to a new city for university,
              looking for an affordable room, or comparing different
              hostels, HostelHub helps you explore your options in one place.

            </motion.p>


            {/* Highlights */}
            <motion.div variants={staggerContainer} className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">

              {["Multiple Cities", "Compare Hostels", "Room Information", "Facilities & Pricing"].map((text, idx) => (
                <motion.div 
                  key={idx}
                  variants={fadeInUp}
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-100"
                >
                  <FiCheckCircle className="text-blue-600 w-5 h-5 shrink-0" />
                  <span className="text-sm font-semibold text-slate-700">{text}</span>
                </motion.div>
              ))}

            </motion.div>


            {/* Buttons */}
            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-3 pt-3">

              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link
                  to="/hostels"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-blue-600 rounded-xl shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all w-full sm:w-auto"
                >
                  Explore Hostels
                  <FiArrowRight />
                </Link>
              </motion.div>


              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all w-full sm:w-auto"
                >
                  Contact Us
                </Link>
              </motion.div>

            </motion.div>

          </motion.div>

        </div>
      </section>


      {/* ================= WHY HOSTELHUB ================= */}
      <section>

        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          className="text-center max-w-2xl mx-auto space-y-3"
        >

          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 rounded-full text-blue-600 text-xs font-bold">
            WHY HOSTELHUB
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Everything you need to find the right hostel
          </h2>

          <p className="text-sm sm:text-base text-slate-500">
            No more searching through random listings. Explore,
            compare and choose your accommodation from one platform.
          </p>

        </motion.div>


        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10"
        >

          {/* Card 1 */}
          <motion.div 
            variants={fadeInUp}
            whileHover={{ y: -6 }}
            className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-lg hover:border-blue-200 transition-all"
          >

            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-5">
              <FiSearch className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-bold text-slate-900 mb-2">
              Easy Hostel Search
            </h3>

            <p className="text-sm text-slate-500 leading-relaxed">
              Search hostels by city, location, budget, room type
              and other requirements.
            </p>

          </motion.div>


          {/* Card 2 */}
          <motion.div 
            variants={fadeInUp}
            whileHover={{ y: -6 }}
            className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-lg hover:border-blue-200 transition-all"
          >

            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-5">
              <FiHome className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-bold text-slate-900 mb-2">
              Detailed Hostel Information
            </h3>

            <p className="text-sm text-slate-500 leading-relaxed">
              View hostel photos, rooms, prices, facilities,
              availability and other important information.
            </p>

          </motion.div>


          {/* Card 3 */}
          <motion.div 
            variants={fadeInUp}
            whileHover={{ y: -6 }}
            className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-lg hover:border-blue-200 transition-all"
          >

            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-5">
              <FiShield className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-bold text-slate-900 mb-2">
              Better Decisions
            </h3>

            <p className="text-sm text-slate-500 leading-relaxed">
              Compare different hostels and choose the option
              that best matches your needs and budget.
            </p>

          </motion.div>

        </motion.div>

      </section>


      {/* ================= HOW IT WORKS ================= */}
      <section className="bg-slate-900 rounded-3xl p-8 sm:p-10 lg:p-14 text-white">

        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          className="text-center max-w-2xl mx-auto"
        >

          <p className="text-blue-400 text-xs font-bold tracking-widest uppercase mb-3">
            SIMPLE PROCESS
          </p>

          <h2 className="text-2xl sm:text-3xl font-bold">
            How HostelHub Works
          </h2>

          <p className="text-slate-400 text-sm mt-3">
            Finding your next hostel is just a few simple steps away.
          </p>

        </motion.div>


        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          variants={staggerContainer}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-12"
        >

          {/* Step 1 */}
          <motion.div variants={fadeInUp} className="text-center">

            <motion.div 
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="w-12 h-12 mx-auto rounded-full bg-blue-600 flex items-center justify-center font-bold text-lg"
            >
              01
            </motion.div>

            <h3 className="font-bold mt-4">
              Select a City
            </h3>

            <p className="text-sm text-slate-400 mt-2 leading-relaxed">
              Choose the city where you want to find accommodation.
            </p>

          </motion.div>


          {/* Step 2 */}
          <motion.div variants={fadeInUp} className="text-center">

            <motion.div 
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="w-12 h-12 mx-auto rounded-full bg-blue-600 flex items-center justify-center font-bold text-lg"
            >
              02
            </motion.div>

            <h3 className="font-bold mt-4">
              Explore Hostels
            </h3>

            <p className="text-sm text-slate-400 mt-2 leading-relaxed">
              Browse available hostels and explore their details.
            </p>

          </motion.div>


          {/* Step 3 */}
          <motion.div variants={fadeInUp} className="text-center">

            <motion.div 
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="w-12 h-12 mx-auto rounded-full bg-blue-600 flex items-center justify-center font-bold text-lg"
            >
              03
            </motion.div>

            <h3 className="font-bold mt-4">
              Compare Options
            </h3>

            <p className="text-sm text-slate-400 mt-2 leading-relaxed">
              Compare rooms, prices, facilities and availability.
            </p>

          </motion.div>


          {/* Step 4 */}
          <motion.div variants={fadeInUp} className="text-center">

            <motion.div 
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="w-12 h-12 mx-auto rounded-full bg-blue-600 flex items-center justify-center font-bold text-lg"
            >
              04
            </motion.div>

            <h3 className="font-bold mt-4">
              Send a Request
            </h3>

            <p className="text-sm text-slate-400 mt-2 leading-relaxed">
              Choose your preferred room and send a request to the hostel.
            </p>

          </motion.div>

        </motion.div>

      </section>


      {/* ================= FOR HOSTEL OWNERS ================= */}
      <section>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="bg-blue-600 rounded-3xl p-8 sm:p-10 lg:p-12"
        >

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-8 items-center">

            <div>

              <div className="flex items-center gap-2 mb-4">

                <FiUsers className="text-blue-100 w-5 h-5" />

                <span className="text-blue-100 text-sm font-semibold">
                  FOR HOSTEL OWNERS & WARDENS
                </span>

              </div>


              <h2 className="text-2xl sm:text-3xl font-bold text-white">
                Have a hostel?
                <br />
                List it on HostelHub.
              </h2>


              <p className="text-blue-100 text-sm sm:text-base leading-relaxed max-w-2xl mt-4">
                Add your hostel, upload room photos, set prices,
                show available facilities and keep room availability
                updated so students can easily discover your hostel.
              </p>

            </div>


            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white text-blue-600 font-bold text-sm rounded-xl hover:bg-blue-50 transition-all shadow-lg"
              >
                List Your Hostel
                <FiArrowRight />
              </Link>
            </motion.div>

          </div>

        </motion.div>

      </section>

    </div>
  )
}

export default About