import { useContext, useEffect, useRef, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import useOnline from "../../utils/useOnline";
import UserContext from "../../utils/UserContext";
import { useSelector } from "react-redux";
import Logo from "./Logo";

const ACCENT = "#ff6b00";

const Svg = ({ d, className = "" }) => (
  <svg
    className={`shrink-0 ${className}`}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d={d} />
  </svg>
);

const ICON = {
  cart: "M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6",
  logout: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9",
  home: "m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM9 22V12h6v10",
  menu: "M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2M7 2v20M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3v7",
  user: "M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
  close: "M18 6 6 18M6 6l12 12",
  burger: "M3 6h18M3 12h18M3 18h18",
};

const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
  { label: "InstaFresh", to: "/instafresh" },
  { label: "Careers", to: "/careers" },
];

const BOTTOM_TABS = [
  { label: "Home", to: "/", icon: ICON.home, end: true },
  { label: "Menu", to: "/", icon: ICON.menu, end: false },
  { label: "Cart", to: "/cart", icon: ICON.cart, end: false },
  { label: "Profile", to: "/account", icon: ICON.user, end: false },
];

const Title = () => (
    <Link to="/" className="shrink-0" aria-label="BeYuumi home">
      <Logo className="logo" />
    </Link>
  );

/* Desktop nav links — hidden on mobile, shown via drawer instead */
const DesktopNav = () => (
  <nav className="hidden md:block" aria-label="Primary">
    <ul className="flex items-center gap-6 list-none">
      {NAV_LINKS.map((link) => (
        <li key={link.label}>
          <NavLink
            to={link.to}
            end={link.to === "/"}
            className={({ isActive }) =>
              `inline-flex items-center min-h-[44px] text-[15px] font-semibold transition-colors ${
                isActive ? "text-[#ff6b00]" : "text-[#282c3f] hover:text-[#ff6b00]"
              }`
            }
          >
            {link.label}
          </NavLink>
        </li>
      ))}
    </ul>
  </nav>
);

/* Slide-down drawer used on mobile in place of the desktop nav */
const MobileDrawer = ({ open, onClose }) => {
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div
      className={`fixed inset-0 z-[1100] md:hidden ${
        open ? "pointer-events-auto" : "pointer-events-none"
      }`}
      aria-hidden={!open}
    >
      {/* scrim */}
      <div
        className={`absolute inset-0 bg-black/40 transition-opacity duration-200 ${
          open ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />
      {/* panel */}
      <div
        className={`absolute top-0 inset-x-0 bg-white shadow-xl transition-transform duration-300 ease-out ${
          open ? "translate-y-0" : "-translate-y-full"
        }`}
        style={{ paddingTop: "calc(env(safe-area-inset-top, 0px) + 8px)" }}
        role="dialog"
        aria-label="Menu"
      >
        <div className="flex items-center justify-between px-5 h-16">
          <span className="text-lg font-extrabold text-slate-900">Menu</span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="grid h-11 w-11 place-items-center rounded-full text-slate-500 hover:bg-slate-100 active:scale-95 transition"
          >
            <Svg d={ICON.close} className="w-5 h-5" />
          </button>
        </div>
        <nav className="px-4 pb-6" aria-label="Mobile">
          <ul className="space-y-1 list-none">
            {NAV_LINKS.map((link) => (
              <li key={link.label}>
                <Link
                  to={link.to}
                  onClick={onClose}
                  className="flex items-center min-h-[48px] rounded-xl px-4 text-[15px] font-semibold text-slate-800 hover:bg-orange-50 hover:text-[#ff6b00] transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
};

/* App-style bottom tab bar — mobile only */
const BottomNav = ({ totalItems }) => (
  <nav
    className="bottom-nav md:hidden"
    aria-label="Bottom navigation"
    style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
  >
    <ul className="flex items-stretch list-none">
      {BOTTOM_TABS.map((tab) => (
        <li key={tab.label} className="flex-1">
          <NavLink
            to={tab.to}
            end={tab.end}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-1 min-h-[56px] transition-colors ${
                isActive ? "text-[#ff6b00]" : "text-[#9ca3af] hover:text-[#ff6b00]"
              }`
            }
          >
            <span className="relative">
              <Svg d={tab.icon} className="w-6 h-6" strokeWidth={tab.icon === ICON.cart ? 1.75 : 2} />
              {tab.label === "Cart" && totalItems > 0 && (
                <span
                  className="absolute -top-2 -right-2 grid min-w-[18px] h-[18px] px-1 place-items-center rounded-full text-white text-[10px] font-bold tabular-nums"
                  style={{ background: ACCENT, boxShadow: "0 2px 6px rgba(255,107,0,0.35)" }}
                >
                  {totalItems}
                </span>
              )}
            </span>
            <span className="text-[11px] font-semibold">{tab.label}</span>
          </NavLink>
        </li>
      ))}
    </ul>
  </nav>
);

const Header = () => {
  const isOnline = useOnline();
  const { user, loggedIn, logout } = useContext(UserContext);
  const cartItems = useSelector((store) => store.cart.items);
  const countRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const totalItems = cartItems.reduce((sum, i) => sum + (i.quantity || 1), 0);
  const initial = (user?.name || "U").trim().charAt(0).toUpperCase();

  return (
    <>
      <div className="header shadow-inner">
        <div className="flex items-center gap-2">
          {/* hamburger — mobile only */}
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            className="grid h-11 w-11 place-items-center rounded-full text-slate-700 hover:bg-orange-50 active:scale-95 transition md:hidden"
          >
            <Svg d={ICON.burger} className="w-5 h-5" />
          </button>
          <Title />
        </div>

        <DesktopNav />

        <div className="log-btn">
          {/* online status pill */}
          <span
            data-testid="onlineStatus"
            className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold min-h-[32px] ${
              isOnline
                ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                : "bg-red-50 text-red-600 ring-1 ring-red-200"
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${isOnline ? "bg-emerald-500 animate-pulse" : "bg-red-500"}`}
            />
            {isOnline ? "Online" : "Offline"}
          </span>

          {/* cart icon + count badge — always visible & sticky */}
          <Link
            to="/cart"
            className="relative inline-flex items-center gap-2 px-3 min-h-[44px] rounded-full hover:bg-orange-50 transition-colors"
            aria-label={`Cart with ${totalItems} items`}
          >
            <span className="text-[#2d2d2d] hover:text-[#ff6b00] transition-colors">
              <Svg d={ICON.cart} className="w-5 h-5" />
            </span>
            <span
              ref={countRef}
              data-testid="cartTest"
              className="shrink-0 min-w-[20px] h-5 px-1.5 rounded-full text-white text-[11px] font-bold flex items-center justify-center tabular-nums"
              style={{ background: ACCENT, boxShadow: "0 2px 6px rgba(255,107,0,0.35)" }}
              key={totalItems}
            >
              {totalItems}
            </span>
          </Link>

          {loggedIn ? (
            <>
              <Link
                to="/account"
                className="inline-flex items-center gap-2.5 px-1 min-h-[44px]"
              >
                <span
                  className="grid h-9 w-9 place-items-center rounded-full text-white font-bold text-sm shadow-sm"
                  style={{ background: "linear-gradient(135deg, #ff6b00, #f97316)" }}
                >
                  {initial}
                </span>
                <span className="hidden lg:inline text-sm font-bold text-[#2d2d2d]">
                  {user.name}
                </span>
              </Link>
              <button
                className="btn inline-flex items-center gap-1.5"
                onClick={() => logout()}
              >
                <Svg d={ICON.logout} className="w-4 h-4" />
                Signout
              </button>
            </>
          ) : (
            <Link to="/login">
              <button className="btn">LogIn</button>
            </Link>
          )}
        </div>
      </div>

      <MobileDrawer open={menuOpen} onClose={() => setMenuOpen(false)} />
      <BottomNav totalItems={totalItems} />
    </>
  );
};

export default Header;