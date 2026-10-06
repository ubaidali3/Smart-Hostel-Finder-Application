import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Inquiry',
    message: '',
  })

  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Process contact form submission logic here
    console.log('Form Submitted:', formData)
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 5000)
    setFormData({ name: '', email: '', phone: '', subject: 'General Inquiry', message: '' })
  }

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const cardVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.4, ease: 'easeOut' },
    },
  }

  return (
    <section className="bg-slate-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <span className="text-blue-700 font-semibold text-xs sm:text-sm uppercase tracking-wider bg-blue-50 px-3.5 py-1.5 rounded-full border border-blue-100">
            Get In Touch
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3">
            Contact Support & Owners
          </h1>
          <p className="text-slate-600 text-base sm:text-lg mt-2">
            Have questions about a hostel listing or need help booking your room? Reach out to our team anytime.
          </p>
        </motion.div>

        {/* Main Grid: Info Cards + Contact Form */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Side: Contact Cards */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-1 space-y-4"
          >
            
            {/* Phone & WhatsApp Card */}
            <motion.div 
              variants={cardVariants}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-xl text-blue-700">
                  📞
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Phone & WhatsApp</p>
                  <a href="tel:+923001234567" className="text-base font-bold text-slate-900 hover:text-blue-700 transition">
                    +92 300 1234567
                  </a>
                  <p className="text-xs text-slate-500 mt-0.5">Mon-Sat from 9am to 8pm</p>
                </div>
              </div>
            </motion.div>

            {/* Email Card */}
            <motion.div 
              variants={cardVariants}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-xl text-blue-700">
                  ✉️
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Email Us</p>
                  <a href="mailto:support@hostelapp.com" className="text-base font-bold text-slate-900 hover:text-blue-700 transition">
                    support@hostelapp.com
                  </a>
                  <p className="text-xs text-slate-500 mt-0.5">Online support 24/7</p>
                </div>
              </div>
            </motion.div>

            {/* Office Address Card */}
            <motion.div 
              variants={cardVariants}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-xl text-blue-700">
                  📍
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Head Office</p>
                  <p className="text-base font-bold text-slate-900">
                    Blue Area, Sector G-7
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">Islamabad, Pakistan</p>
                </div>
              </div>
            </motion.div>

            {/* Emergency Support Banner */}
            <motion.div 
              variants={cardVariants}
              whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
              className="bg-linear-to-br from-blue-700 to-slate-900 p-6 rounded-2xl text-white shadow-md"
            >
              <h3 className="font-bold text-lg">Need Immediate Hostel Visit?</h3>
              <p className="text-xs text-blue-100 mt-1 leading-relaxed">
                Call our direct helpline to book physical visits or check bed availability instantly.
              </p>
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="tel:+923001234567"
                className="mt-4 inline-block bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs transition"
              >
                Call Helpline Now →
              </motion.a>
            </motion.div>

          </motion.div>

          {/* Right Side: Form & Map Placeholder */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' }}
            className="lg:col-span-2 space-y-6"
          >
            
            {/* Form Container */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Send Us a Message</h2>
              <p className="text-slate-500 text-sm mb-6">
                Fill out the form below and our team will get back to you within 24 hours.
              </p>

              <AnimatePresence>
                {submitted && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                    animate={{ opacity: 1, height: 'auto', marginBottom: 24 }}
                    exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-sm font-semibold flex items-center gap-2"
                  >
                    <span>✅</span> Thank you! Your message has been sent successfully.
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Your Full Name</label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. Ubaid Ali"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-700 focus:bg-white transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="e.g. ubaid@example.com"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-700 focus:bg-white transition"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+92 300 0000000"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-700 focus:bg-white transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Subject</label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-700 focus:bg-white transition"
                    >
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Hostel Booking Help">Hostel Booking Help</option>
                      <option value="List My Hostel">List My Hostel (Owner)</option>
                      <option value="Report an Issue">Report an Issue</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Message</label>
                  <textarea
                    name="message"
                    rows="4"
                    required
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Describe how we can help you..."
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-700 focus:bg-white transition resize-none"
                  ></textarea>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  type="submit"
                  className="w-full sm:w-auto px-8 py-3.5 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-xl shadow-md transition duration-200 text-sm cursor-pointer"
                >
                  Send Message →
                </motion.button>
              </form>
            </div>

            {/* Map Box */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="bg-slate-200 h-48 rounded-2xl overflow-hidden relative border border-slate-300 flex items-center justify-center"
            >
              <iframe
                title="Office Location"
                src="https://maps.google.com/maps?q=Blue%20Area,%20Islamabad&t=&z=13&ie=UTF8&iwloc=&output=embed"
                className="w-full h-full border-0 grayscale opacity-80 hover:grayscale-0 transition duration-300"
                allowFullScreen=""
                loading="lazy"
              ></iframe>
            </motion.div>

          </motion.div>

        </div>

      </div>
    </section>
  )
}

export default Contact