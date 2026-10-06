import React from 'react'
import { Routes, Route } from 'react-router-dom'

import Navbar from './components/Navbar'
import Footer from './components/Footer'

import Home from './pages/Home'
import About from './pages/About'
import FindHostel from './pages/FindHostel'
import Cities from './pages/Cities'
import ItsWork from './pages/ItsWork'
import Contact from './pages/Contact'
import Login from './pages/Login'
import DetailsHostel from './pages/DetailsHostel'
import Dashboard from './pages/Dashboard'

const App = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 antialiased">

      {/* ================= NAVBAR (Fixed Header) ================= */}
      <header className="sticky top-0 z-50 w-full bg-white border-b border-slate-100 shadow-sm">
        <Navbar />
      </header>

      {/* ================= MAIN CONTENT ================= */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/hostels" element={<FindHostel />} />
          <Route path="/cities" element={<Cities />} />
          <Route path="/about" element={<About />} />
          <Route path="/how-it-works" element={<ItsWork />} />
          <Route path="/contact" element={<Contact />} />

          {/* Authentication */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Login />} />

          {/* Hostel details */}
          <Route path="/details/:detailsId" element={<DetailsHostel />} />

          {/* Dashboard (warden + student) */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/:tab" element={<Dashboard />} />
        </Routes>
      </main>

      {/* ================= FOOTER ================= */}
      <Footer />
    </div>
  )
}

export default App