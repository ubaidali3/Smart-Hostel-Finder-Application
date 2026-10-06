import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const ItsWork = () => {
  const [activeTab, setActiveTab] = useState('students')

  const studentSteps = [
    {
      id: '01',
      title: 'Search & Filter',
      description: 'Explore hostels by city, price range, room type (single, 2-seater, 3-seater), and facilities like Wi-Fi or Mess.',
      icon: '🔍',
      badge: 'Step 1'
    },
    {
      id: '02',
      title: 'Compare & Review',
      description: 'Check verified photos, guest ratings, distance to universities or job hubs, and direct transparent monthly pricing.',
      icon: '⭐',
      badge: 'Step 2'
    },
    {
      id: '03',
      title: 'Schedule a Visit / Contact',
      description: 'Connect directly with verified hostel owners via phone or book a physical visit with zero hidden middleman fees.',
      icon: '📞',
      badge: 'Step 3'
    },
    {
      id: '04',
      title: 'Move In Stress-Free',
      description: 'Confirm your bed reservation, pay directly, and move into your clean, comfortable, and secure new accommodation.',
      icon: '🔑',
      badge: 'Step 4'
    }
  ]

  const ownerSteps = [
    {
      id: '01',
      title: 'List Your Hostel',
      description: 'Create a free owner profile and list your property details, room configurations, pricing, and available beds.',
      icon: '📝',
      badge: 'Step 1'
    },
    {
      id: '02',
      title: 'Get Verified',
      description: 'Our team verifies your location and facilities to award a "Verified Hostel" badge that builds instant student trust.',
      icon: '🛡️',
      badge: 'Step 2'
    },
    {
      id: '03',
      title: 'Receive Direct Inquiries',
      description: 'Get direct phone calls and visit bookings from thousands of students and working professionals actively searching in your area.',
      icon: '💬',
      badge: 'Step 3'
    },
    {
      id: '04',
      title: 'Fill Vacancies Fast',
      description: 'Minimize empty beds, manage occupancy effortlessly, and grow your hostel business with verified leads.',
      icon: '📈',
      badge: 'Step 4'
    }
  ]

  const currentSteps = activeTab === 'students' ? studentSteps : ownerSteps

  // Motion Variants
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
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: 'easeOut' },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: { duration: 0.2 },
    },
  }

  return (
    <section className="bg-slate-50 py-16 px-4 sm:px-6 lg:px-8 min-h-screen flex items-center overflow-hidden">
      <div className="max-w-7xl mx-auto w-full">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <span className="text-blue-700 font-semibold text-xs sm:text-sm uppercase tracking-widest bg-blue-50 px-3.5 py-1.5 rounded-full border border-blue-100">
            Simple & Transparent Process
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-4 tracking-tight">
            How It Works
          </h2>
          <p className="text-slate-600 text-base sm:text-lg mt-3">
            Finding a reliable hostel or listing your accommodation has never been easier.
          </p>

          {/* Animated Tab Switcher */}
          <div className="inline-flex p-1.5 bg-slate-200/80 rounded-2xl mt-8 shadow-inner relative">
            <button
              onClick={() => setActiveTab('students')}
              className={`relative z-10 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-colors duration-200 ${
                activeTab === 'students' ? 'text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {activeTab === 'students' && (
                <motion.div
                  layoutId="activeTabPill"
                  className="absolute inset-0 bg-blue-700 rounded-xl shadow-md -z-10"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              🎓 For Students & Guests
            </button>

            <button
              onClick={() => setActiveTab('owners')}
              className={`relative z-10 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-colors duration-200 ${
                activeTab === 'owners' ? 'text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {activeTab === 'owners' && (
                <motion.div
                  layoutId="activeTabPill"
                  className="absolute inset-0 bg-blue-700 rounded-xl shadow-md -z-10"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              🏢 For Hostel Owners
            </button>
          </div>
        </motion.div>

        {/* 4-Step Animated Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 relative"
          >
            {currentSteps.map((step) => (
              <motion.div
                key={step.id}
                variants={cardVariants}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs hover:shadow-xl transition-shadow duration-300 relative flex flex-col justify-between group cursor-pointer"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <motion.div 
                      whileHover={{ scale: 1.15, rotate: 5 }}
                      className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-2xl transition-transform"
                    >
                      {step.icon}
                    </motion.div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100">
                      {step.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-slate-600 text-sm mt-2 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-semibold text-blue-700">
                    {activeTab === 'students' ? 'Student Guide' : 'Owner Guide'}
                  </span>
                  <span className="text-2xl font-black text-slate-200 group-hover:text-blue-200 transition-colors">
                    {step.id}
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Bottom CTA Card */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-16 bg-linear-to-r from-blue-700 to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div className="text-center md:text-left">
            <h3 className="text-2xl sm:text-3xl font-bold">
              {activeTab === 'students' ? 'Ready to find your ideal hostel?' : 'Have a hostel to list?'}
            </h3>
            <p className="text-blue-100 text-sm sm:text-base mt-2 max-w-xl">
              {activeTab === 'students'
                ? 'Browse hundreds of verified dorms and executive rooms across Pakistan today.'
                : 'Join our platform and connect directly with thousands of potential tenants.'}
            </p>
          </div>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="whitespace-nowrap bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold px-8 py-4 rounded-2xl shadow-lg hover:shadow-amber-500/20 transition-all text-sm sm:text-base cursor-pointer"
          >
            {activeTab === 'students' ? 'Explore All Hostels →' : 'List Hostel Free →'}
          </motion.button>
        </motion.div>

      </div>
    </section>
  )
}

export default ItsWork