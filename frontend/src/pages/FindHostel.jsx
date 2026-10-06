import React, { useState } from 'react'
import bannerImg from "../assets/About-image.png"
import { FiMapPin, FiDollarSign, FiHome, FiSearch } from "react-icons/fi"
import { motion } from "framer-motion"
import Hostelfound from '../components/Hostelfound'

const FindHostel = () => {
  const [city, setCity] = useState('peshawar')
  const [roomType, setRoomType] = useState('any')
  const [budget, setbuget] = useState('any')
  const [searchResults, setSearchResults] = useState(null)

  const HandleSearch = (e) => {
    e.preventDefault()
    setSearchResults({ city, roomType, budget })
    console.log('searching Hostel', { city, roomType, budget })
  }

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.6, ease: "easeOut" } 
    }
  }

  const formVariants = {
    hidden: { opacity: 0, x: 40 },
    visible: { 
      opacity: 1, 
      x: 0, 
      transition: { duration: 0.6, delay: 0.2, ease: "easeOut" } 
    }
  }

  return (
    <div className='w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6'>
      
      {/* Banner Section */}
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className='relative w-full rounded-3xl overflow-hidden shadow-2xl min-h-120 lg:min-h-135 flex items-center'
      >
        <img src={bannerImg} alt="Hostel Banner" className='w-full h-full absolute inset-0 object-cover' />

        {/* Dark Gradient Overlay for Text Readability */}
        <div className='absolute inset-0 bg-linear-to-r from-slate-950/90 via-slate-900/70 to-slate-950/50'></div>

        {/* Main Content Grid */}
        <div className='relative z-10 w-full p-6 sm:p-10 lg:p-14 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center'>
          
          {/* Left Side: Bold Headline & Description */}
          <div className='lg:col-span-7 space-y-4 text-left'>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <span className="inline-block text-xs font-semibold uppercase tracking-wider text-blue-300 bg-blue-950/60 px-3.5 py-1.5 rounded-full border border-blue-400/30 mb-2">
                Discover Your Space
              </span>
              <h1 className='text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight uppercase leading-[1.1]'>
                Find A Place <br />
                <span className='text-transparent bg-clip-text bg-linear-to-r from-blue-400 via-sky-300 to-indigo-300'>
                  That Feels Like Home.
                </span>
              </h1>
            </motion.div>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className='text-slate-200 text-sm sm:text-base lg:text-lg max-w-xl font-medium drop-shadow-sm'
            >
              Search, compare and find a verified hostel that fits your exact room preference and monthly budget.
            </motion.p>
          </div>

          {/* Right Side: Floating Search Filter Form */}
          <motion.div 
            variants={formVariants}
            className='lg:col-span-5'
          >
            <form 
              className='bg-white/95 backdrop-blur-md rounded-2xl p-6 sm:p-7 shadow-2xl border border-white/40 space-y-4 text-left' 
              onSubmit={HandleSearch}
            >
              {/* Select City */}
              <div className='space-y-1.5'>
                <label className='text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5'>
                  <FiMapPin className="text-blue-700 w-4 h-4" />
                  City
                </label>
                <div className='relative'>
                  <select 
                    className='w-full py-3 px-4 bg-slate-50 outline-none border border-slate-200 rounded-xl text-slate-800 text-sm font-semibold focus:ring-2 focus:ring-blue-700 focus:border-transparent transition appearance-none pr-8 cursor-pointer' 
                    value={city} 
                    onChange={(e) => setCity(e.target.value)}
                  >
                    <option value="peshawar">Peshawar</option>
                    <option value="islamabad">Islamabad</option>
                    <option value="kohat">Kohat</option>
                    <option value="mardan">Mardan</option>
                    <option value="swabi">Swabi</option>
                    <option value="karachi">Karachi</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400 text-xs">
                    ▼
                  </div>
                </div>
              </div>

              {/* Budget Range */}
              <div className='space-y-1.5'>
                <label className='text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5'>
                  <FiDollarSign className="text-blue-700 w-4 h-4" /> 
                  Budget Range
                </label>
                <div className='relative'>
                  <select 
                    className='w-full py-3 px-4 bg-slate-50 outline-none border border-slate-200 rounded-xl text-slate-800 text-sm font-semibold focus:ring-2 focus:ring-blue-700 focus:border-transparent transition appearance-none pr-8 cursor-pointer' 
                    value={budget} 
                    onChange={(e) => setbuget(e.target.value)}
                  >
                    <option value="any">Any Budget</option>
                    <option value="under-10k">Under 10,000 PKR</option>
                    <option value="10k-20k">10,000 - 20,000 PKR</option>
                    <option value="above-20k">20,000+ PKR</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400 text-xs">
                    ▼
                  </div>
                </div>
              </div>

              {/* Room Type */}
              <div className='space-y-1.5'>
                <label className='text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5'>
                  <FiHome className="text-blue-700 w-4 h-4" /> 
                  Room Type
                </label>
                <div className='relative'>
                  <select 
                    className='w-full py-3 px-4 bg-slate-50 outline-none border border-slate-200 rounded-xl text-slate-800 text-sm font-semibold focus:ring-2 focus:ring-blue-700 focus:border-transparent transition appearance-none pr-8 cursor-pointer' 
                    value={roomType} 
                    onChange={(e) => setRoomType(e.target.value)}
                  >
                    <option value="any">Any Room Type</option>
                    <option value="single">Single Room</option>
                    <option value="2-seater">2 Seater</option>
                    <option value="3-seater">3 Seater</option>
                    <option value="4-seater">4 Seater</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400 text-xs">
                    ▼
                  </div>
                </div>
              </div>

              {/* Search Button */}
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type='submit' 
                className='w-full flex items-center justify-center gap-2 py-3.5 px-6 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-xl shadow-lg shadow-blue-700/30 transition-all duration-200 text-sm mt-2'
              >
                <FiSearch className="w-4 h-4" />
                <span>Search Hostel</span>
              </motion.button>

            </form>
          </motion.div>

        </div>
      </motion.div>

      {/* Filtered Hostels Display Component */}
      <Hostelfound filter={searchResults} />

    </div>
  )
}

export default FindHostel