import { useState, useContext } from "react";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import { loginUser, registerUser } from "../../utils/auth";
import UserContext from "../../utils/UserContext";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import RestaurantOutlinedIcon from "@mui/icons-material/RestaurantOutlined";
import StarOutlinedIcon from "@mui/icons-material/StarOutlined";
import FaceOutlinedIcon from "@mui/icons-material/FaceOutlined";
import MailOutlinedIcon from "@mui/icons-material/MailOutlined";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import SportsBarOutlinedIcon from "@mui/icons-material/SportsBarOutlined";
import ScheduleOutlinedIcon from "@mui/icons-material/ScheduleOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import heroFoodImg from "../imgs/hero-food.jpg";

const LOGO =
  "https://themes.muffingroup.com/be/recipes3/wp-content/uploads/2022/12/berecipes3.svg";

const ACCENT = "#e8590c";
const ACCENT_SOFT = "rgba(232, 89, 12, 0.14)";

const FEATURES = [
  {
    icon: <RestaurantOutlinedIcon />,
    title: "3,000+ Restaurants",
    desc: "Street food to fine dining",
  },
  {
    icon: <LocalShippingOutlinedIcon />,
    title: "Lightning-Fast Delivery",
    desc: "Hot food in minutes",
  },
  {
    icon: <StarOutlinedIcon />,
    title: "Top Rated Chefs",
    desc: "Curated by experts",
  },
];

const TRUST = [
  { icon: <CheckCircleOutlinedIcon />, label: "100% Secure checkout" },
  { icon: <ScheduleOutlinedIcon />, label: "Live order tracking" },
  { icon: <SportsBarOutlinedIcon />, label: "Exclusive members' deals" },
];

const QUOTES = [
  "Eat. Refresh. Repeat.",
  "Great taste, great ingredients.",
  "Your cravings, delivered.",
  "Savor every bite.",
];

const inputSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "12px",
    backgroundColor: "#fff",
    transition: "box-shadow .25s ease, border-color .25s ease, background-color .25s ease",
    "& fieldset": {
      borderColor: "#eae2d7",
      transition: "border-color .25s ease",
    },
    "&:hover fieldset": { borderColor: "#d9b79a" },
    "&.Mui-focused fieldset": { borderColor: ACCENT, borderWidth: "1.5px" },
    "&.Mui-focused": {
      boxShadow: `0 0 0 4px ${ACCENT_SOFT}`,
      backgroundColor: "#fffdfb",
    },
  },
  "& .MuiOutlinedInput-input": {
    py: "14px",
    color: "#2f2a33",
    fontSize: "0.9375rem",
  },
  "& .MuiInputLabel-root": {
    color: "#a29a90",
    fontSize: "0.875rem",
    "&.Mui-focused": { color: ACCENT },
  },
  "& .MuiInputAdornment-root": { color: "#b8aca0" },
};

const LogInPage = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { login, loggedIn } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  if (loggedIn) {
    return <Navigate to="/" replace />;
  }

  const switchMode = (registerMode) => {
    setIsRegister(registerMode);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password || (isRegister && !name)) {
      setError("Please fill in all the fields");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const data = isRegister
        ? await registerUser({ name, email, password })
        : await loginUser({ email, password });

      login(data);
      navigate(from || "/", { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col overflow-x-hidden bg-gradient-to-b from-[#fffaf3] via-[#fdf3e8] to-[#fbe9d8]">
      {/* ---- soft ambient glows ---- */}
      <div className="pointer-events-none absolute -top-32 -left-24 h-[28rem] w-[28rem] rounded-full bg-gradient-to-br from-[#ffd9a8] to-[#ffe9c4] opacity-50 blur-3xl" />
      <div className="pointer-events-none absolute top-1/4 -right-32 h-[30rem] w-[30rem] rounded-full bg-gradient-to-br from-[#e8590c]/15 to-[#ffc88c]/30 opacity-70 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-[#fbe3c8] opacity-60 blur-3xl" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#e8590c]/30 to-transparent" />

      <header className="relative flex items-center justify-center py-6 animate-fade-down">
        <span className="flex items-center gap-3 select-none">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-[#ff7a1a] to-[#c93a0a] text-white shadow-lg shadow-[#e8590c]/30">
            <RestaurantOutlinedIcon fontSize="small" />
          </span>
          <img src={LOGO} alt="BeYuumi" className="h-7 w-auto" />
        </span>
      </header>

      <main className="relative flex-1 w-full max-w-6xl mx-auto grid lg:grid-cols-2 items-center gap-12 px-6 py-2">
        {/* LEFT : marketing / graphics */}
        <div className="order-2 lg:order-1 flex flex-col justify-center">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/70 backdrop-blur ring-1 ring-[#e8590c]/15 text-[#b45309] text-xs font-medium tracking-wide shadow-sm animate-fade-up">
            <StarOutlinedIcon className="!text-sm !text-[#e8590c]" />
            Loved by 2M+ foodies
          </span>

          <h1
            className="font-display mt-5 text-4xl sm:text-[2.5rem] lg:text-[2.75rem] font-extrabold leading-[1.06] tracking-tight text-[#1f1b16] animate-fade-up"
            style={{ animationDelay: "120ms" }}
          >
            Delicious food,
            <br />
            <span className="bg-gradient-to-r from-[#e8590c] to-[#ff7a1a] bg-clip-text text-transparent">
              delivered with love.
            </span>
          </h1>

          <p
            className="mt-5 max-w-md text-[1.05rem] leading-relaxed text-[#7a6f63] animate-fade-up"
            style={{ animationDelay: "240ms" }}
          >
            {isRegister
              ? "Join the BeYuumi family and unlock exclusive deals on every single order."
              : "Log in to keep satisfying your cravings in just a few taps."}
          </p>

          {/* subtle tag pills */}
          <div className="flex flex-wrap gap-2 mt-6 animate-fade-up" style={{ animationDelay: "320ms" }}>
            {QUOTES.map((q, i) => (
              <span
                key={i}
                className="px-3 py-1 rounded-full bg-[#e8590c]/5 text-[#b45309]/80 text-[0.8rem] font-medium ring-1 ring-[#e8590c]/10"
              >
                {q}
              </span>
            ))}
          </div>

          {/* food image */}
          <div className="mt-5 relative max-w-md">
            <div className="absolute -inset-2.5 rounded-[2rem] bg-gradient-to-br from-[#e8590c]/15 to-[#ffc88c]/30 blur-lg -z-10" />
            <img
              src={heroFoodImg}
              alt="Delicious food spread"
              className="w-full h-44 sm:h-52 object-cover rounded-[1.5rem] shadow-[0_24px_60px_-24px_rgba(150,80,20,0.45)] ring-4 ring-white/90"
            />
            <div className="absolute top-3 left-3 flex items-center gap-2.5 rounded-xl bg-white/90 backdrop-blur px-3 py-2 shadow-md shadow-black/5">
              <span className="grid h-7 w-7 place-items-center rounded-lg bg-[#fff1e6] text-[#e8590c]">
                <StarOutlinedIcon className="text-base" />
              </span>
              <div className="leading-tight">
                <div className="text-[0.8rem] font-semibold text-[#1f1b16]">4.8 rated</div>
                <div className="text-[0.65rem] text-gray-400">2M+ happy orders</div>
              </div>
            </div>
            <div className="absolute bottom-3 right-3 flex items-center gap-2.5 rounded-xl bg-white/90 backdrop-blur px-3 py-2 shadow-md shadow-black/5">
              <span className="grid h-7 w-7 place-items-center rounded-lg bg-emerald-50 text-emerald-600">
                <LocalShippingOutlinedIcon className="text-base" />
              </span>
              <div className="leading-tight">
                <div className="text-[0.8rem] font-semibold text-[#1f1b16]">30 min delivery</div>
                <div className="text-[0.65rem] text-gray-400">Always on time</div>
              </div>
            </div>
          </div>

          {/* trust checklist — single row, no overlap */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 animate-fade-up" style={{ animationDelay: "420ms" }}>
            {TRUST.map((t, i) => (
              <div
                key={i}
                className="flex items-center gap-2 text-[0.82rem] font-medium text-[#6b6357]"
              >
                <span className="grid h-5 w-5 place-items-center rounded-full bg-[#e8590c]/10 text-[#e8590c] shrink-0">
                  {t.icon}
                </span>
                <span className="leading-snug">{t.label}</span>
              </div>
            ))}
          </div>

          {/* feature cards */}
          <div className="mt-5 grid grid-cols-3 gap-3 animate-fade-up" style={{ animationDelay: "520ms" }}>
            {FEATURES.map((f, i) => (
              <div
                key={i}
                className="group flex flex-col items-center text-center rounded-2xl bg-white/90 p-5 shadow-[0_2px_12px_-4px_rgba(120,60,20,0.12)] ring-1 ring-[#e8590c]/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_36px_-12px_rgba(150,80,20,0.25)]"
              >
                <div className="mb-2 grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-[#fff1e6] to-[#ffe3cc] text-[#e8590c] transition-all duration-300 group-hover:from-[#e8590c] group-hover:to-[#ff7a1a] group-hover:text-white">
                  {f.icon}
                </div>
                <div className="font-display font-semibold text-sm text-[#1f1b16]">{f.title}</div>
                <div className="mt-1 text-xs text-gray-400">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT : form card */}
        <div className="order-1 lg:order-2 animate-fade-up" style={{ animationDelay: "180ms" }}>
          <div className="relative rounded-3xl bg-white p-8 sm:p-10 shadow-[0_40px_80px_-32px_rgba(150,80,20,0.35)] ring-1 ring-white/60">
            <div className="pointer-events-none absolute -top-10 -right-10 h-40 w-40 rounded-full bg-gradient-to-br from-[#ffe3cc] to-[#fff6ec] opacity-80 blur-2xl" />

            <div className="text-center mb-8">
              <span className="mx-auto mb-5 grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-[#e8590c] to-[#ff7a1a] text-white shadow-lg shadow-[#e8590c]/30 animate-bounce-soft">
                <RestaurantOutlinedIcon />
              </span>
              <h2 className="font-display text-[1.5rem] font-extrabold tracking-tight text-[#1f1b16]">
                {isRegister ? "Create your account" : "Welcome back!"}
              </h2>
              <p className="mt-1.5 text-sm text-[#a29a90]">
                {isRegister ? "It takes less than a minute" : "We're glad to see you again"}
              </p>
            </div>

            {error && (
              <div className="mb-6 flex items-center gap-2 px-4 py-3 rounded-xl bg-red-50 ring-1 ring-red-200 text-red-600 text-sm animate-shake">
                <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {isRegister && (
                <TextField
                  fullWidth
                  label="Full Name"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  variant="outlined"
                  sx={inputSx}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <FaceOutlinedIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              )}

              <TextField
                fullWidth
                label="Email Address"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                variant="outlined"
                sx={inputSx}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <MailOutlinedIcon />
                    </InputAdornment>
                  ),
                }}
              />

              <div>
                <TextField
                  fullWidth
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  variant="outlined"
                  sx={inputSx}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockOutlinedIcon />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                          sx={{ color: "#b8aca0", "&:hover": { color: "#e8590c" } }}
                        >
                          {showPassword ? (
                            <VisibilityOffOutlinedIcon />
                          ) : (
                            <VisibilityOutlinedIcon />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                {!isRegister && (
                  <div className="flex justify-end mt-2">
                    <button
                      type="button"
                      className="text-[0.8rem] font-semibold text-[#b45309] transition-colors hover:text-[#e8590c]"
                    >
                      Forgot password?
                    </button>
                  </div>
                )}
              </div>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                endIcon={<ArrowForwardIcon />}
                sx={{
                  mt: 1,
                  py: 1.6,
                  fontWeight: 700,
                  letterSpacing: "0.1px",
                  textTransform: "none",
                  fontSize: "1rem",
                  borderRadius: "12px",
                  background: "linear-gradient(135deg, #ff7a1a 0%, #d9480f 100%)",
                  boxShadow: "0 12px 24px -8px rgba(217,72,15,0.55)",
                  "&:hover": {
                    background: "linear-gradient(135deg, #ff7a1a 0%, #c93a0a 100%)",
                    transform: "translateY(-1px)",
                    boxShadow: "0 16px 30px -8px rgba(217,72,15,0.6)",
                  },
                  "&:active": { transform: "translateY(0)", boxShadow: "0 8px 18px -8px rgba(217,72,15,0.5)" },
                  "&:disabled": {
                    background: "linear-gradient(135deg, #ffb184 0%, #e88b5f 100%)",
                    boxShadow: "none",
                  },
                  transition: "all .25s ease",
                }}
              >
                {loading ? (
                  <CircularProgress size={22} color="inherit" />
                ) : isRegister ? (
                  "Create Account"
                ) : (
                  "Log In"
                )}
              </Button>
            </form>

            <div className="my-8 flex items-center gap-4 text-xs font-medium uppercase tracking-widest text-gray-400">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent to-gray-200" />
              <span>Or</span>
              <div className="flex-1 h-px bg-gradient-to-l from-transparent to-gray-200" />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <button className="group flex items-center justify-center gap-2 rounded-xl bg-white ring-1 ring-gray-200 py-3 text-sm font-semibold text-gray-600 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:ring-[#e8590c]/30 hover:text-[#e8590c] hover:shadow-lg hover:shadow-[#e8590c]/10">
                <svg className="w-[18px] h-[18px] shrink-0" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M13.5 12h3l.5-3h-3.5V7.5c0-.82.23-1.5 1.6-1.5H17V3.1C16.7 3.05 15.6 3 14.3 3c-2.6 0-4.3 1.5-4.3 4.2V9H7.5v3H10v9h3.5v-9z" />
                </svg>
                Facebook
              </button>
              <button className="group flex items-center justify-center gap-2 rounded-xl bg-white ring-1 ring-gray-200 py-3 text-sm font-semibold text-gray-600 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:ring-[#4285F4]/40 hover:text-[#4285F4] hover:shadow-lg hover:shadow-blue-200/20">
                <svg className="w-[18px] h-[18px] shrink-0" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 5.9c2 0 3.4 1.3 4.1 1.8l1.6-1.6C16.5 4.9 14.5 3.9 12 3.9c-3.2 0-6 1.9-7.4 4.7l1.9 1.4C7.6 7.3 9.6 5.9 12 5.9zM3 12c0 1.5.4 3 1.2 4.3l1.9-1.5c-.4-.9-.6-1.8-.6-2.8 0-1 .2-1.9.6-2.8L4.2 7.7C3.4 9 3 10.5 3 12zM12 18.1c-2.5 0-4.4-1.4-5.4-3.1l-1.9 1.5C6 19.9 8.8 21.9 12 21.9c2.5 0 4.5-1 6-2.5l-1.8-1.5c-1.5 1-2.7 1.3-4.2 1.3zM19.9 12.6c0-.6-.1-1.1-.2-1.6h-7.7v3.2h4.4c-.2 1.2-1.4 2.3-3 2.3-.9 0-1.8-.3-2.5-.8l-1.9 1.5c1.2 1 2.8 1.5 4.4 1.5 2.6 0 4.6-1.5 5.5-4.1.3-.6.5-1.2.5-2.2z" />
                </svg>
                Google
              </button>
              <button className="group flex items-center justify-center gap-2 rounded-xl bg-white ring-1 ring-gray-200 py-3 text-sm font-semibold text-gray-600 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:ring-gray-400/50 hover:text-black hover:shadow-lg hover:shadow-black/10">
                <svg className="w-[18px] h-[18px] shrink-0" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.5 2 2 6.5 2 12c0 4.4 2.9 8.2 6.8 9.5.5.1.7-.2.7-.5v-1.7c-2.8.6-3.4-1.4-3.4-1.4-.5-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.5 1.1 1.5 1.1.9 1.5 2.8 1.1 3.5.8.1-.7.4-1.1.6-1.4-2.6-.3-5.4-1.3-5.4-5.8 0-1.3.5-2.3 1.2-3.2-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.3 1.2a11.3 11.3 0 016 0c2.3-1.5 3.3-1.2 3.3-1.2.6 1.6.2 2.8.1 3.1.8.9 1.1 1.9 1.1 3.2 0 4.5-2.8 5.5-5.4 5.8.4.4.8 1.1.8 2.2V21c0 .3.2.6.7.5A10 10 0 0022 12c0-5.5-4.5-10-10-10z" />
                </svg>
                Apple
              </button>
            </div>

            <p className="mt-8 text-center text-sm text-gray-500">
              {isRegister ? "Already have an account?" : "New to BeYuumi?"}{" "}
              <button
                onClick={() => switchMode(isRegister ? false : true)}
                className="font-semibold text-[#e8590c] transition-colors hover:text-[#c93a0a] hover:underline underline-offset-4"
              >
                {isRegister ? "Log In" : "Create an account"}
              </button>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LogInPage;