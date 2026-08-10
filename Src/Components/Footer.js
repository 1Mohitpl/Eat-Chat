import { useContext } from "react";
import { Link } from "react-router-dom";
import UserContext from "../../utils/UserContext";

const ACCENT = "#ff6b00";
const NAVY = "#0f172a";
const NAVY_SOFT = "#1e293b";

const Svg = ({ d, className = "", strokeWidth = 2 }) => (
  <svg
    className={`shrink-0 ${className}`}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d={d} />
  </svg>
);

const ICON = {
  brand:
    "M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2M7 2v20M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3v7",
  instagram:
    "M16 3H8a5 5 0 0 0-5 5v8a5 5 0 0 0 5 5h8a5 5 0 0 0 5-5V8a5 5 0 0 0-5-5Zm-4 13.5A4.5 4.5 0 1 1 12 7.5 4.5 4.5 0 0 1 16.5 12 4.5 4.5 0 0 1 12 16.5Zm5.5-9h.01",
  twitter:
    "M4 4l7.2 9.6L4.4 20h2.6l5.4-4.8L16.8 20H20l-7.4-9.9L18.9 4h-2.6l-4.9 4.4L8.2 4H4Z",
  facebook:
    "M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3V2Z",
  linkedin:
    "M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4V8h4v1.5A5.98 5.98 0 0 1 16 8ZM6 9H2v12h4V9Zm-2-3a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z",
  youtube:
    "M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33Z",
  pin: "M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0ZM12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z",
  phone:
    "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z",
  mail: "M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Zm18 2-10 7L2 8M22 18l-7-5M2 18l7-5",
  arrowUpRight: "M7 17 17 7M7 7h10v10",
  apple:
    "M12 2c.8 0 2.5.27 3.9 1.03 1.1.6 1.9 1.4 2.3 2.3.9 2.9-.2 6.6-2.3 8.6-1.3 1.25-2.5 1.2-3.9.4-.4-.2-.8-.2-1.2 0-1.4.8-2.6.85-3.9-.4-2.1-2-3.2-5.7-2.3-8.6.4-.9 1.2-1.7 2.3-2.3C9.5 2.27 11.2 2 12 2Zm-4.4 4.5a2.8 2.8 0 0 0-2.3 1.2c-1.9 2.6 1.8 6.8 4 6.8 0-2.6 1.1-5.8 2.5-7.1a2.9 2.9 0 0 0-2.2.3c-.6.35-1.15.45-2 .3ZM16.1 8.6c.4-1.6.2-3.4-.6-4.8",
  play:
    "M5 3l14 9-14 9V3Z",
  shield:
    "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z M9 12l2 2 4-4",
  heart:
    "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78Z",
  glob: 
    "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Zm-10-10h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10Z",
};

const LINK_COLUMNS = [
  {
    title: "Company",
    links: [
      { label: "About us", to: "/about", external: false },
      { label: "Careers", to: "/careers", external: false },
      { label: "Contact us", to: "/contact", external: false },
      { label: "InstaFresh", to: "/instaFresh", external: false },
      { label: "Login / Signup", to: "/login", external: false },
    ],
  },
  {
    title: "For Customers",
    links: [
      { label: "Browse restaurants", to: "/", external: false },
      { label: "Shopping cart", to: "/cart", external: false },
      { label: "Checkout", to: "/checkout", external: false },
      { label: "My account", to: "/account", external: false },
      { label: "Help & support", to: "/contact", external: false },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy policy", to: "/", external: true },
      { label: "Terms & conditions", to: "/", external: true },
      { label: "Refund & cancellation", to: "/", external: true },
      { label: "FSSAI compliance", to: "/", external: true },
    ],
  },
];

const SOCIALS = [
  { label: "Instagram", icon: ICON.instagram },
  { label: "Twitter", icon: ICON.twitter },
  { label: "Facebook", icon: ICON.facebook },
  { label: "LinkedIn", icon: ICON.linkedin },
  { label: "YouTube", icon: ICON.youtube },
];

const PAYMENT_TEXT = ["UPI", "VISA", "Mastercard", "RuPay", "Net Banking", "COD"];

const Column = ({ data }) => (
  <div>
    <h4 className="text-white font-display font-bold text-[15px] tracking-tight">
      {data.title}
    </h4>
    <ul className="mt-4 space-y-2.5">
      {data.links.map((link) =>
        link.external ? (
          <li key={link.label}>
            <a
              href="#"
              className="text-[13.5px] text-slate-400 hover:text-white transition-colors"
            >
              {link.label}
            </a>
          </li>
        ) : (
          <li key={link.label}>
            <Link
              to={link.to}
              className="text-[13.5px] text-slate-400 hover:text-white transition-colors"
            >
              {link.label}
            </Link>
          </li>
        )
      )}
    </ul>
  </div>
);

const StoreBadge = ({ store }) => (
  <a
    href="#"
    className="inline-flex items-center gap-2.5 rounded-xl px-4 py-2.5 transition-all duration-200 hover:-translate-y-0.5 hover:ring-white/40 active:scale-95"
    style={{
      background: "rgba(255,255,255,0.06)",
      border: "1px solid rgba(255,255,255,0.14)",
    }}
  >
    <Svg d={store === "apple" ? ICON.apple : ICON.play} className="w-5 h-5 text-white" />
    <span className="leading-tight text-left">
      <span className="block text-[9px] uppercase tracking-wider text-slate-400">
        {store === "apple" ? "Download on the" : "Get it on"}
      </span>
      <span className="block text-[13px] font-bold text-white">
        {store === "apple" ? "App Store" : "Google Play"}
      </span>
    </span>
  </a>
);

const Footer = () => {
  const { user } = useContext(UserContext);
  const name = user?.name || "Mohit";
  const email = user?.email || "mohit1paul@gmail.com";
  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-auto" style={{ background: NAVY }}>
      {/* subtle top brand accent bar */}
      <div className="h-[3px] w-full" style={{ background: `linear-gradient(90deg, ${ACCENT}, #ff7a1a, ${ACCENT})` }} />

      {/* newsletter strip */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="max-w-md">
            <h3 className="text-white font-display text-xl sm:text-2xl font-extrabold tracking-tight">
              Get <span style={{ color: ACCENT }}>fresh bites</span> in your inbox
            </h3>
            <p className="mt-1.5 text-sm text-slate-400">
              New restaurants, trending dishes and exclusive offers — no spam, just flavour.
            </p>
          </div>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="w-full lg:w-auto flex items-center gap-2.5 bg-white rounded-full p-1.5 shadow-lg"
          >
            <input
              type="email"
              placeholder="Enter your email"
              aria-label="Email address"
              className="flex-1 lg:w-[280px] h-10 px-4 rounded-full text-sm text-slate-800 placeholder-slate-400 focus:outline-none bg-transparent"
            />
            <button
              type="submit"
              className="shrink-0 h-10 px-5 rounded-full text-white text-sm font-bold transition-all duration-200 active:scale-95 hover:brightness-110"
              style={{ background: ACCENT, boxShadow: "0 6px 16px rgba(255,107,0,0.35)" }}
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* main link grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10">
          {/* brand column */}
          <div className="lg:col-span-4">
            <div className="flex items-center gap-3">
              <span
                className="grid h-11 w-11 place-items-center rounded-2xl text-white"
                style={{ background: ACCENT, boxShadow: "0 8px 20px rgba(255,107,0,0.35)" }}
              >
                <Svg d={ICON.brand} className="w-6 h-6" strokeWidth={1.75} />
              </span>
              <div>
                <p className="font-display text-white text-xl font-extrabold tracking-tight">
                  Be<span style={{ color: ACCENT }}>Yuumi</span>
                </p>
                <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500 font-semibold">
                  Food delivers joy
                </p>
              </div>
            </div>

            <p className="mt-5 text-sm leading-relaxed text-slate-400 max-w-xs">
              Order from neighbourhood favourites, track your food live, and enjoy
              doorstep delivery in minutes. Fresh, fast and always delicious.
            </p>

            {/* trust row */}
            <div className="mt-5 flex items-center gap-4 text-slate-400">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold">
                <Svg d={ICON.shield} className="w-4 h-4" style={{ color: ACCENT }} />
                100% Secure payments
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold">
                <Svg d={ICON.heart} className="w-4 h-4" style={{ color: ACCENT }} />
                Loved by 1000s
              </span>
            </div>

            {/* socials */}
            <div className="mt-6">
              <p className="text-[11px] uppercase tracking-[0.18em] text-slate-500 font-semibold mb-3">
                Follow us
              </p>
              <div className="flex items-center gap-2.5">
                {SOCIALS.map((s) => (
                  <a
                    key={s.label}
                    href="#"
                    aria-label={s.label}
                    className="grid h-10 w-10 place-items-center rounded-full text-slate-400 transition-all duration-200 hover:text-white hover:-translate-y-0.5"
                    style={{ border: "1px solid rgba(255,255,255,0.14)", background: "rgba(255,255,255,0.04)" }}
                  >
                    <Svg d={s.icon} className="w-[18px] h-[18px]" strokeWidth={1.75} />
                  </a>
                ))}
              </div>

              {/* app badges */}
              <div className="mt-6 flex flex-wrap items-center gap-2.5">
                <StoreBadge store="apple" />
                <StoreBadge store="google" />
              </div>
            </div>
          </div>

          {/* link columns */}
          <div className="sm:col-span-2 lg:col-span-6 grid grid-cols-2 sm:grid-cols-3 gap-8">
            {LINK_COLUMNS.map((col) => (
              <Column key={col.title} data={col} />
            ))}
          </div>

          {/* contact column */}
          <div className="lg:col-span-2">
            <h4 className="text-white font-display font-bold text-[15px] tracking-tight">
              Get in touch
            </h4>
            <ul className="mt-4 space-y-3.5 text-[13.5px] text-slate-400">
              <li className="flex items-start gap-2.5">
                <Svg d={ICON.pin} className="w-4 h-4 mt-0.5" style={{ color: ACCENT }} />
                <span>Raiganj, West Bengal, India</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Svg d={ICON.mail} className="w-4 h-4 mt-0.5" style={{ color: ACCENT }} />
                <a href={`mailto:${email}`} className="hover:text-white transition-colors break-all">
                  {email}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <Svg d={ICON.phone} className="w-4 h-4 mt-0.5" style={{ color: ACCENT }} />
                <a href="tel:+919000000000" className="hover:text-white transition-colors">
                  +91 90000 00000
                </a>
              </li>
            </ul>

            <a
              href="#"
              className="mt-6 inline-flex items-center gap-2 text-[13px] font-bold"
              style={{ color: ACCENT }}
            >
              Help centre
              <Svg d={ICON.arrowUpRight} className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* payment strip */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-wrap items-center justify-between gap-4">
          <p className="text-xs text-slate-500">We accept</p>
          <div className="flex flex-wrap items-center gap-2">
            {PAYMENT_TEXT.map((p) => (
              <span
                key={p}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold text-slate-300 uppercase tracking-wide"
                style={{ border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.04)" }}
              >
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-500 flex items-center gap-1.5">
            © {year} BeYuumi | Developed with
            <Svg d={ICON.heart} className="w-3.5 h-3.5" style={{ color: "#fb7185" }} />
            by {name}
          </p>
          <p className="text-xs text-slate-500">
            <a href={`mailto:${email}`} className="hover:text-white transition-colors">
              {email}
            </a>
          </p>
          <div className="flex items-center gap-3 text-xs text-slate-500">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <span className="w-1 h-1 rounded-full bg-slate-600" />
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <span className="w-1 h-1 rounded-full bg-slate-600" />
            <span className="inline-flex items-center gap-1.5">
              <Svg d={ICON.glob} className="w-3.5 h-3.5" />
              India (English)
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;