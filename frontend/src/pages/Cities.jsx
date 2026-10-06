import React, { createContext, useContext, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HostelContext } from '../context/HosetlContext'

const Cities = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRegion, setSelectedRegion] = useState('All')

  const {citiesData}=useContext(HostelContext)

  const regions = ['All', 'Federal', 'Punjab', 'Sindh', 'KPK', 'Balochistan']

  const filteredCities = citiesData.filter((city) => {
    const matchesSearch =
      city.cityName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      city.tagline.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRegion =
      selectedRegion === 'All' || city.region === selectedRegion
    return matchesSearch && matchesRegion
  })

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.07,
      },
    },
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: 'easeOut' },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      transition: { duration: 0.2 },
    },
  }

  return (
    <div className="bg-slate-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="text-center max-w-3xl mx-auto mb-10"
        >
          <span className="text-blue-700 font-semibold text-xs sm:text-sm uppercase tracking-wider bg-blue-50 px-3.5 py-1.5 rounded-full border border-blue-100">
            Explore Destinations
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3">
            Find Hostels by City
          </h1>
          <p className="text-slate-600 text-base sm:text-lg mt-2">
            Discover verified student dorms, executive rooms, and budget stays across major cities.
          </p>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: 'easeOut' }}
          className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8"
        >
          {/* Search Input */}
          <div className="relative w-full sm:w-80">
            <input
              type="text"
              placeholder="Search city or region..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-700 focus:border-transparent transition shadow-xs"
            />
            <span className="absolute left-3 top-3 text-slate-400 text-sm">🔍</span>
          </div>

          {/* Region Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 scrollbar-none">
            {regions.map((region) => (
              <motion.button
                key={region}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedRegion(region)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                  selectedRegion === region
                    ? 'bg-blue-700 text-white shadow-md shadow-blue-700/20'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {region}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Cities Grid with AnimatePresence */}
        <AnimatePresence mode="wait">
          {filteredCities.length === 0 ? (
            <motion.div
              key="empty-state"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="text-center py-16 bg-white rounded-2xl border border-slate-200 shadow-xs"
            >
              <p className="text-4xl mb-2">🌆</p>
              <h3 className="text-lg font-bold text-slate-800">No Cities Found</h3>
              <p className="text-slate-500 text-sm mt-1">
                Try searching for a different city or region name.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setSearchQuery('')
                  setSelectedRegion('All')
                }}
                className="mt-4 px-4 py-2 bg-blue-700 text-white rounded-xl text-sm font-semibold hover:bg-blue-800 transition shadow-sm"
              >
                Reset Filters
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              key={`${selectedRegion}-${searchQuery}`}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            >
              {filteredCities.map((city) => (
                <motion.div
                  key={city.id}
                  variants={cardVariants}
                  whileHover={{ y: -6, transition: { duration: 0.2 } }}
                  className="group relative h-72 rounded-2xl overflow-hidden shadow-xs hover:shadow-xl transition-shadow duration-300 cursor-pointer border border-slate-200 bg-slate-900"
                >
                  <img
                    src={city.image}
                    alt={city.cityName}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-80 group-hover:opacity-75"
                  />

                  <div className="absolute inset-0 bg-linear-to-t from-slate-950/90 via-slate-950/30 to-transparent"></div>

                  {/* Header Badges */}
                  <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
                    <span className="bg-white/90 backdrop-blur-md text-slate-900 text-xs font-bold px-3 py-1 rounded-full shadow-xs">
                      {city.hostelCount} Hostels
                    </span>
                    {city.isPopular && (
                      <span className="bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-xs">
                        Popular🔥
                      </span>
                    )}
                  </div>

                  {/* Content Info */}
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
                      {city.region}
                    </span>
                    <h3 className="text-xl font-bold mt-0.5 group-hover:text-blue-300 transition-colors">
                      {city.cityName}
                    </h3>
                    <p className="text-xs text-slate-300 mt-1 line-clamp-1">
                      {city.tagline}
                    </p>

                    <div className="mt-3 flex items-center justify-between pt-2 border-t border-white/20 opacity-90 group-hover:opacity-100 transition-opacity">
                      <span className="text-xs font-semibold text-white/90">
                        Browse Accommodations
                      </span>
                      <span className="transform group-hover:translate-x-1 transition-transform text-blue-400 text-sm font-bold">
                        →
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default Cities