import { createContext, useEffect, useState } from "react";
import citiesData from "../assets/citiesData.js";
import { toast } from "react-toastify";
import axiosInstance, { backendUrl } from "../../utils/axiosInstance.js";

export const HostelContext = createContext();

const HosetlContextProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("hh_token") || "");

  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("hh_user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [authLoading, setAuthLoading] = useState(false);

  // ================= PUBLIC HOSTELS (from database) =================
  const [allHostels, setAllHostels] = useState([]);
  // start as true: otherwise "No Hostels Found" flashes on first render
  const [hostelsLoading, setHostelsLoading] = useState(true);

  // ================= WARDEN STATE =================
  const [myHostel, setMyHostel] = useState(null);
  const [myRooms, setMyRooms] = useState([]);
  const [wardenApplications, setWardenApplications] = useState([]);
  const [wardenPayments, setWardenPayments] = useState([]);
  const [wardenComplaints, setWardenComplaints] = useState([]);
  const [notices, setNotices] = useState([]);
  const [fees, setFees] = useState([]);

  // ================= STUDENT STATE =================
  const [myApplications, setMyApplications] = useState([]);
  const [myRoom, setMyRoom] = useState(null);
  const [myNotices, setMyNotices] = useState([]);
  const [myFee, setMyFee] = useState(null);
  const [myPayments, setMyPayments] = useState([]);

  useEffect(() => {
    if (token) localStorage.setItem("hh_token", token);
    else localStorage.removeItem("hh_token");
  }, [token]);

  useEffect(() => {
    if (user) localStorage.setItem("hh_user", JSON.stringify(user));
    else localStorage.removeItem("hh_user");
  }, [user]);

  const getErrorMessage = (error, fallback) =>
    error?.response?.data?.message || error?.message || fallback;

  const userId = user?.id || user?._id;

  // Clears every role-specific piece of state (used on logout)
  const resetSessionState = () => {
    setMyHostel(null);
    setMyRooms([]);
    setWardenApplications([]);
    setWardenPayments([]);
    setWardenComplaints([]);
    setNotices([]);
    setFees([]);
    setMyApplications([]);
    setMyRoom(null);
    setMyNotices([]);
    setMyFee(null);
    setMyPayments([]);
  };

  // ================= AUTH =================

  const registerUser = async ({ name, email, password, phone, role }) => {
    try {
      setAuthLoading(true);
      const { data } = await axiosInstance.post("/api/user/register", {
        name,
        email,
        password,
        phone,
        role,
      });

      if (data.success) {
        toast.success(data.message || "Account created, please login");
        return true;
      }
      toast.error(data.message || "Registration failed");
      return false;
    } catch (error) {
      toast.error(getErrorMessage(error, "Registration failed"));
      return false;
    } finally {
      setAuthLoading(false);
    }
  };

  const loginUser = async ({ email, password }) => {
    try {
      setAuthLoading(true);
      const { data } = await axiosInstance.post("/api/user/login", {
        email,
        password,
      });

      if (data.success) {
        resetSessionState(); // never carry over data from a previous account
        setToken(data.token);
        setUser(data.user);
        toast.success("Logged in successfully");
        return data.user;
      }
      toast.error(data.message || "Login failed");
      return null;
    } catch (error) {
      toast.error(getErrorMessage(error, "Login failed"));
      return null;
    } finally {
      setAuthLoading(false);
    }
  };

  const logoutUser = () => {
    setToken("");
    setUser(null);
    resetSessionState();
    localStorage.removeItem("hh_token");
    localStorage.removeItem("hh_user");
    toast.info("Logged out");
  };

  // ================= HOSTELS =================

  // All hostels from the database (public listing)
  const fetchAllHostels = async () => {
    try {
      setHostelsLoading(true);

      const { data } = await axiosInstance.get("/api/hostel");

      if (data.success) {
        setAllHostels(data.hostels || []);
        return data.hostels || [];
      }

      setAllHostels([]);
      return [];
    } catch (error) {
      console.log("Hostel Fetch Error:", error);
      toast.error(getErrorMessage(error, "Could not load hostels"));
      setAllHostels([]);
      return [];
    } finally {
      setHostelsLoading(false);
    }
  };

  // Load on app start (no login needed)
  useEffect(() => {
    fetchAllHostels();
  }, []);

  // Logged-in warden's own hostel
  const fetchMyHostels = async () => {
    if (!userId) return null;
    try {
      const { data } = await axiosInstance.get("/api/hostel");
      if (data.success) {
        const list = data.hosetls || data.hostels || [];
        const own = list.find(
          (h) => h.owner === userId || h.owner?._id === userId
        );
        setMyHostel(own || null);
        return own || null;
      }
    } catch (error) {
      toast.error(getErrorMessage(error, "Could not load your hostel"));
    }
    return null;
  };

  // Create or update hostel (with images)
  const saveHostel = async (hostelInfo, imagesFiles = [], replaceImages = false) => {
    try {
      const formData = new FormData();
      Object.entries(hostelInfo).forEach(([key, value]) => {
        if (value === undefined || value === null) return;
        if (Array.isArray(value)) {
          value.forEach((v) => formData.append(key, v));
        } else {
          formData.append(key, value);
        }
      });
      imagesFiles.forEach((file) => formData.append("images", file));

      let data;
      if (myHostel?._id) {
        if (replaceImages) formData.append("replaceImages", "true");
        const res = await axiosInstance.put(`/api/hostel/${myHostel._id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        data = res.data;
      } else {
        const res = await axiosInstance.post("/api/hostel", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        data = res.data;
      }

      if (data.success) {
        const saved = data.hostel;
        setMyHostel(saved);
        toast.success(data.message || "Hostel saved successfully");
        fetchAllHostels(); // refresh the public list too
        return saved;
      }
      toast.error(data.message || "Could not save hostel");
      return null;
    } catch (error) {
      toast.error(getErrorMessage(error, "Could not save hostel"));
      return null;
    }
  };

  // Delete the warden's hostel
  const deleteHostel = async () => {
    if (!myHostel?._id) return false;
    try {
      const { data } = await axiosInstance.delete(`/api/hostel/${myHostel._id}`);
      if (data.success) {
        toast.success(data.message || "Hostel deleted");
        setMyHostel(null);
        setMyRooms([]);
        setNotices([]);
        setFees([]);
        fetchAllHostels(); // refresh the public list
        return true;
      }
      toast.error(data.message || "Could not delete hostel");
    } catch (error) {
      toast.error(getErrorMessage(error, "Could not delete hostel"));
    }
    return false;
  };

  // ================= ROOMS =================

  const fetchHostelRooms = async (hostelId) => {
    if (!hostelId) return [];

    try {
      const { data } = await axiosInstance.get("/api/rooms");

      if (data.success) {
        return data.rooms.filter(
          (room) =>
            String(room.hostel?._id || room.hostel) === String(hostelId)
        );
      }
    } catch (error) {
      console.log("Hostel Rooms Fetch Error:", error);
      toast.error(getErrorMessage(error, "Could not load hostel rooms"));
    }

    return [];
  };

  const fetchMyRooms = async (hostelId) => {
    const id = hostelId || myHostel?._id;
    if (!id) return [];
    try {
      const { data } = await axiosInstance.get("/api/rooms");
      if (data.success) {
        const filtered = data.rooms.filter(
          (r) => r.hostel === id || r.hostel?._id === id
        );
        setMyRooms(filtered);
        return filtered;
      }
    } catch (error) {
      toast.error(getErrorMessage(error, "Could not load rooms"));
    }
    return [];
  };

  // All rooms (used by students to look up the room they applied to)
  const fetchAllRooms = async () => {
    try {
      const { data } = await axiosInstance.get("/api/rooms");
      if (data.success) return data.rooms || [];
    } catch (error) {
      console.log("Rooms Fetch Error:", error);
    }
    return [];
  };

  // Create a room (with optional images, sent as multipart/form-data)
  const createRoom = async (roomInfo, imageFiles = []) => {
    try {
      const formData = new FormData();
      Object.entries({ ...roomInfo, hostel: myHostel?._id }).forEach(([key, value]) => {
        if (value !== undefined && value !== null) formData.append(key, value);
      });
      imageFiles.forEach((file) => formData.append("images", file));

      const { data } = await axiosInstance.post("/api/rooms", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (data.success) {
        toast.success("Room added successfully");
        setMyRooms((prev) => [data.room, ...prev]);
        return data.room;
      }
      toast.error(data.message || "Could not add room");
    } catch (error) {
      toast.error(getErrorMessage(error, "Could not add room"));
    }
    return null;
  };

  // Update a room (new images are added, or replace the old ones)
  const updateRoom = async (id, roomInfo, imageFiles = [], replaceImages = false) => {
    try {
      const formData = new FormData();
      Object.entries(roomInfo).forEach(([key, value]) => {
        if (value !== undefined && value !== null) formData.append(key, value);
      });
      imageFiles.forEach((file) => formData.append("images", file));
      if (replaceImages) formData.append("replaceImages", "true");

      const { data } = await axiosInstance.put(`/api/rooms/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (data.success) {
        toast.success(data.message || "Room updated");
        await fetchMyRooms();
        return data.room || true;
      }
      toast.error(data.message || "Could not update room");
    } catch (error) {
      toast.error(getErrorMessage(error, "Could not update room"));
    }
    return null;
  };

  const deleteRoom = async (id) => {
    try {
      const { data } = await axiosInstance.delete(`/api/rooms/${id}`);
      if (data.success) {
        toast.success(data.message || "Room deleted");
        setMyRooms((prev) => prev.filter((r) => r._id !== id));
        return true;
      }
      toast.error(data.message || "Could not delete room");
    } catch (error) {
      toast.error(getErrorMessage(error, "Could not delete room"));
    }
    return false;
  };

  // ================= APPLICATIONS =================

  const fetchWardenApplications = async () => {
    try {
      const { data } = await axiosInstance.get("/api/applications/warden");
      if (data.success) {
        setWardenApplications(data.applications || []);
        return data.applications || [];
      }
    } catch (error) {
      setWardenApplications([]);
    }
    return [];
  };

  const updateApplicationStatus = async (id, status) => {
    try {
      const { data } = await axiosInstance.put(`/api/applications/${id}/status`, { status });
      if (data.success) {
        toast.success(data.message);
        setWardenApplications((prev) =>
          prev.map((a) => (a._id === id ? data.application : a))
        );
        return data.application;
      }
      toast.error(data.message);
    } catch (error) {
      toast.error(getErrorMessage(error, "Could not update application"));
    }
  };

  const fetchMyApplications = async () => {
    try {
      const { data } = await axiosInstance.get("/api/applications/my");
      if (data.success) {
        // backend may send `application` or `applications`; always keep an array
        const list = data.applications || data.application || [];
        setMyApplications(Array.isArray(list) ? list : [list]);
        return list;
      }
    } catch (error) {
      setMyApplications([]);
    }
    return [];
  };

  const applyForRoom = async ({ hostel, room, message }) => {
    try {
      const { data } = await axiosInstance.post("/api/applications", {
        hostel,
        room,
        message,
      });
      if (data.success) {
        toast.success("Application submitted");
        setMyApplications((prev) => [data.application, ...prev]);
        return data.application;
      }
      toast.error(data.message || "Could not apply");
    } catch (error) {
      toast.error(getErrorMessage(error, "Could not apply"));
    }
    return null;
  };

  const fetchMyRoom = async () => {
    try {
      const { data } = await axiosInstance.get("/api/applications/my-room");
      if (data.success) {
        setMyRoom({ room: data.room, hostel: data.hostel });
        return { room: data.room, hostel: data.hostel };
      }
    } catch (error) {
      setMyRoom(null);
    }
    return null;
  };

  // ================= FEE =================

  const createFee = async (feeInfo) => {
    try {
      const { data } = await axiosInstance.post("/api/fees", feeInfo);
      if (data.success) {
        toast.success(data.message || "Fee structure created");
        setFees((prev) => [data.feecreate, ...prev]);
        return data.feecreate;
      }
      toast.error(data.message || "Could not create fee");
    } catch (error) {
      toast.error(getErrorMessage(error, "Could not create fee"));
    }
    return null;
  };

  const fetchMyFee = async () => {
    try {
      const { data } = await axiosInstance.get("/api/fees/my");
      if (data.success) {
        setMyFee(data.fee);
        return data.fee;
      }
    } catch (error) {
      setMyFee(null);
    }
    return null;
  };

  const fetchWardenFees = async () => {
    try {
      const { data } = await axiosInstance.get("/api/fees/warden");
      if (data.success) {
        setFees(data.fees || []);
        return data.fees || [];
      }
    } catch (error) {
      // endpoint missing / failed: keep whatever is already in state
    }
    return [];
  };

  const updateFee = async (id, feeInfo) => {
    try {
      const { data } = await axiosInstance.put(`/api/fees/${id}`, feeInfo);
      if (data.success) {
        toast.success(data.message || "Fee structure updated");
        const total =
          (feeInfo.monthlyRent || 0) + (feeInfo.messFee || 0) +
          (feeInfo.electricityFee || 0) + (feeInfo.otherCharges || 0);
        const updated =
          data.fee || data.feeupdate || data.updatedFee || data.feecreate || null;
        setFees((prev) =>
          prev.map((f) =>
            f._id === id ? updated || { ...f, ...feeInfo, totalAmount: total } : f
          )
        );
        return updated || true;
      }
      toast.error(data.message || "Could not update fee");
    } catch (error) {
      toast.error(getErrorMessage(error, "Could not update fee"));
    }
    return null;
  };

  const deleteFee = async (id) => {
    try {
      const { data } = await axiosInstance.delete(`/api/fees/${id}`);
      if (data.success) {
        toast.success(data.message || "Fee structure deleted");
        setFees((prev) => prev.filter((f) => f._id !== id));
        return true;
      }
      toast.error(data.message || "Could not delete fee");
    } catch (error) {
      toast.error(getErrorMessage(error, "Could not delete fee"));
    }
    return false;
  };

  // ================= NOTICES =================

  const createNotice = async ({ title, message }) => {
    try {
      const { data } = await axiosInstance.post("/api/notices", {
        hostel: myHostel?._id,
        title,
        message,
      });
      if (data.success) {
        toast.success(data.message || "Notice posted");
        setNotices((prev) => [data.notice, ...prev]);
        return data.notice;
      }
      toast.error(data.message || "Could not post notice");
    } catch (error) {
      toast.error(getErrorMessage(error, "Could not post notice"));
    }
    return null;
  };

  const fetchMyNotices = async () => {
    try {
      const { data } = await axiosInstance.get("/api/notices/my");
      if (data.success) {
        setMyNotices(data.notices || []);
        return data.notices || [];
      }
    } catch (error) {
      setMyNotices([]);
    }
    return [];
  };

  const fetchWardenNotices = async () => {
    try {
      const { data } = await axiosInstance.get("/api/notices/warden");
      if (data.success) {
        setNotices(data.notices || []);
        return data.notices || [];
      }
    } catch (error) {
      // endpoint missing / failed: keep whatever is already in state
    }
    return [];
  };

  const updateNotice = async (id, { title, message }) => {
    try {
      const { data } = await axiosInstance.put(`/api/notices/${id}`, { title, message });
      if (data.success) {
        toast.success(data.message || "Notice updated");
        const updated = data.notice || null;
        setNotices((prev) =>
          prev.map((n) => (n._id === id ? updated || { ...n, title, message } : n))
        );
        return updated || true;
      }
      toast.error(data.message || "Could not update notice");
    } catch (error) {
      toast.error(getErrorMessage(error, "Could not update notice"));
    }
    return null;
  };

  const deleteNotice = async (id) => {
    try {
      const { data } = await axiosInstance.delete(`/api/notices/${id}`);
      if (data.success) {
        toast.success(data.message || "Notice deleted");
        setNotices((prev) => prev.filter((n) => n._id !== id));
        return true;
      }
      toast.error(data.message || "Could not delete notice");
    } catch (error) {
      toast.error(getErrorMessage(error, "Could not delete notice"));
    }
    return false;
  };

  // ================= PAYMENTS =================

  const createPayment = async ({ fee, month }) => {
    try {
      const { data } = await axiosInstance.post("/api/payments", { fee, month });
      if (data.success) {
        toast.success(data.message || "Payment request sent");
        setMyPayments((prev) => [data.payment, ...prev]);
        return data.payment;
      }
      toast.error(data.message || "Could not create payment");
    } catch (error) {
      toast.error(getErrorMessage(error, "Could not create payment"));
    }
    return null;
  };

  const fetchWardenPayments = async () => {
    try {
      const { data } = await axiosInstance.get("/api/payments/warden");
      if (data.success) {
        setWardenPayments(data.payments || []);
        return data.payments || [];
      }
    } catch (error) {
      setWardenPayments([]);
    }
    return [];
  };

  const confirmPayment = async (id) => {
    try {
      const { data } = await axiosInstance.put(`/api/payments/${id}/confirm`);
      if (data.success) {
        toast.success(data.message || "Payment confirmed");
        setWardenPayments((prev) =>
          prev.map((p) => (p._id === id ? data.payment : p))
        );
        return data.payment;
      }
      toast.error(data.message || "Could not confirm payment");
    } catch (error) {
      toast.error(getErrorMessage(error, "Could not confirm payment"));
    }
    return null;
  };

  // ================= COMPLAINTS =================

  const createComplaint = async ({ subject, message }) => {
    try {
      const { data } = await axiosInstance.post("/api/complaints", { subject, message });
      if (data.success) {
        toast.success(data.message || "Complaint submitted");
        return data.complaint;
      }
      toast.error(data.message || "Could not submit complaint");
    } catch (error) {
      toast.error(getErrorMessage(error, "Could not submit complaint"));
    }
    return null;
  };

  const fetchWardenComplaints = async () => {
    try {
      const { data } = await axiosInstance.get("/api/complaints/warden");
      if (data.success) {
        setWardenComplaints(data.complaints || []);
        return data.complaints || [];
      }
    } catch (error) {
      setWardenComplaints([]);
    }
    return [];
  };

  const resolveComplaint = async (id) => {
    try {
      const { data } = await axiosInstance.put(`/api/complaints/${id}/resolve`);
      if (data.success) {
        toast.success(data.message || "Complaint resolved");
        setWardenComplaints((prev) =>
          prev.map((c) => (c._id === id ? data.complaint : c))
        );
        return data.complaint;
      }
      toast.error(data.message || "Could not resolve complaint");
    } catch (error) {
      toast.error(getErrorMessage(error, "Could not resolve complaint"));
    }
    return null;
  };

  // After login, preload data according to role
  useEffect(() => {
    if (!userId || !token) return;
    if (user?.role === "warden") {
      fetchMyHostels();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, token]);

  const value = {
    citiesData,
    backendUrl,

    // auth
    token,
    user,
    authLoading,
    registerUser,
    loginUser,
    logoutUser,

    // hostels (public, from database)
    allHostels,
    hostelsLoading,
    fetchAllHostels,

    // hostel (warden)
    myHostel,
    fetchMyHostels,
    saveHostel,
    deleteHostel,

    // rooms
    myRooms,
    fetchMyRooms,
    createRoom,
    fetchHostelRooms,
    fetchAllRooms,
    updateRoom,
    deleteRoom,

    // applications
    wardenApplications,
    fetchWardenApplications,
    updateApplicationStatus,
    myApplications,
    fetchMyApplications,
    applyForRoom,
    myRoom,
    fetchMyRoom,

    // fee
    fees,
    fetchWardenFees,
    createFee,
    updateFee,
    deleteFee,
    myFee,
    fetchMyFee,

    // notices
    notices,
    fetchWardenNotices,
    createNotice,
    updateNotice,
    deleteNotice,
    myNotices,
    fetchMyNotices,

    // payments
    myPayments,
    createPayment,
    wardenPayments,
    fetchWardenPayments,
    confirmPayment,

    // complaints
    wardenComplaints,
    createComplaint,
    fetchWardenComplaints,
    resolveComplaint,
  };

  return <HostelContext.Provider value={value}>{children}</HostelContext.Provider>;
};

export default HosetlContextProvider;