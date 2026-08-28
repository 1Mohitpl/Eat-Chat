import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { forgotPassword } from "../../utils/auth";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import MailOutlinedIcon from "@mui/icons-material/MailOutlined";
import Logo from "./Logo";

const ACCENT = "#e8590c";
const ACCENT_SOFT = "rgba(232, 89, 12, 0.14)";

const inputSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "12px",
    backgroundColor: "#fff",
    transition: "box-shadow .25s ease, border-color .25s ease, background-color .25s ease",
    "& fieldset": { borderColor: "#eae2d7", transition: "border-color .25s ease" },
    "&:hover fieldset": { borderColor: "#d9b79a" },
    "&.Mui-focused fieldset": { borderColor: ACCENT, borderWidth: "1.5px" },
    "&.Mui-focused": { boxShadow: `0 0 0 4px ${ACCENT_SOFT}`, backgroundColor: "#fffdfb" },
  },
  "& .MuiOutlinedInput-input": { py: "14px", color: "#2f2a33", fontSize: "0.9375rem" },
  "& .MuiInputLabel-root": { color: "#a29a90", fontSize: "0.875rem", "&.Mui-focused": { color: ACCENT } },
  "& .MuiInputAdornment-root": { color: "#b8aca0" },
};

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter your email address");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await forgotPassword({ email });
      setSent(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#fffaf3] via-[#fdf3e8] to-[#fbe9d8] px-6">
        <div className="w-full max-w-md rounded-3xl bg-white p-8 sm:p-10 shadow-[0_40px_80px_-32px_rgba(150,80,20,0.35)] ring-1 ring-white/60 text-center">
          <div className="mx-auto mb-5 grid h-12 w-12 place-items-center rounded-2xl bg-emerald-50 text-emerald-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="font-display text-[1.5rem] font-extrabold tracking-tight text-[#1f1b16]">
            Check your email
          </h2>
          <p className="mt-3 text-sm text-[#7a6f63] leading-relaxed">
            If an account exists for <strong>{email}</strong>, we've sent a password reset link. The link expires in 1 hour.
          </p>
          <Link
            to="/login"
            className="inline-block mt-6 px-6 py-2.5 rounded-xl bg-[#e8590c] text-white text-sm font-semibold shadow-md hover:bg-[#c93a0a] transition-colors"
          >
            Back to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#fffaf3] via-[#fdf3e8] to-[#fbe9d8] px-6">
      <div className="pointer-events-none absolute -top-32 -left-24 h-[28rem] w-[28rem] rounded-full bg-gradient-to-br from-[#ffd9a8] to-[#ffe9c4] opacity-50 blur-3xl" />
      <div className="pointer-events-none absolute top-1/3 -right-32 h-[30rem] w-[30rem] rounded-full bg-gradient-to-br from-[#e8590c]/15 to-[#ffc88c]/30 opacity-70 blur-3xl" />

      <header className="relative flex items-center justify-center py-6">
        <Link to="/" className="flex items-center select-none" aria-label="BeYuumi home">
          <Logo height={46} />
        </Link>
      </header>

      <div className="relative w-full max-w-md rounded-3xl bg-white p-8 sm:p-10 shadow-[0_40px_80px_-32px_rgba(150,80,20,0.35)] ring-1 ring-white/60">
        <div className="text-center mb-8">
          <span className="mx-auto mb-5 grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-[#e8590c] to-[#ff7a1a] text-white shadow-lg shadow-[#e8590c]/30">
            <MailOutlinedIcon />
          </span>
          <h2 className="font-display text-[1.5rem] font-extrabold tracking-tight text-[#1f1b16]">
            Forgot password?
          </h2>
          <p className="mt-1.5 text-sm text-[#a29a90]">
            Enter your email and we'll send you a reset link
          </p>
        </div>

        {error && (
          <div className="mb-6 flex items-center gap-2 px-4 py-3 rounded-xl bg-red-50 ring-1 ring-red-200 text-red-600 text-sm">
            <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
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

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={loading}
            sx={{
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
            {loading ? <CircularProgress size={22} color="inherit" /> : "Send Reset Link"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Remember your password?{" "}
          <Link
            to="/login"
            className="font-semibold text-[#e8590c] hover:text-[#c93a0a] hover:underline underline-offset-4"
          >
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
