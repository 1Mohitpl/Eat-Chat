import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addItem, incrementQuantity, decrementQuantity } from "../../utils/cartslice";
import { computeCartTotals, formatCurrency, FREE_DELIVERY_THRESHOLD } from "../../utils/cartTotals";
import { CATEGORIES, PRODUCTS } from "../mocks/groceries";

const ACCENT = "#ff6b00";

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
  bolt: "M13 2 3 14h9l-1 8 10-12h-9l1-8Z",
  search: "M21 21l-4.35-4.35M17 11a6 6 0 1 1-12 0 6 6 0 0 1 12 0Z",
  minus: "M5 12h14",
  plus: "M12 5v14M5 12h14",
  truck: "M1 3h15v13H1M16 8h4l3 3v5h-7V8Z M5.5 18.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM18.5 18.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z",
  tag: "M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82zM7 7h.01",
  check: "M20 6 9 17l-5-5",
};

// prices in paise, same convention as the restaurant catalog

/* ---------- shimmer skeleton (mirrors ProductCard shape) ---------- */

const SkeletonCard = () => (
  <div
    className="bg-white rounded-2xl overflow-hidden"
    style={{ border: "1px solid #f1f1f1", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}
    aria-hidden
  >
    <div className="h-[120px] shimmer-block" />
    <div className="p-3 flex flex-col gap-2 min-h-[118px]">
      <div className="shimmer-block h-3 w-11/12 rounded-md" />
      <div className="shimmer-block h-3 w-1/2 rounded-md" />
      <div className="mt-auto pt-1 flex items-end justify-between gap-2">
        <div className="flex-1 space-y-1.5">
          <div className="shimmer-block h-3.5 w-14 rounded-md" />
          <div className="shimmer-block h-2.5 w-20 rounded-md" />
        </div>
        <div className="shimmer-block h-7 w-16 rounded-lg" />
      </div>
    </div>
  </div>
);

/* ---------- product visual (image with graceful fallback) ---------- */

const ProductImage = ({ src, alt }) => {
  const [failed, setFailed] = useState(false);
  return (
    <div className="relative h-[120px] grid place-items-center bg-[#f6f7f9]">
      {!failed ? (
        <img
          src={src}
          alt={alt}
          referrerpolicy="no-referrer"
          onError={() => setFailed(true)}
          className="max-h-[96px] max-w-[80%] object-contain transition-transform duration-300 group-hover:scale-105"
        />
      ) : (
        <span
          className="grid h-14 w-14 place-items-center rounded-full text-white font-display font-extrabold text-xl"
          style={{ background: ACCENT }}
        >
          {alt.charAt(0)}
        </span>
      )}
      <span className="absolute top-2 left-2 inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-emerald-50 text-[10px] font-bold text-emerald-700">
        <Svg d={ICON.bolt} className="w-2.5 h-2.5" strokeWidth={2.5} />
        10 min
      </span>
    </div>
  );
};

/* ---------- qty stepper / add button ---------- */

const AddControl = ({ product, qty, onToast }) => {
  const dispatch = useDispatch();
  if (!qty) {
    return (
      <button
        type="button"
        onClick={() => {
          dispatch(addItem({ ...product, imageId: product.image, isGrocery: true }));
          onToast(`${product.name} added to cart`);
        }}
        className="px-4 py-1.5 rounded-lg text-white text-xs font-bold tracking-wide transition-all active:scale-95 hover:brightness-110"
        style={{ background: "#16a34a", boxShadow: "0 4px 12px rgba(22,163,74,0.25)" }}
      >
        ADD
      </button>
    );
  }
  return (
    <div
      className="inline-flex items-center rounded-lg text-white overflow-hidden"
      style={{ background: "#16a34a" }}
    >
      <button
        onClick={() => dispatch(decrementQuantity(product.id))}
        className="w-7 h-7 grid place-items-center hover:bg-black/10 active:scale-90 transition-all"
        aria-label={`Remove one ${product.name}`}
      >
        <Svg d={ICON.minus} className="w-3 h-3" strokeWidth={2.5} />
      </button>
      <span key={qty} className="min-w-[24px] text-center text-[13px] font-bold tabular-nums select-none">
        {qty}
      </span>
      <button
        onClick={() => dispatch(incrementQuantity(product.id))}
        className="w-7 h-7 grid place-items-center hover:bg-black/10 active:scale-90 transition-all"
        aria-label={`Add one ${product.name}`}
      >
        <Svg d={ICON.plus} className="w-3 h-3" strokeWidth={2.5} />
      </button>
    </div>
  );
};

/* ---------- product card ---------- */

const ProductCard = ({ product, onToast }) => {
  const qty = useSelector(
    (s) => s.cart.items.find((i) => i.info.id === product.id)?.quantity || 0
  );
  const off = Math.round((1 - product.price / product.mrp) * 100);

  return (
    <div
      className={`group bg-white rounded-2xl overflow-hidden transition-all duration-300 ${
        qty ? "ring-2 ring-emerald-500" : ""
      }`}
      style={{ border: "1px solid #f1f1f1", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}
    >
      <ProductImage src={product.image} alt={product.name} />
      <div className="p-3 flex flex-col gap-1 min-h-[118px]">
        <h3 className="text-[13px] font-bold leading-snug text-slate-900 line-clamp-2">
          {product.name}
        </h3>
        <p className="text-[11px] text-slate-400">{product.unit}</p>
        <div className="mt-auto pt-1 flex items-end justify-between gap-2">
          <div>
            <p className="text-sm font-extrabold text-slate-900 tabular-nums">
              {formatCurrency(product.price)}
            </p>
            <p className="flex items-center gap-1.5 text-[11px] tabular-nums">
              <span className="line-through text-slate-400">{formatCurrency(product.mrp)}</span>
              <span className="font-bold text-emerald-600">{off}% OFF</span>
            </p>
          </div>
          <AddControl product={product} qty={qty} onToast={onToast} />
        </div>
      </div>
    </div>
  );
};

/* ---------- toast ---------- */

const Toast = ({ toast, onClose }) => {
  useEffect(() => {
    if (!toast) return undefined;
    const t = setTimeout(onClose, 2200);
    return () => clearTimeout(t);
  }, [toast, onClose]);
  if (!toast) return null;
  return (
    <div
      className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[60] flex items-center gap-3 pl-4 pr-5 py-3 rounded-2xl text-white text-sm font-semibold shadow-2xl"
      style={{ background: "#0f172a" }}
    >
      <span className="grid w-7 h-7 place-items-center rounded-full bg-emerald-500">
        <Svg d={ICON.check} className="w-3.5 h-3.5" strokeWidth={3} />
      </span>
      {toast}
    </div>
  );
};

/* ---------- free delivery meter ---------- */

const FreeDeliveryMeter = ({ subtotal }) => {
  const remaining = FREE_DELIVERY_THRESHOLD - subtotal;
  const progress = Math.min(100, (subtotal / FREE_DELIVERY_THRESHOLD) * 100);
  return (
    <div
      className="rounded-2xl px-4 py-3 flex items-center gap-3"
      style={{ background: "linear-gradient(135deg,#fff7ed,#fffbeb)", border: "1px solid rgba(255,237,213,0.5)" }}
    >
      <Svg d={ICON.truck} className="w-4 h-4 shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-orange-900 truncate">
          {remaining > 0 ? (
            <>Add <b>{formatCurrency(remaining)}</b> more for FREE delivery</>
          ) : (
            "Free delivery unlocked!"
          )}
        </p>
        <div className="mt-1.5 h-1.5 rounded-full overflow-hidden bg-orange-200/50">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${progress}%`, background: `linear-gradient(90deg,${ACCENT},#fb923c)` }}
          />
        </div>
      </div>
    </div>
  );
};

/* ---------- page ---------- */

const InstaFresh = () => {
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");
  const [toast, setToast] = useState("");
  // ponytail: catalog is static mocks — fake fetch latency on mount/category
  // switch so the shimmer skeleton shows; drop when a real API drives this
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(t);
  }, [category]);
  const cartItems = useSelector((s) => s.cart.items || []);
  const { subtotal } = computeCartTotals(cartItems);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return PRODUCTS.filter(
      (p) =>
        (category === "All" || p.category === category) &&
        (!q || p.name.toLowerCase().includes(q))
    );
  }, [category, query]);

  return (
    <div style={{ background: "#fafafa", minHeight: "100vh" }}>
      {/* hero */}
      <div style={{ background: `linear-gradient(135deg, ${ACCENT}, #f97316)` }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div>
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-white text-xs font-bold backdrop-blur-sm">
                <Svg d={ICON.bolt} className="w-3.5 h-3.5" strokeWidth={2.5} />
                BeYuumi quick commerce
              </span>
              <h1 className="font-display font-extrabold text-3xl sm:text-5xl tracking-tight text-white mt-3">
                Insta<span className="text-slate-900">Fresh</span>
              </h1>
              <p className="text-white/85 mt-2 text-sm sm:text-base font-medium">
                Groceries at your doorstep in{" "}
                <span className="font-bold text-white">10 minutes</span> — daily essentials,
                farm-fresh produce and midnight cravings.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {["No minimum order", "Lowest prices", "100% fresh"].map((chip) => (
                  <span
                    key={chip}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-sm text-white text-xs font-semibold"
                  >
                    <Svg d={ICON.check} className="w-3 h-3" strokeWidth={3} />
                    {chip}
                  </span>
                ))}
              </div>
            </div>

            <div className="w-full lg:w-[340px]">
              <div className="relative">
                <span className="absolute inset-y-0 left-4 grid place-items-center pointer-events-none text-slate-400">
                  <Svg d={ICON.search} className="w-4 h-4" />
                </span>
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder='Search "milk", "chips", "rice"…'
                  aria-label="Search groceries"
                  className="w-full h-12 pl-11 pr-4 rounded-2xl bg-white text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-4 focus:ring-white/30 shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* sticky category rail */}
      <div className="sticky top-0 z-30 bg-[#fafafa]/95 backdrop-blur border-b border-slate-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-2 overflow-x-auto scrollbar-none">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              className={`shrink-0 px-4 py-2 rounded-full text-[13px] font-bold whitespace-nowrap transition-all active:scale-95 ${
                category === c
                  ? "text-white shadow-md"
                  : "bg-white text-slate-600 border border-slate-200 hover:border-brand hover:text-brand"
              }`}
              style={category === c ? { background: ACCENT } : null}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* products */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-32 lg:pb-12">
        {subtotal > 0 && (
          <div className="mb-6">
            <FreeDeliveryMeter subtotal={subtotal} />
          </div>
        )}

        <div className="flex items-baseline justify-between mb-4">
          <h2 className="font-display font-extrabold text-xl tracking-tight text-slate-900">
            {category === "All" ? "All products" : category}
          </h2>
          <span className="text-xs text-slate-400">
            {loading ? "Loading…" : `${visible.length} item${visible.length === 1 ? "" : "s"}`}
          </span>
        </div>

        {loading ? (
          <div
            data-testid="shimmer"
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
          >
            {Array.from({ length: 10 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : visible.length === 0 ? (
          <div className="py-20 text-center">
            <p className="font-display font-bold text-lg text-slate-900">Nothing found</p>
            <p className="text-sm text-slate-500 mt-1.5">
              Try a different keyword or browse another category.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {visible.map((p) => (
              <ProductCard key={p.id} product={p} onToast={setToast} />
            ))}
          </div>
        )}
      </div>

      <Toast toast={toast} onClose={() => setToast("")} />
    </div>
  );
};

export default InstaFresh;
