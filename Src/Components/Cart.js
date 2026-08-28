import React, { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  clearCart,
  incrementQuantity,
  decrementQuantity,
  removeItem,
  addItem,
} from "../../utils/cartslice";
import { computeCartTotals, FREE_DELIVERY_THRESHOLD } from "../../utils/cartTotals";
import { PRODUCTS } from "../mocks/groceries";

const fmt = (v) => `\u20B9${(v / 100).toLocaleString("en-IN")}`;
const img_cdn =
  "https://media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto,w_660/";
const getImageUrl = (id) =>
  id?.startsWith("http") ? id : id ? `${img_cdn}${id}` : null;

/* ---------- icons (all outline, stroke-based) ---------- */

const ICON = {
  cart: "M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6",
  minus: "M5 12h14",
  plus: "M12 5v14M5 12h14",
  trash: "M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2",
  truck: "M1 3h15v13H1M16 8h4l3 3v5h-7V8Z M5.5 18.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM18.5 18.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z",
  star: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  arrowLeft: "M19 12H5m7-7-7 7 7 7",
  arrowRight: "M5 12h14m-7-7 7 7-7 7",
  creditCard: "M1 4h22v16H1V4zm0 6h22",
  tag: "M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82zM7 7h.01",
  gift: "M3 8h18v4H3V8zm9 0v13M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7M7.5 8a2.5 2.5 0 0 1 0-5A4.5 4.5 0 0 1 12 7.5M16.5 8a2.5 2.5 0 0 0 0-5A4.5 4.5 0 0 0 12 7.5",
  check: "M20 6 9 17l-5-5",
  chevronDown: "m6 9 6 6 6-6",
  chevronRight: "m9 6 6 6-6 6",
  rupee: "M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6",
  utensils: "M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2M7 2v20M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3v7",
  clock: "M12 7v5l3 3M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z",
  note: "M4 20h4L18.5 9.5a2.1 2.1 0 0 0-3-3L5 17v3ZM13.5 6.5l3 3",
  dessert: "M6 21a9 9 0 0 1 12 0M3 12a9 9 0 0 1 18 0M3 12c2.5-2 5.5-3 9-3s6.5 1 9 3",
  fire: "M12 22c4.97 0 9-3.58 9-8 0-3.9-2.6-6.6-4-8-1 2-1 4-2 5C14 8 12 5 12 2c-3 2.5-5 6-5 10 0 .7.1 1.3.3 1.9C4.8 12.6 3 10.6 3 8c-1.4 2-2 4.4-2 6 0 4.42 4.03 8 9 8Z",
  image: "M4 4h16v16H4V4zm4 5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm14 6-4-4-6 6-3-3-5 5v1h18v-5Z",
};

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

/* ---------- badges ---------- */

const VegBadge = () => (
  <span className="inline-flex items-center justify-center w-[15px] h-[15px] border-2 border-emerald-500 rounded-[4px] bg-white shrink-0">
    <span className="w-[7px] h-[7px] bg-emerald-500 rounded-full" />
  </span>
);

const NonVegBadge = () => (
  <span className="inline-flex items-center justify-center w-[15px] h-[15px] border-2 border-red-500 rounded-[4px] bg-white shrink-0">
    <span className="w-[7px] h-[7px] bg-red-500 rounded-full" />
  </span>
);

/* ---------- toast / snackbar ---------- */

const Toast = ({ toast, onClose }) => {
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(onClose, 2600);
    return () => clearTimeout(t);
  }, [toast, onClose]);

  if (!toast) return null;

  return (
    <div
      className="fixed bottom-20 lg:bottom-8 left-1/2 -translate-x-1/2 z-[60] flex items-center gap-3 pl-4 pr-5 py-3 rounded-2xl text-white text-sm font-semibold shadow-2xl"
      style={{ background: "#0f172a", animation: "toastIn 0.25s ease" }}
    >
      <span className="grid w-7 h-7 place-items-center rounded-full bg-emerald-500">
        <Svg d={ICON.check} className="w-3.5 h-3.5" strokeWidth={3} />
      </span>
      {toast}
      <button onClick={onClose} aria-label="Dismiss" className="text-white/50 hover:text-white transition-colors">
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  );
};

/* ---------- image with skeleton fallback ---------- */

const ItemImage = ({ src, alt, className, isVeg }) => {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    const el = imgRef.current;
    if (el && el.complete) {
      setLoaded(true);
    }
  }, [src]);

  return (
    <div className={`relative rounded-2xl overflow-hidden bg-slate-100 ${className}`}>
      {!loaded && (
        <div className="absolute inset-0 shimmerUI" />
      )}
      {failed ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-300 gap-1.5">
          <Svg d={ICON.image} className="w-8 h-8" />
          <span className="text-[10px] font-medium text-slate-400">No image</span>
        </div>
      ) : (
        src && (
          <img
            ref={imgRef}
            src={src}
            alt={alt}
            referrerpolicy="no-referrer"
            onLoad={() => setLoaded(true)}
            onError={() => { setLoaded(true); setFailed(true); }}
            className={`w-full h-full object-cover transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
          />
        )
      )}
      {isVeg !== undefined && (
        <span className="absolute top-2 left-2">
          {isVeg ? <VegBadge /> : <NonVegBadge />}
        </span>
      )}
    </div>
  );
};

/* ---------- empty cart ---------- */

const EmptyCart = () => (
  <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "#fafafa" }}>
    <div className="text-center max-w-sm">
      <div
        className="w-[136px] h-[136px] mx-auto mb-8 rounded-full flex items-center justify-center"
        style={{
          background: "linear-gradient(135deg, #fff7ed, #fffbeb)",
          border: "1px solid rgba(255,237,213,0.6)",
          boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
        }}
      >
        <Svg d={ICON.cart} className="w-14 h-14" strokeWidth={1.5} style={{ color: "#fdba74" }} />
      </div>
      <h2 className="text-2xl font-bold tracking-tight" style={{ color: "#111" }}>
        Your cart is empty
      </h2>
      <p className="text-sm mt-3 leading-relaxed" style={{ color: "#6b7280" }}>
        You haven&apos;t added any items yet. Browse restaurants and find something delicious.
      </p>
      <Link
        to="/"
        className="mt-8 inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full text-white font-semibold text-sm transition-all duration-200 active:scale-[0.97] hover:translate-y-[-1px]"
        style={{ background: "#ff6b00", boxShadow: "0 8px 24px rgba(255,107,0,0.25)" }}
      >
        <Svg d={ICON.utensils} className="w-4 h-4" />
        Explore Restaurants
      </Link>
    </div>
  </div>
);

/* ---------- confirm dialog ---------- */

const ConfirmDialog = ({ open, title, description, confirmLabel, onClose, onConfirm }) => {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.45)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-[320px] bg-white rounded-2xl p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        style={{ animation: "cdFadeIn 0.2s ease-out" }}
      >
        <div className="text-center">
          <div className="mx-auto mb-4 w-12 h-12 rounded-full flex items-center justify-center" style={{ background: "#fef2f2" }}>
            <Svg d={ICON.trash} className="w-5 h-5" style={{ color: "#ef4444" }} />
          </div>
          <h3 className="font-semibold text-gray-900 text-base">{title}</h3>
          <p className="text-sm text-gray-500 mt-2 leading-relaxed">{description}</p>
          <div className="mt-6 flex gap-2.5">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl text-gray-700 font-medium text-sm transition-colors hover:bg-gray-50"
              style={{ border: "1px solid #e5e7eb" }}
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 py-2.5 rounded-xl text-white font-medium text-sm transition-all active:scale-95"
              style={{ background: "#ef4444" }}
            >
              {confirmLabel || "Remove"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ---------- qty stepper (compact pill) ---------- */

const QtyStepper = ({ value, onMinus, onPlus, small = false }) => (
  <div
    className="inline-flex items-center rounded-full"
    style={{ border: "1px solid #e5e7eb", background: "#fff", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}
  >
    <button
      onClick={onMinus}
      className={`flex items-center justify-center rounded-l-full text-gray-500 transition-all hover:bg-orange-50 hover:text-[#ff6b00] active:scale-90 ${small ? "w-7 h-7" : "w-9 h-9"}`}
      aria-label="Decrease"
    >
      <Svg d={ICON.minus} className="w-3 h-3" strokeWidth={2.5} />
    </button>
    <span
      key={value}
      className={`min-w-[28px] text-center font-bold text-gray-900 select-none tabular-nums ${small ? "text-[13px]" : "text-sm"}`}
      style={{ animation: "qtyPop 0.2s ease" }}
    >
      {value}
    </span>
    <button
      onClick={onPlus}
      className={`flex items-center justify-center rounded-r-full text-gray-500 transition-all hover:bg-orange-50 hover:text-[#ff6b00] active:scale-90 ${small ? "w-7 h-7" : "w-9 h-9"}`}
      aria-label="Increase"
    >
      <Svg d={ICON.plus} className="w-3 h-3" strokeWidth={2.5} />
    </button>
  </div>
);

/* ---------- cart item ---------- */

const CartItem = React.memo(function CartItem({ item, index, onToast, onBump }) {
  const dispatch = useDispatch();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [notes, setNotes] = useState("");
  const [showNotes, setShowNotes] = useState(false);
  const [flash, setFlash] = useState(false);

  const { info = {}, quantity = 1 } = item || {};
  const itemKey = info.id || info.name || `item-${index}`;
  const imageUrl = getImageUrl(info.imageId);
  const price = Number(info.price) || 0;
  const lineTotal = price * quantity;
  const isVeg = info.isVeg !== false;
  const rating = info.ratings?.aggregatedRating?.rating || info.ratings?.rating || null;

  const flashTimer = useRef(null);
  const bump = () => {
    setFlash(true);
    if (flashTimer.current) clearTimeout(flashTimer.current);
    flashTimer.current = setTimeout(() => setFlash(false), 600);
  };

  const handleRemove = useCallback(() => {
    setRemoving(true);
    setTimeout(() => {
      dispatch(removeItem(itemKey));
      setDialogOpen(false);
      setRemoving(false);
      onToast("Item removed from cart");
      onBump?.();
    }, 200);
  }, [dispatch, itemKey, onToast, onBump]);

  const handleDec = useCallback(() => {
    if (quantity > 1) {
      dispatch(decrementQuantity(itemKey));
      bump();
      onToast("Quantity updated");
    } else {
      setDialogOpen(true);
    }
  }, [dispatch, itemKey, quantity]);

  const handleInc = useCallback(() => {
    dispatch(incrementQuantity(itemKey));
    bump();
    onToast("Quantity updated");
  }, [dispatch, itemKey]);

  useEffect(() => () => { if (flashTimer.current) clearTimeout(flashTimer.current); }, []);

  return (
    <>
      <div
        className={`flex gap-4 p-5 transition-all duration-300 ${removing ? "opacity-0 -translate-x-3" : ""}`}
        style={{ borderBottom: "1px solid #f1f1f1" }}
      >
        <div className="w-[104px] shrink-0">
          <ItemImage src={imageUrl} alt={info.name} isVeg={isVeg} className="w-[104px] h-[104px]" />
          <p className="text-[10px] font-medium mt-1.5 text-slate-400 text-center">
            {fmt(price)} each
          </p>
        </div>

        <div className="flex-1 min-w-0 flex flex-col">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <h3 className="font-display font-bold text-[15px] leading-snug text-slate-900 truncate">
                {info.name}
              </h3>
              {rating && (
                <div className="flex items-center gap-1 mt-1">
                  <Svg d={ICON.star} className="w-3 h-3" style={{ color: "#10b981", fill: "#10b981" }} />
                  <span className="text-xs font-medium" style={{ color: "#6b7280" }}>{rating}</span>
                </div>
              )}
            </div>
            <button
              onClick={() => setDialogOpen(true)}
              className="shrink-0 flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium transition-all hover:bg-red-50 hover:text-red-500 active:scale-95"
              style={{ color: "#9ca3af", background: "#f9fafb" }}
              aria-label={`Remove ${info.name}`}
            >
              <Svg d={ICON.trash} className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Remove</span>
            </button>
          </div>

          {/* special instructions */}
          <div className="mt-2">
            <button
              type="button"
              onClick={() => setShowNotes(!showNotes)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#ff6b00] transition-colors hover:text-[#e05e00]"
            >
              <Svg d={ICON.note} className="w-3.5 h-3.5" />
              {showNotes ? "Hide notes" : "Add special instructions"}
            </button>
            {showNotes && (
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. extra cheese, less spicy"
                className="mt-2 w-full h-9 px-3.5 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#ff6b00]/30 transition-shadow"
                style={{ border: "1px solid #e5e7eb", background: "#fafafa" }}
              />
            )}
          </div>

          {/* stepper + price row */}
          <div className="mt-auto pt-3 flex items-center justify-between gap-3">
            <QtyStepper value={quantity} onMinus={handleDec} onPlus={handleInc} small />
            <div className="text-right">
              <div
                key={lineTotal}
                className="font-display font-extrabold text-lg tabular-nums"
                style={{ color: flash ? "#ff6b00" : "#111827", animation: "priceFlash 0.5s ease", transition: "color .3s" }}
              >
                {fmt(lineTotal)}
              </div>
            </div>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={dialogOpen}
        title="Remove item?"
        description={`Remove ${info.name} from your cart?`}
        confirmLabel="Remove"
        onClose={() => setDialogOpen(false)}
        onConfirm={handleRemove}
      />
    </>
  );
});

/* ---------- progress / nudge ---------- */

const DeliveryProgress = ({ subtotal }) => {
  const threshold = FREE_DELIVERY_THRESHOLD;
  const remaining = threshold - subtotal;
  if (remaining <= 0) return null;
  const progress = Math.min(100, (subtotal / threshold) * 100);
  return (
    <div
      className="rounded-2xl p-4"
      style={{ background: "linear-gradient(135deg, #fff7ed, #fffbeb)", border: "1px solid rgba(255,237,213,0.5)" }}
    >
      <div className="flex items-start gap-3">
        <span className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "#fff", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
          <Svg d={ICON.truck} className="w-4 h-4" style={{ color: "#ff6b00" }} />
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold" style={{ color: "#9a3412" }}>
            Add <span style={{ color: "#ff6b00" }}>{fmt(remaining)}</span> more for
          </p>
          <p className="text-sm font-bold" style={{ color: "#9a3412" }}>FREE Delivery</p>
          <div className="mt-2.5 h-2 rounded-full overflow-hidden" style={{ background: "rgba(251,146,60,0.2)" }}>
            <div
              className="h-full rounded-full transition-all duration-700 ease-out"
              style={{ width: `${progress}%`, background: "linear-gradient(90deg, #ff6b00, #fb923c)" }}
            />
          </div>
          <p className="text-[11px] font-medium mt-1.5" style={{ color: "#c2410c" }}>
            Free delivery above {fmt(threshold)}
          </p>
        </div>
      </div>
    </div>
  );
};

/* free-dessert gamified nudge */
const DessertNudge = ({ subtotal }) => {
  const threshold = 80000; // ₹800
  const remaining = threshold - subtotal;
  if (remaining <= 0) {
    return (
      <div className="flex items-center gap-3 px-4 py-3 rounded-2xl" style={{ background: "#ecfdf5", border: "1px solid #d1fae5" }}>
        <span className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ background: "#d1fae5" }}>
          <Svg d={ICON.dessert} className="w-4 h-4" style={{ color: "#059669" }} />
        </span>
        <span className="text-xs font-bold" style={{ color: "#065f46" }}>
          Free dessert unlocked! 🎉
        </span>
      </div>
    );
  }
  const progress = Math.min(100, (subtotal / threshold) * 100);
  return (
    <div className="rounded-2xl px-4 py-3" style={{ background: "linear-gradient(135deg, #fdf2f8, #fff1f2)", border: "1px solid rgba(244,114,182,0.2)" }}>
      <div className="flex items-center gap-2.5 mb-2">
        <span className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ background: "#fff" }}>
          <Svg d={ICON.dessert} className="w-4 h-4" style={{ color: "#ec4899" }} />
        </span>
        <p className="text-xs font-semibold leading-snug" style={{ color: "#9d174d" }}>
          Add <span style={{ color: "#ec4899" }}>{fmt(remaining)}</span> more for a{" "}
          <span className="font-extrabold">free dessert!</span>
        </p>
      </div>
      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(244,114,182,0.15)" }}>
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{ width: `${progress}%`, background: "linear-gradient(90deg, #ec4899, #f472b6)" }}
        />
      </div>
    </div>
  );
};

/* ---------- price line ---------- */

const PriceLine = ({ label, value, icon, highlight }) => (
  <div className="flex items-center justify-between py-1">
    <span className="text-sm flex items-center gap-2" style={{ color: highlight ? "#059669" : "#6b7280", fontWeight: highlight ? 600 : 400 }}>
      {icon && <Svg d={ICON[icon]} className="w-3.5 h-3.5" style={{ color: highlight ? "#10b981" : "#9ca3af" }} />}
      {label}
    </span>
    <span className="text-sm tabular-nums font-medium" style={{ color: highlight ? "#059669" : "#111827" }}>{value}</span>
  </div>
);

/* ---------- offers + coupon (merged) ---------- */

const OffersSection = ({ appliedPromo, onApplyPromo, subtotal }) => {
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  const promos = useMemo(() => {
    const list = [
      { code: "WELCOME50", title: "50% OFF up to ₹100", desc: "on your first order", elig: true },
      { code: "SAVE20", title: "20% OFF up to ₹75", desc: "on orders above ₹299", elig: subtotal >= 29900 },
    ];
    return list;
  }, [subtotal]);

  const best = promos.find((p) => p.elig);

  const applyCode = (e) => {
    e.preventDefault();
    if (!code.trim()) return;
    const found = promos.find((p) => p.code === code.trim().toUpperCase());
    if (found && found.elig) {
      onApplyPromo(found.code);
      setCode("");
      setError("");
      setOpen(false);
    } else {
      setError(found ? "Order doesn't meet the minimum amount" : "Invalid or expired coupon");
    }
  };

  return (
    <div
      className="rounded-3xl overflow-hidden"
      style={{ background: "#fff", border: "1px solid #f1f1f1", boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}
    >
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-5 gap-2 transition-colors hover:bg-gray-50/50"
      >
        <h4 className="font-bold text-sm flex items-center gap-3" style={{ color: "#111" }}>
          <span className="w-9 h-9 rounded-xl flex items-center justify-center shadow-sm" style={{ background: "linear-gradient(135deg, #fff7ed, #fffbeb)" }}>
            <Svg d={ICON.gift} className="w-4 h-4" style={{ color: "#ff6b00" }} />
          </span>
          Offers &amp; coupons
        </h4>
        <div className="flex items-center gap-2">
          {appliedPromo && (
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full" style={{ color: "#059669", background: "#ecfdf5" }}>
              {appliedPromo.code}
            </span>
          )}
          <Svg d={ICON.chevronDown} className={`w-4 h-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`} style={{ color: "#9ca3af" }} strokeWidth={2.5} />
        </div>
      </button>

      {appliedPromo && !open && (
        <div className="px-6 pb-4 -mt-1">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full" style={{ color: "#b45309", background: "#fffbeb" }}>
            <Svg d={ICON.fire} className="w-3 h-3" />
            Best offer applied
          </span>
        </div>
      )}

      {open && (
        <div className="px-6 pb-6 space-y-3 pt-2" style={{ borderTop: "1px solid #f1f1f1" }}>
          {best && !appliedPromo && (
            <button
              type="button"
              onClick={() => { onApplyPromo(best.code); setOpen(false); }}
              className="w-full text-left p-4 rounded-2xl transition-all flex items-center justify-between gap-4 group cursor-pointer"
              style={{ border: "1px solid #fde68a", background: "linear-gradient(135deg, rgba(255,251,235,0.8), rgba(254,243,199,0.4))" }}
            >
              <div className="flex items-start gap-3 min-w-0">
                <span className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "#fff" }}>
                  <Svg d={ICON.fire} className="w-4 h-4" style={{ color: "#ff6b00" }} />
                </span>
                <div className="min-w-0">
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-wider shrink-0" style={{ color: "#b45309", background: "#fef3c7" }}>
                    Best offer
                  </span>
                  <p className="text-sm font-bold mt-1 truncate" style={{ color: "#111" }}>{best.title}</p>
                  <p className="text-xs mt-0.5" style={{ color: "#6b7280" }}>{best.desc}</p>
                </div>
              </div>
              <span className="shrink-0 px-4 py-1.5 text-xs font-semibold rounded-full transition-all group-hover:translate-y-[-1px]" style={{ color: "#ff6b00", background: "#fff" }}>
                Apply
              </span>
            </button>
          )}

          {promos.map((p) => (
            <div key={p.code} className="flex items-center justify-between gap-3 p-4 rounded-2xl" style={{ border: "1px solid #f1f1f1" }}>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded uppercase tracking-wider" style={{ color: "#ff6b00", background: "rgba(255,107,0,0.08)" }}>
                    {p.code}
                  </span>
                  {p.elig && appliedPromo?.code === p.code && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ color: "#059669", background: "#ecfdf5" }}>Applied</span>
                  )}
                </div>
                <p className="text-xs font-semibold mt-1" style={{ color: "#111" }}>{p.title}</p>
                <p className="text-[11px] mt-0.5" style={{ color: "#9ca3af" }}>{p.desc}</p>
              </div>
              {p.elig && appliedPromo?.code !== p.code && (
                <button
                  onClick={() => { onApplyPromo(p.code); setOpen(false); }}
                  className="shrink-0 px-4 py-1.5 text-xs font-semibold rounded-full transition-all hover:translate-y-[-1px] active:scale-95"
                  style={{ color: "#ff6b00", background: "#fff7ed" }}
                >
                  Apply
                </button>
              )}
              {!p.elig && (
                <span className="shrink-0 text-[11px] font-medium text-slate-400">Requires ₹299+</span>
              )}
            </div>
          ))}

          <form onSubmit={applyCode} className="flex gap-2.5 pt-1">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Svg d={ICON.tag} className="w-3.5 h-3.5" style={{ color: "#9ca3af" }} />
              </div>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                onFocus={() => setError("")}
                placeholder="Enter coupon code"
                maxLength={15}
                className="w-full h-11 pl-9 pr-3.5 text-sm rounded-full placeholder-gray-400 transition-colors focus:outline-none"
                style={{ border: error ? "1px solid #fca5a5" : "1px solid #e5e7eb", background: error ? "#fef2f2" : "#fafafa" }}
              />
              {error && <p className="absolute -bottom-[18px] left-4 text-[11px]" style={{ color: "#ef4444" }}>{error}</p>}
            </div>
            <button
              type="submit"
              disabled={!code.trim()}
              className="h-11 px-5 text-white font-semibold text-sm rounded-full transition-all active:scale-95 hover:translate-y-[-1px] shrink-0 disabled:opacity-40 disabled:hover:translate-y-0"
              style={{ background: "#ff6b00" }}
            >
              Apply
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

/* ---------- itemized breakdown (collapsible) ---------- */

const ItemizedBreakdown = ({ cartItems }) => {
  const [open, setOpen] = useState(false);
  const totalQty = cartItems.reduce((s, i) => s + (i.quantity || 1), 0);
  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-1 text-left transition-colors hover:text-[#ff6b00]"
      >
        <span className="text-sm font-semibold" style={{ color: "#6b7280" }}>
          {totalQty} {totalQty === 1 ? "item" : "items"}
        </span>
        <Svg d={ICON.chevronDown} className={`w-4 h-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`} style={{ color: "#9ca3af" }} strokeWidth={2.5} />
      </button>
      {open && (
        <div className="mt-2 space-y-2 rounded-2xl p-3" style={{ background: "#fafafa", animation: "cdFadeIn 0.2s ease" }}>
          {cartItems.map((it, idx) => (
            <div key={it.info.id || it.info.name || idx} className="flex items-center justify-between gap-3 text-sm">
              <span className="min-w-0 flex-1 truncate text-slate-600">
                <span className="font-semibold text-slate-400 mr-1.5">{it.quantity}×</span>
                {it.info.name}
              </span>
              <span className="font-semibold text-slate-700 tabular-nums shrink-0">
                {fmt((Number(it.info.price) || 0) * (it.quantity || 1))}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/* ---------- order summary ---------- */

const OrderSummary = ({ cartItems, subtotal, deliveryFee, tax, grandTotal, totalItems, appliedPromo, onApplyPromo, onCheckout, checkingOut }) => {
  const [freeBanner, setFreeBanner] = useState(true);
  const [breakdownOpen, setBreakdownOpen] = useState(false);

  return (
    <aside className="space-y-5">
      <div className="rounded-3xl overflow-hidden" style={{ background: "#fff", border: "1px solid #f1f1f1", boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}>
        <button
          type="button"
          onClick={() => setBreakdownOpen(!breakdownOpen)}
          className="w-full flex items-center justify-between px-6 py-5 gap-2 transition-colors hover:bg-gray-50/50"
        >
          <div className="text-left">
            <h3 className="font-display font-bold text-lg tracking-tight" style={{ color: "#111" }}>Order Summary</h3>
            <div className="mt-0.5 flex items-center gap-2">
              <ItemizedBreakdown cartItems={cartItems} />
            </div>
          </div>
          <Svg d={ICON.chevronDown} className={`w-4 h-4 transition-transform duration-200 ${breakdownOpen ? "rotate-180" : ""}`} style={{ color: "#9ca3af" }} strokeWidth={2.5} />
        </button>

        {breakdownOpen && (
          <div className="px-6 pb-2 space-y-1" style={{ animation: "cdFadeIn 0.2s ease" }}>
            {cartItems.map((it, idx) => (
              <div key={it.info.id || it.info.name || idx} className="flex items-center justify-between gap-3 text-sm py-1">
                <span className="min-w-0 flex-1 truncate text-slate-600">
                  <span className="font-semibold text-slate-400 mr-1.5">{it.quantity}×</span>
                  {it.info.name}
                </span>
                <span className="font-semibold text-slate-700 tabular-nums shrink-0">
                  {fmt((Number(it.info.price) || 0) * (it.quantity || 1))}
                </span>
              </div>
            ))}
          </div>
        )}

        <div className="px-6 pt-4 pb-6 space-y-4">
          <DeliveryProgress subtotal={subtotal} />
          <DessertNudge subtotal={subtotal} />

          {deliveryFee === 0 && subtotal > 0 && freeBanner && (
            <div
              className="flex items-center gap-3 px-4 py-3 rounded-2xl"
              style={{ background: "#ecfdf5", border: "1px solid #d1fae5", animation: "cdFadeIn 0.3s ease" }}
            >
              <span className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ background: "#d1fae5" }}>
                <Svg d={ICON.check} className="w-4 h-4" style={{ color: "#059669" }} strokeWidth={2.5} />
              </span>
              <span className="text-xs font-semibold" style={{ color: "#065f46" }}>Free delivery on this order</span>
              <button
                onClick={() => setFreeBanner(false)}
                aria-label="Dismiss"
                className="ml-auto p-1 rounded-full text-emerald-400 hover:text-emerald-600 hover:bg-emerald-100 transition-colors"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          )}

          <div className="space-y-1.5">
            <PriceLine label="Item total" value={fmt(subtotal)} />
            {deliveryFee > 0 ? (
              <PriceLine label="Delivery fee" value={fmt(deliveryFee)} icon="truck" />
            ) : (
              <PriceLine label="Delivery fee" value="FREE" icon="truck" highlight />
            )}
            <PriceLine label="Tax & charges" value={fmt(tax)} icon="rupee" />
            {appliedPromo && (
              <div className="flex items-center justify-between py-1" style={{ color: "#047857" }}>
                <span className="text-sm flex items-center gap-2">
                  <Svg d={ICON.tag} className="w-3.5 h-3.5" style={{ color: "#10b981" }} />{appliedPromo.code}
                </span>
                <span className="text-sm font-semibold">-{fmt(appliedPromo.discount)}</span>
              </div>
            )}
          </div>

          <div className="pt-4 flex items-center justify-between" style={{ borderTop: "1px solid #f1f1f1" }}>
            <div>
              <span className="font-display font-bold text-slate-900">To pay</span>
              <p className="text-[11px] font-medium mt-0.5 flex items-center gap-1.5" style={{ color: "#10b981" }}>
                <Svg d={ICON.clock} className="w-3 h-3" />
                Arrives in 25-30 min
              </p>
            </div>
            <span className="font-display font-extrabold text-2xl tracking-tight tabular-nums" style={{ color: "#111" }}>
              {fmt(grandTotal)}
            </span>
          </div>
        </div>

        <div className="px-6 pb-6 space-y-3">
          <button
            type="button"
            onClick={onCheckout}
            disabled={checkingOut}
            className="group flex items-center justify-center gap-3 w-full h-14 rounded-full text-white font-bold text-sm transition-all duration-200 active:scale-[0.97] disabled:opacity-80"
            style={{ background: "linear-gradient(135deg, #ff6b00, #f97316)", boxShadow: "0 8px 24px rgba(255,107,0,0.25)" }}
          >
            {checkingOut ? (
              <>
                <span className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                Placing order…
              </>
            ) : (
              <>
                <Svg d={ICON.creditCard} className="w-4 h-4" />
                Proceed to Checkout
                <Svg d={ICON.arrowRight} className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" strokeWidth={2.5} />
              </>
            )}
          </button>
          {appliedPromo && (
            <p className="text-xs text-center leading-relaxed" style={{ color: "#9ca3af" }}>
              You saved {fmt(appliedPromo.discount)} on this order!
            </p>
          )}
        </div>
      </div>

      <OffersSection appliedPromo={appliedPromo} onApplyPromo={onApplyPromo} subtotal={subtotal} />
    </aside>
  );
};

/* ---------- frequently ordered together (upsell) ---------- */

const SUGGESTED = [
  { id: "sug-1", name: "Butter Buns", price: 5900, isVeg: true, rating: "4.5", imageId: "https://www.themealdb.com/images/media/meals/l6hj9a1784668199.jpg" },
  { id: "sug-2", name: "Chocolate Brownies", price: 8900, isVeg: true, rating: "4.8", imageId: "https://www.themealdb.com/images/media/meals/yypvst1511386427.jpg" },
  { id: "sug-3", name: "Greek Salad", price: 6900, isVeg: true, rating: "4.4", imageId: "https://www.themealdb.com/images/media/meals/k29viq1585565980.jpg" },
  { id: "sug-4", name: "Matar Paneer", price: 12900, isVeg: true, rating: "4.7", imageId: "https://www.themealdb.com/images/media/meals/xxpqsy1511452222.jpg" },
  { id: "sug-5", name: "Chocolate Gateau", price: 10900, isVeg: true, rating: "4.6", imageId: "https://www.themealdb.com/images/media/meals/tqtywx1468317395.jpg" },
];

const FrequentlyOrdered = ({ items, onAdd, onToast }) => (
  <div className="mt-6">
    <div className="flex items-center gap-3 mb-4">
      <h3 className="font-display font-bold text-lg tracking-tight" style={{ color: "#111" }}>
        Frequently ordered together
      </h3>
      <div className="flex-1 h-px bg-slate-200" />
    </div>
    <div className="flex gap-4 overflow-x-auto pb-3 scrollbar-none -mx-1 px-1">
      {items.map((s) => (
        <div
          key={s.id}
          className="w-[176px] shrink-0 rounded-2xl bg-white overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
          style={{ border: "1px solid #f1f1f1", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}
        >
          <div className="relative h-[112px] bg-slate-100">
            <ItemImage src={getImageUrl(s.imageId)} alt={s.name} isVeg={s.isVeg} className="w-full h-[112px]" />
            {s.rating && (
              <span className="absolute bottom-2 right-2 inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-white/95 text-[10px] font-bold text-emerald-600 shadow-sm">
                <Svg d={ICON.star} className="w-2.5 h-2.5" style={{ fill: "#10b981" }} />
                {s.rating}
              </span>
            )}
          </div>
          <div className="p-3">
            <p className="text-[13px] font-bold text-slate-900 truncate">{s.name}</p>
            <div className="mt-2 flex items-center justify-between gap-2">
              <span className="text-sm font-extrabold text-slate-900 tabular-nums">{fmt(s.price)}</span>
              <button
                type="button"
                onClick={() => { onAdd(s); onToast(`${s.name} added to cart`); }}
                className="px-3.5 py-1.5 rounded-full text-[11px] font-bold text-white transition-all active:scale-95 hover:translate-y-[-1px]"
                style={{ background: "#16a34a", boxShadow: "0 4px 12px rgba(22,163,74,0.25)" }}
              >
                ADD +
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

/* ---------- mobile sticky bottom bar ---------- */

const MobileCheckoutBar = ({ totalItems, grandTotal, handleClear, onCheckout, checkingOut }) => {
  const [clearing, setClearing] = useState(false);
  useEffect(() => {
    if (clearing) {
      const t = setTimeout(() => setClearing(false), 3000);
      return () => clearTimeout(t);
    }
  }, [clearing]);

  return (
    <div
      className="fixed inset-x-0 z-40 lg:hidden"
      style={{ bottom: "calc(64px + env(safe-area-inset-bottom, 0px))", background: "#fff", borderTop: "1px solid #e5e7eb", boxShadow: "0 -8px 30px rgba(0,0,0,0.06)" }}
    >
      <div className="px-5 py-3 flex items-center justify-between gap-3">
        <div className="text-left">
          <div className="text-[11px] font-medium" style={{ color: "#6b7280" }}>To pay</div>
          <div className="font-display font-extrabold text-xl tracking-tight tabular-nums" style={{ color: "#111" }}>
            {fmt(grandTotal)}
          </div>
          <div className="text-[11px] mt-0.5" style={{ color: "#9ca3af" }}>
            {totalItems} {totalItems === 1 ? "item" : "items"}
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              if (clearing) {
                handleClear();
                setClearing(false);
              } else setClearing(true);
            }}
            className="shrink-0 w-12 h-12 flex items-center justify-center rounded-full border transition-colors"
            style={{
              borderColor: clearing ? "#ef4444" : "#e5e7eb",
              background: clearing ? "#ef4444" : "transparent",
              color: clearing ? "#fff" : "#9ca3af",
            }}
            aria-label="Clear cart"
          >
            <Svg d={ICON.trash} className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onCheckout}
            disabled={checkingOut}
            className="h-12 px-6 flex items-center justify-center gap-2.5 text-white font-semibold rounded-full transition-all active:scale-[0.97] disabled:opacity-80"
            style={{ background: "#ff6b00", boxShadow: "0 8px 24px rgba(255,107,0,0.25)" }}
          >
            {checkingOut ? (
              <span className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
            ) : (
              "Proceed"
            )}
            {!checkingOut && <Svg d={ICON.arrowRight} className="w-3.5 h-3.5" strokeWidth={2.5} />}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ---------- main cart ---------- */

const Cart = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((store) => store.cart.items || []);
  const [confirmingClear, setConfirmingClear] = useState(false);
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [toast, setToast] = useState("");
  const [checkingOut, setCheckingOut] = useState(false);
  const clearRef = useRef(null);
  const checkoutRef = useRef(null);

  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(cartItems));
    } catch (e) {}
  }, [cartItems]);

  useEffect(
    () => () => {
      if (clearRef.current) clearTimeout(clearRef.current);
      if (checkoutRef.current) clearTimeout(checkoutRef.current);
    },
    []
  );

  const { totalItems, subtotal, deliveryFee, tax, grandTotal } = useMemo(
    () => computeCartTotals(cartItems),
    [cartItems]
  );

  const hasGrocery = useMemo(
    () => cartItems.some((it) => it.info?.isGrocery),
    [cartItems]
  );

  // cart-aware upsell: grocery carts suggest groceries, restaurant carts suggest dishes
  const upsellItems = useMemo(() => {
    if (!hasGrocery) return SUGGESTED;
    return PRODUCTS.filter((p) => !cartItems.some((c) => c.info.id === p.id))
      .slice(0, 5)
      .map((p) => ({
        id: p.id,
        name: p.name,
        price: p.price,
        isVeg: true,
        isGrocery: true,
        imageId: p.image,
      }));
  }, [hasGrocery, cartItems]);

  const handleClear = useCallback(() => {
    if (confirmingClear) {
      dispatch(clearCart());
      setConfirmingClear(false);
      setToast("Cart cleared");
      if (clearRef.current) clearTimeout(clearRef.current);
    } else {
      setConfirmingClear(true);
      clearRef.current = setTimeout(() => setConfirmingClear(false), 3000);
    }
  }, [confirmingClear, dispatch]);

  const handleApplyPromo = useCallback(
    (code) => {
      if (!code) {
        setAppliedPromo(null);
        return;
      }
      const promos = {
        WELCOME50: { code: "WELCOME50", discount: Math.min(10000, Math.round(subtotal * 0.5)) },
        SAVE20: subtotal >= 29900 ? { code: "SAVE20", discount: Math.min(7500, Math.round(subtotal * 0.2)) } : null,
      };
      const result = promos[code];
      if (result) {
        setAppliedPromo(result);
        setToast(`${code} applied!`);
      }
    },
    [subtotal]
  );

  const handleCheckout = useCallback(() => {
    if (checkingOut) return;
    setCheckingOut(true);
    checkoutRef.current = setTimeout(() => {
      window.location.href = "/checkout";
    }, 700);
  }, [checkingOut]);

  const handleSuggestedAdd = useCallback(
    (s) => {
      dispatch(
        addItem({
          id: s.id,
          name: s.name,
          imageId: s.imageId,
          price: s.price,
          ratings: { aggregatedRating: s.rating },
          isVeg: s.isVeg,
        })
      );
    },
    [dispatch]
  );

  const bumpCounter = useRef(0);

  if (!cartItems.length) return <EmptyCart />;

  return (
    <div style={{ minHeight: "100vh", background: "#fafafa" }}>
      <div className="pt-6 pb-32 lg:pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-start justify-between mb-8">
            <div>
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-sm transition-colors mb-2 hover:text-[#ff6b00]"
                style={{ color: "#6b7280" }}
              >
                <Svg d={ICON.arrowLeft} className="w-3.5 h-3.5" strokeWidth={2.5} />
                Continue Shopping
              </Link>
              <h1 className="text-3xl sm:text-4xl font-bold mt-2 tracking-tight" style={{ color: "#111" }}>
                Shopping Cart
              </h1>
              <p className="text-sm mt-2" style={{ color: "#6b7280" }}>
                {totalItems} {totalItems === 1 ? "item" : "items"} &middot;{" "}
                <span className="font-semibold" style={{ color: "#ff6b00" }}>{fmt(subtotal)}</span>
              </p>
            </div>
            <button
              type="button"
              onClick={handleClear}
              className="text-sm font-medium px-4 py-2 rounded-full border transition-all shrink-0 active:scale-95"
              style={
                confirmingClear
                  ? { background: "#ef4444", color: "#fff", borderColor: "#ef4444", boxShadow: "0 4px 12px rgba(239,68,68,0.25)" }
                  : { color: "#6b7280", borderColor: "#e5e7eb" }
              }
            >
              {confirmingClear ? "Confirm clear?" : "Clear all"}
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 xl:gap-8">
            <div className="lg:col-span-8 space-y-3">
              <div
                className="rounded-3xl overflow-hidden"
                style={{ background: "#fff", border: "1px solid #f1f1f1", boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}
              >
                {cartItems.map((item, index) => (
                  <CartItem
                    key={item.info.id || item.info.name || index}
                    item={item}
                    index={index}
                    onToast={setToast}
                    onBump={() => bumpCounter.current++}
                  />
                ))}
              </div>

              <Link
                to={hasGrocery ? "/instafresh" : "/"}
                className="group flex items-center justify-center gap-3 w-full h-12 rounded-full border-2 border-dashed text-sm font-semibold transition-all hover:border-[#ff6b00] hover:text-[#ff6b00] hover:bg-orange-50/50 active:scale-[0.99]"
                style={{ borderColor: "#e5e7eb", color: "#6b7280" }}
              >
                <Svg d={ICON.plus} className="w-4 h-4 transition-transform group-hover:scale-110" strokeWidth={2.5} />
                {hasGrocery ? "Browse More Groceries" : "Browse More Dishes"}
              </Link>

              <FrequentlyOrdered items={upsellItems} onAdd={handleSuggestedAdd} onToast={setToast} />
            </div>

            <div className="hidden lg:block lg:col-span-4">
              <div className="lg:sticky lg:top-6">
                <OrderSummary
                  cartItems={cartItems}
                  subtotal={subtotal}
                  deliveryFee={deliveryFee}
                  tax={tax}
                  grandTotal={grandTotal}
                  totalItems={totalItems}
                  appliedPromo={appliedPromo}
                  onApplyPromo={handleApplyPromo}
                  onCheckout={handleCheckout}
                  checkingOut={checkingOut}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <MobileCheckoutBar
        totalItems={totalItems}
        grandTotal={grandTotal}
        handleClear={handleClear}
        onCheckout={handleCheckout}
        checkingOut={checkingOut}
      />
      <Toast toast={toast} onClose={() => setToast("")} />
    </div>
  );
};

export default Cart;