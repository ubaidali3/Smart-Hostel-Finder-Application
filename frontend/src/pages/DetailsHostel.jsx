import React, { useContext, useEffect, useState } from "react";
import { HostelContext } from "../context/HosetlContext";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";

const DetailsHostel = () => {
  const {
    allHostels,
    hostelsLoading,
    fetchHostelRooms,
  } = useContext(HostelContext);

  const { detailsId } = useParams();

  const [hostelDetails, setHostelDetails] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [roomsLoading, setRoomsLoading] = useState(true);

  // ================= FIND HOSTEL =================

  useEffect(() => {
    if (!allHostels?.length) return;

    const hostel = allHostels.find(
      (item) => String(item._id) === String(detailsId)
    );

    setHostelDetails(hostel || null);
  }, [detailsId, allHostels]);

  // ================= FETCH HOSTEL ROOMS =================

  useEffect(() => {
    const loadRooms = async () => {
      if (!hostelDetails?._id) return;

      setRoomsLoading(true);

      const hostelRooms = await fetchHostelRooms(hostelDetails._id);

      setRooms(hostelRooms);
      setRoomsLoading(false);
    };

    loadRooms();
  }, [hostelDetails, fetchHostelRooms]);

  // ================= MOTION =================

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const fadeInUp = {
    hidden: {
      opacity: 0,
      y: 30,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const fadeInRight = {
    hidden: {
      opacity: 0,
      x: 40,
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        delay: 0.2,
        ease: "easeOut",
      },
    },
  };

  // ================= LOADING =================

  if (hostelsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-700 rounded-full animate-spin mx-auto"></div>

          <p className="mt-4 text-slate-600 font-medium">
            Loading hostel details...
          </p>
        </div>
      </div>
    );
  }

  // ================= HOSTEL NOT FOUND =================

  if (!hostelDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="text-center"
        >
          <h1 className="text-2xl font-bold text-slate-800">
            Hostel Not Found
          </h1>

          <p className="text-slate-500 mt-2">
            The hostel you are looking for does not exist
            or has been removed.
          </p>

          <Link
            to="/"
            className="mt-4 inline-block px-5 py-2.5 bg-blue-700 text-white rounded-xl text-sm font-semibold hover:bg-blue-800 transition shadow-md"
          >
            Back to Home
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">

        {/* ================= BREADCRUMB ================= */}

        <motion.nav
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex text-sm text-slate-500 mb-4"
        >
          <Link to="/" className="hover:text-blue-700">
            Hostels
          </Link>

          <span className="mx-2">/</span>

          <span className="text-slate-800 font-medium">
            {hostelDetails.hostelName}
          </span>
        </motion.nav>

        {/* ================= HERO IMAGE ================= */}

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.6,
            ease: "easeOut",
          }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 h-87.5 md:h-112 rounded-2xl overflow-hidden shadow-sm mb-8"
        >
          {/* Main Image */}

          <div className="md:col-span-2 h-full relative group overflow-hidden">
            <img
              src={
                hostelDetails.images?.[0] ||
                hostelDetails.image ||
                "/placeholder.jpg"
              }
              alt={hostelDetails.hostelName}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />

            <span className="absolute top-4 left-4 bg-blue-700 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-md">
              Verified Hostel
            </span>
          </div>

          {/* Side Images */}

          <div className="hidden md:flex flex-col gap-4 h-full">

            <div className="h-1/2 rounded-xl overflow-hidden relative">
              <img
                src={
                  hostelDetails.images?.[1] ||
                  hostelDetails.images?.[0] ||
                  hostelDetails.image ||
                  "/placeholder.jpg"
                }
                alt="Hostel interior"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="h-1/2 rounded-xl overflow-hidden relative bg-slate-900">
              <img
                src={
                  hostelDetails.images?.[2] ||
                  hostelDetails.images?.[0] ||
                  hostelDetails.image ||
                  "/placeholder.jpg"
                }
                alt="Hostel room"
                className="w-full h-full object-cover opacity-60"
              />

              <button className="absolute inset-0 flex items-center justify-center text-white font-medium text-sm hover:underline">
                View All Photos
              </button>
            </div>

          </div>
        </motion.div>

        {/* ================= MAIN CONTENT ================= */}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ================= LEFT ================= */}

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-2 space-y-8"
          >

            {/* HOSTEL TITLE */}

            <motion.div
              variants={fadeInUp}
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm"
            >
              <div className="flex justify-between items-start flex-wrap gap-4">

                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                    {hostelDetails.hostelName}
                  </h1>

                  <p className="text-slate-500 mt-1 flex items-center gap-1 text-sm">
                    📍 {hostelDetails.address || hostelDetails.location},{" "}
                    {hostelDetails.city}
                  </p>
                </div>

                {hostelDetails.rating && (
                  <div className="flex items-center gap-2 bg-amber-50 px-3.5 py-1.5 rounded-xl border border-amber-200">
                    <span className="text-amber-500 text-lg">
                      ★
                    </span>

                    <span className="font-bold text-slate-900">
                      {hostelDetails.rating}
                    </span>
                  </div>
                )}
              </div>

              {/* HOSTEL INFORMATION */}

              <div className="mt-6 pt-6 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-3 gap-4">

                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                  <p className="text-xs text-slate-500 font-medium">
                    City
                  </p>

                  <p className="font-semibold text-slate-800 mt-0.5">
                    {hostelDetails.city}
                  </p>
                </div>

                <div className="bg-blue-50 p-3.5 rounded-xl border border-blue-100">
                  <p className="text-xs text-blue-700 font-medium">
                    Total Rooms
                  </p>

                  <p className="font-semibold text-blue-900 mt-0.5">
                    {rooms.length}
                  </p>
                </div>

                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 col-span-2 sm:col-span-1">
                  <p className="text-xs text-slate-500 font-medium">
                    Facilities
                  </p>

                  <p className="font-semibold text-slate-800 mt-0.5">
                    {hostelDetails.facilities?.length || 0}
                  </p>
                </div>

              </div>
            </motion.div>

            {/* ================= ROOMS ================= */}

            <motion.div
              variants={fadeInUp}
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm"
            >
              <div className="flex justify-between items-center mb-5">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Available Rooms
                  </h2>

                  <p className="text-sm text-slate-500 mt-1">
                    Rooms available in {hostelDetails.hostelName}
                  </p>
                </div>

                <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
                  {rooms.length} Rooms
                </span>
              </div>

              {/* ROOM LOADING */}

              {roomsLoading ? (
                <div className="py-10 text-center">
                  <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-700 rounded-full animate-spin mx-auto"></div>

                  <p className="text-sm text-slate-500 mt-3">
                    Loading rooms...
                  </p>
                </div>
              ) : rooms.length === 0 ? (

                /* NO ROOMS */

                <div className="py-10 text-center bg-slate-50 rounded-xl border border-dashed border-slate-300">
                  <div className="text-4xl mb-3">
                    🏠
                  </div>

                  <h3 className="font-semibold text-slate-800">
                    No rooms available
                  </h3>

                  <p className="text-sm text-slate-500 mt-1">
                    This hostel currently has no rooms listed.
                  </p>
                </div>

              ) : (

                /* ROOMS LIST */

                <div className="space-y-4">

                  {rooms.map((room) => (
                    <motion.div
                      key={room._id}
                      whileHover={{ y: -2 }}
                      className="border border-slate-200 rounded-xl p-5 hover:border-blue-200 hover:shadow-md transition"
                    >

                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                        {/* ROOM INFO */}

                        <div>
                          <div className="flex items-center gap-3">
                            <h3 className="text-lg font-bold text-slate-900">
                              Room {room.roomNumber}
                            </h3>

                            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-green-50 text-green-700">
                              Available
                            </span>
                          </div>

                          <div className="flex flex-wrap gap-4 mt-3 text-sm text-slate-600">

                            {room.roomType && (
                              <span>
                                🛏️ {room.roomType}
                              </span>
                            )}

                            {room.capacity && (
                              <span>
                                👥 Capacity: {room.capacity}
                              </span>
                            )}

                            {room.price && (
                              <span>
                                💰 Rs. {room.price}
                              </span>
                            )}

                          </div>
                        </div>

                        {/* APPLY */}

                        <button
                          className="bg-blue-700 hover:bg-blue-800 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition shadow-md shadow-blue-700/20"
                        >
                          Apply for Room
                        </button>

                      </div>

                    </motion.div>
                  ))}

                </div>
              )}
            </motion.div>

            {/* ================= FACILITIES ================= */}

            <motion.div
              variants={fadeInUp}
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm"
            >
              <h2 className="text-lg font-bold text-slate-900 mb-4">
                Hostel Facilities
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">

                {hostelDetails.facilities?.map(
                  (facility, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.03 }}
                      className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 text-sm font-medium"
                    >
                      <span className="w-2 h-2 rounded-full bg-blue-700 shrink-0"></span>

                      {facility}
                    </motion.div>
                  )
                )}

              </div>
            </motion.div>

            {/* ================= DESCRIPTION ================= */}

            <motion.div
              variants={fadeInUp}
              className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm"
            >
              <h2 className="text-lg font-bold text-slate-900 mb-2">
                About Hostel
              </h2>

              <p className="text-slate-600 leading-relaxed text-sm">
                {hostelDetails.description ||
                  `Welcome to ${hostelDetails.hostelName}. This hostel provides comfortable accommodation for students with useful facilities and a convenient location.`}
              </p>
            </motion.div>

          </motion.div>

          {/* ================= RIGHT ================= */}

          <motion.div
            variants={fadeInRight}
            initial="hidden"
            animate="visible"
            className="lg:col-span-1"
          >
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm sticky top-6">

              <div className="mb-4">

                <span className="text-xs text-slate-400 block uppercase tracking-wider font-semibold">
                  Hostel Information
                </span>

                <span className="text-2xl font-extrabold text-slate-900">
                  {hostelDetails.hostelName}
                </span>

              </div>

              <div className="space-y-3 mb-6 text-sm">

                <div className="flex justify-between py-2 border-b border-slate-100 text-slate-600">
                  <span>City</span>

                  <span className="font-semibold text-slate-900">
                    {hostelDetails.city}
                  </span>
                </div>

                <div className="flex justify-between py-2 border-b border-slate-100 text-slate-600">
                  <span>Rooms</span>

                  <span className="font-semibold text-blue-700">
                    {rooms.length}
                  </span>
                </div>

                <div className="flex justify-between py-2 border-b border-slate-100 text-slate-600">
                  <span>Facilities</span>

                  <span className="font-semibold text-slate-900">
                    {hostelDetails.facilities?.length || 0}
                  </span>
                </div>

              </div>

              <button className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold py-3.5 px-4 rounded-xl transition duration-200 shadow-md shadow-blue-700/20">
                Contact Hostel Owner
              </button>

              <p className="text-xs text-center text-slate-400 mt-4">
                🔒 Direct communication — No hidden commission fees
              </p>

            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default DetailsHostel;