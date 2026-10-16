import React, { useContext, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  FiArrowLeft, FiArrowRight, FiEye, FiEyeOff, FiHome,
  FiLock, FiMail, FiPhone, FiShield, FiUser, FiUserPlus, FiLogIn,
} from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";
import { HostelContext } from "../context/HosetlContext";

const panelMotion = {
  initial: { opacity: 0, x: 22 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -22 },
  transition: { duration: 0.25 },
};

const Input = ({ icon: Icon, label, className = "", ...props }) => (
  <label className="block space-y-1.5">
    <span className="text-xs font-semibold uppercase tracking-wider text-slate-700">{label}</span>
    <span className="relative flex items-center">
      <Icon className="absolute left-4 h-5 w-5 text-slate-400 pointer-events-none" />
      <input
        {...props}
        className={`w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:border-blue-600 focus:bg-white focus:ring-4 focus:ring-blue-600/10 ${className}`}
      />
    </span>
  </label>
);

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { authLoading, registerUser, verifyRegisterOtp, loginUser } = useContext(HostelContext);

  const [mode, setMode] = useState(location.pathname === "/register" ? "register" : "login");
  const [showPassword, setShowPassword] = useState(false);
  const [otp, setOtp] = useState("");
  const [pendingEmail, setPendingEmail] = useState("");
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [registerData, setRegisterData] = useState({
    name: "", email: "", password: "", phone: "", role: "student",
  });

  // Browser back/forward navigation updates the visible form.
  useEffect(() => {
    if (location.pathname === "/register") setMode((old) => old === "verify-otp" ? old : "register");
    if (location.pathname === "/login") setMode("login");
  }, [location.pathname]);

  const goTo = (next) => {
    setShowPassword(false);
    setMode(next);
    if (next !== "verify-otp") navigate(next === "register" ? "/register" : "/login");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const loggedInUser = await loginUser({
      email: loginData.email.trim().toLowerCase(),
      password: loginData.password,
    });
    if (loggedInUser) navigate(loggedInUser.role === "warden" ? "/dashboard" : "/", { replace: true });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const result = await registerUser(registerData);
    if (result) {
      setPendingEmail(result.email);
      setOtp("");
      setMode("verify-otp");
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(otp)) return;
    const success = await verifyRegisterOtp({ email: pendingEmail, otp });
    if (success) {
      setLoginData({ email: pendingEmail, password: "" });
      setRegisterData({ name: "", email: "", password: "", phone: "", role: "student" });
      setOtp("");
      setPendingEmail("");
      goTo("login");
    }
  };

  // Re-send by requesting a new OTP with the same pending registration data.
  // The backend enforces a cooldown; we display its error if retried too soon.
  const resendOtp = async () => {
    const result = await registerUser(registerData);
    if (result) {
      setPendingEmail(result.email);
      setOtp("");
    }
  };

  const buttonClass = "flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60";

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-slate-50 px-4 py-12">
      <div className="pointer-events-none absolute -left-20 top-1/4 h-72 w-72 rounded-full bg-blue-400/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-1/4 h-80 w-80 rounded-full bg-indigo-400/20 blur-3xl" />
      <motion.div initial={{ opacity: 0, y: 28, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.45 }} className="relative z-10 w-full max-w-md rounded-3xl border border-slate-100 bg-white p-7 shadow-xl sm:p-10">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-100 bg-blue-50 text-blue-600">
            {mode === "login" ? <FiLogIn size={26} /> : mode === "register" ? <FiUserPlus size={26} /> : <FiShield size={26} />}
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            {mode === "login" ? "Welcome Back!" : mode === "register" ? "Create Account" : "Verify Your Email"}
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            {mode === "login" ? "Sign in to your HostelHub account" : mode === "register" ? "Join HostelHub as a student or warden" : `Enter the 6-digit code sent to ${pendingEmail}`}
          </p>
        </div>

        <AnimatePresence mode="wait">
          {mode === "login" && (
            <motion.form key="login" {...panelMotion} onSubmit={handleLogin} className="space-y-5">
              <Input icon={FiMail} label="Email Address" type="email" name="email" autoComplete="email" required placeholder="Enter your email" value={loginData.email} onChange={(e) => setLoginData((p) => ({ ...p, email: e.target.value }))} />
              <div className="space-y-1.5">
                <label htmlFor="login-password" className="text-xs font-semibold uppercase tracking-wider text-slate-700">Password</label>
                <div className="relative flex items-center">
                  <FiLock className="pointer-events-none absolute left-4 h-5 w-5 text-slate-400" />
                  <input id="login-password" type={showPassword ? "text" : "password"} autoComplete="current-password" required placeholder="Enter your password" value={loginData.password} onChange={(e) => setLoginData((p) => ({ ...p, password: e.target.value }))} className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-12 text-sm outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10" />
                  <button type="button" aria-label={showPassword ? "Hide password" : "Show password"} onClick={() => setShowPassword((v) => !v)} className="absolute right-4 text-slate-500">{showPassword ? <FiEyeOff /> : <FiEye />}</button>
                </div>
              </div>
              <motion.button whileHover={{ scale: 1.015 }} whileTap={{ scale: 0.98 }} disabled={authLoading} className={buttonClass} type="submit">{authLoading ? "Signing In..." : "Sign In"}{!authLoading && <FiArrowRight />}</motion.button>
            </motion.form>
          )}

          {mode === "register" && (
            <motion.form key="register" {...panelMotion} onSubmit={handleRegister} className="space-y-4">
              <Input icon={FiUser} label="Full Name" name="name" autoComplete="name" required placeholder="Enter your full name" value={registerData.name} onChange={(e) => setRegisterData((p) => ({ ...p, name: e.target.value }))} />
              <Input icon={FiMail} label="Email Address" type="email" name="email" autoComplete="email" required placeholder="Enter your email" value={registerData.email} onChange={(e) => setRegisterData((p) => ({ ...p, email: e.target.value }))} />
              <Input icon={FiPhone} label="Phone Number" type="tel" name="phone" autoComplete="tel" required placeholder="03001234567" value={registerData.phone} onChange={(e) => setRegisterData((p) => ({ ...p, phone: e.target.value }))} />
              <div className="space-y-1.5">
                <label htmlFor="register-password" className="text-xs font-semibold uppercase tracking-wider text-slate-700">Password</label>
                <div className="relative flex items-center">
                  <FiLock className="pointer-events-none absolute left-4 h-5 w-5 text-slate-400" />
                  <input id="register-password" type={showPassword ? "text" : "password"} autoComplete="new-password" minLength={6} required placeholder="Create a password" value={registerData.password} onChange={(e) => setRegisterData((p) => ({ ...p, password: e.target.value }))} className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-12 text-sm outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10" />
                  <button type="button" aria-label={showPassword ? "Hide password" : "Show password"} onClick={() => setShowPassword((v) => !v)} className="absolute right-4 text-slate-500">{showPassword ? <FiEyeOff /> : <FiEye />}</button>
                </div>
              </div>
              <label className="block space-y-1.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-700">Select Role</span>
                <span className="relative flex items-center">
                  <FiHome className="pointer-events-none absolute left-4 h-5 w-5 text-slate-400" />
                  <select name="role" value={registerData.role} onChange={(e) => setRegisterData((p) => ({ ...p, role: e.target.value }))} className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-900 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10"><option value="student">Student</option><option value="warden">Warden</option></select>
                </span>
              </label>
              <motion.button whileHover={{ scale: 1.015 }} whileTap={{ scale: 0.98 }} disabled={authLoading} className={buttonClass} type="submit">{authLoading ? "Sending OTP..." : "Send Verification OTP"}{!authLoading && <FiArrowRight />}</motion.button>
            </motion.form>
          )}

          {mode === "verify-otp" && (
            <motion.form key="verify-otp" {...panelMotion} onSubmit={handleVerify} className="space-y-5">
              <label className="block space-y-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-700">6-Digit Verification Code</span>
                <input type="text" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" maxLength={6} required autoFocus placeholder="000000" value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 text-center text-2xl font-bold tracking-[0.35em] text-slate-900 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-600/10" />
              </label>
              <motion.button whileHover={{ scale: 1.015 }} whileTap={{ scale: 0.98 }} disabled={authLoading || otp.length !== 6} className={buttonClass} type="submit">{authLoading ? "Verifying..." : "Verify & Create Account"}{!authLoading && <FiArrowRight />}</motion.button>
              <div className="flex items-center justify-between gap-3 text-xs">
                <button type="button" disabled={authLoading} onClick={() => goTo("register")} className="flex items-center gap-1 font-semibold text-slate-600 hover:text-blue-600"><FiArrowLeft /> Edit details</button>
                <button type="button" disabled={authLoading} onClick={resendOtp} className="font-semibold text-blue-600 hover:underline disabled:opacity-50">Resend OTP</button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        {mode !== "verify-otp" && (
          <p className="mt-8 text-center text-xs text-slate-500">
            {mode === "login" ? "Don't have an account? " : "Already have an account? "}
            <button type="button" onClick={() => goTo(mode === "login" ? "register" : "login")} className="font-bold text-blue-600 hover:underline">{mode === "login" ? "Create Account" : "Sign In"}</button>
          </p>
        )}
      </motion.div>
    </div>
  );
}
