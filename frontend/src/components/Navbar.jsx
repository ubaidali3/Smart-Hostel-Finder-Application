import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import logo from '../assets/hostelhub_logo.png'
import UserMenu from './Usermenu'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => setIsOpen((prev) => !prev)
  const closeMenu = () => setIsOpen(false)

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Find Hostels', path: '/hostels' },
    { name: 'Cities', path: '/cities' },
    { name: 'About', path: '/about' },
    { name: 'How It Works', path: '/how-it-works' },
    { name: 'Contact', path: '/contact' },
  ]

  // Drawer Animation Variants
  const drawerVariants = {
    closed: {
      x: '100%',
      transition: { type: 'spring', stiffness: 300, damping: 30 },
    },
    open: {
      x: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  }

  const linkVariants = {
    closed: { opacity: 0, x: 20 },
    open: { opacity: 1, x: 0, transition: { duration: 0.3 } },
  }

  return (
    <nav className="w-full relative bg-white border-b border-slate-100 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-20 flex items-center justify-between">
          
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img
              src={logo}
              alt="HostelHub"
              className="h-10 w-auto object-contain"
            />
          </Link>

          {/* Desktop Navigation Links */}
          <ul className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link
                  to={link.path}
                  className="text-sm font-semibold text-slate-700 hover:text-blue-600 transition-colors"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>

          {/* Desktop Right Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            <UserMenu />
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={toggleMenu}
            className="lg:hidden flex flex-col justify-center items-center w-10 h-10 rounded-xl hover:bg-slate-100 transition-colors p-2 z-50 focus:outline-none"
            aria-label="Toggle menu"
          >
            <span
              className={`w-6 h-0.5 bg-slate-800 transition-transform duration-300 ${
                isOpen ? 'rotate-45 translate-y-1.5' : ''
              }`}
            ></span>
            <span
              className={`w-6 h-0.5 bg-slate-800 transition-opacity duration-300 my-1 ${
                isOpen ? 'opacity-0' : 'opacity-100'
              }`}
            ></span>
            <span
              className={`w-6 h-0.5 bg-slate-800 transition-transform duration-300 ${
                isOpen ? '-rotate-45 -translate-y-1.5' : ''
              }`}
            ></span>
          </button>
        </div>
      </div>

      {/* Animated Mobile Drawer & Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop Overlay - Dark Dimmed Background */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={closeMenu}
              className="fixed inset-0 bg-slate-900 bg-opacity-60 z-40 lg:hidden"
            />

            {/* Right Side Drawer - Fully Solid White (No Transparency) */}
            <motion.div
              variants={drawerVariants}
              initial="closed"
              animate="open"
              exit="closed"
              style={{ backgroundColor: '#ffffff' }}
              className="fixed top-0 right-0 bottom-0 w-4/5 max-w-xs bg-white border-l border-slate-200 shadow-2xl z-50 flex flex-col justify-between p-6 lg:hidden"
            >
              <div>
                {/* Drawer Header */}
                <div className="flex items-center justify-between pb-6 border-b border-slate-200">
                  <img src={logo} alt="HostelHub" className="h-8 w-auto object-contain" />
                  <button
                    onClick={closeMenu}
                    className="p-2 text-slate-700 hover:text-slate-900 text-lg rounded-xl hover:bg-slate-100 transition-colors font-bold"
                  >
                    ✕
                  </button>
                </div>

                {/* Mobile Navigation Links */}
                <ul className="flex flex-col gap-2 mt-6">
                  {navLinks.map((link) => (
                    <motion.li key={link.name} variants={linkVariants}>
                      <Link
                        to={link.path}
                        onClick={closeMenu}
                        className="block py-3 px-4 text-base font-bold text-slate-900 hover:text-blue-600 hover:bg-slate-100 rounded-xl transition-colors"
                      >
                        {link.name}
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </div>

              {/* Mobile Action Buttons & User Menu */}
              <motion.div
                variants={linkVariants}
                className="pt-6 border-t border-slate-200 flex flex-col gap-3"
              >
                <div className="flex justify-center w-full" onClick={closeMenu}>
                  <UserMenu />
                </div>

                <Link
                  to="/register"
                  onClick={closeMenu}
                  className="w-full text-center py-3 text-sm font-bold text-white bg-blue-600 rounded-xl shadow-md hover:bg-blue-700 transition-all"
                >
                  List Your Hostel
                </Link>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  )
}

export default Navbar