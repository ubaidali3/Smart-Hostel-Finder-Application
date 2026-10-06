import React from 'react'
import { Link } from 'react-router-dom'
import logo from '../assets/white-logo.png'
import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn } from 'react-icons/fa'
import { FiPhone, FiMail, FiMapPin, FiSend } from 'react-icons/fi'

const Footer = () => {
  return (
    <footer className="w-full bg-slate-900 text-slate-300 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          
          {/* Column 1: Brand & Socials */}
          <div className="sm:col-span-2 lg:col-span-1 space-y-4">
            <Link to="/" className="inline-block">
              <img src={logo} alt="HostelHub Logo" className="h-10 w-auto object-contain" />
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-xs">
              A safe, comfortable, and affordable hostel experience designed to feel like your second home — from move-in day to graduation.
            </p>
            
            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="#facebook"
                aria-label="Facebook"
                className="w-9 h-9 flex items-center justify-center rounded-lg bg-slate-800 hover:bg-blue-600 hover:text-white transition-all duration-200"
              >
                <FaFacebookF className="w-4 h-4" />
              </a>
              <a
                href="#instagram"
                aria-label="Instagram"
                className="w-9 h-9 flex items-center justify-center rounded-lg bg-slate-800 hover:bg-pink-600 hover:text-white transition-all duration-200"
              >
                <FaInstagram className="w-4 h-4" />
              </a>
              <a
                href="#twitter"
                aria-label="Twitter"
                className="w-9 h-9 flex items-center justify-center rounded-lg bg-slate-800 hover:bg-sky-500 hover:text-white transition-all duration-200"
              >
                <FaTwitter className="w-4 h-4" />
              </a>
              <a
                href="#linkedin"
                aria-label="LinkedIn"
                className="w-9 h-9 flex items-center justify-center rounded-lg bg-slate-800 hover:bg-blue-700 hover:text-white transition-all duration-200"
              >
                <FaLinkedinIn className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-4">
            <h3 className="text-white text-base font-semibold tracking-wide">Quick Links</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="hover:text-blue-400 transition-colors duration-200">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-blue-400 transition-colors duration-200">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/facilities" className="hover:text-blue-400 transition-colors duration-200">
                  Facilities
                </Link>
              </li>
              <li>
                <Link to="/rules" className="hover:text-blue-400 transition-colors duration-200">
                  Hostel Rules
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-blue-400 transition-colors duration-200">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Student Corner */}
          <div className="space-y-4">
            <h3 className="text-white text-base font-semibold tracking-wide">Student Corner</h3>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>
                <a href="#apply" className="hover:text-blue-400 transition-colors duration-200">
                  My Application
                </a>
              </li>
              <li>
                <a href="#room" className="hover:text-blue-400 transition-colors duration-200">
                  My Room
                </a>
              </li>
              <li>
                <a href="#fees" className="hover:text-blue-400 transition-colors duration-200">
                  Fee Structure
                </a>
              </li>
              <li>
                <a href="#notices" className="hover:text-blue-400 transition-colors duration-200">
                  Notice Board
                </a>
              </li>
              <li>
                <a href="#complaints" className="hover:text-blue-400 transition-colors duration-200">
                  Complaints Portal
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact Information */}
          <div className="space-y-4">
            <h3 className="text-white text-base font-semibold tracking-wide">Contact Us</h3>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-center gap-3">
                <FiPhone className="text-blue-500 w-4 h-4 shrink-0" />
                <span>+92 317 83348455</span>
              </li>
              <li className="flex items-center gap-3">
                <FiMail className="text-blue-500 w-4 h-4 shrink-0" />
                <span className="truncate">uabidali@gmail.com</span>
              </li>
              <li className="flex items-start gap-3">
                <FiMapPin className="text-blue-500 w-4 h-4 shrink-0 mt-0.5" />
                <span>University Road, Peshawar, KP</span>
              </li>
            </ul>
          </div>

          {/* Column 5: Newsletter */}
          <div className="space-y-4">
            <h3 className="text-white text-base font-semibold tracking-wide">Newsletter</h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Stay updated with our latest notices, events, and announcements.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-3.5 py-2.5 bg-slate-800 text-white placeholder-slate-500 rounded-lg text-sm border border-slate-700 focus:outline-none focus:border-blue-500 transition-colors"
                required
              />
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-md hover:shadow-blue-600/20 active:scale-[0.98] transition-all duration-200"
              >
                <span>Subscribe</span>
                <FiSend className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

        </div>

        {/* Bottom Bar / Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} HostelHub. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#privacy" className="hover:text-slate-400 transition-colors">Privacy Policy</a>
            <a href="#terms" className="hover:text-slate-400 transition-colors">Terms of Service</a>
          </div>
        </div>

      </div>
    </footer>
  )
}

export default Footer