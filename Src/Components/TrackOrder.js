import { useEffect, useReducer } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { setCart } from "../../utils/cartslice";
import { getOrderStage, ORDER_STAGES, isDelivered, placeOrder } from "../../utils/orderslice";
import { formatCurrency } from "../../utils/cartTotals";
import { fetchOrder } from "../../utils/auth";

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
  arrowLeft: "M19 12H5m7-7-7 7 7 7",
  check: "M20 6 9 17l-5-5",
  receipt:
    "M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1-2-1ZM8 7h8M8 11h8M8 15h5",
  utensils:
    "M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2M7 2v20M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3v7",
  truck:
    "M1 3h15v13H1M16 8h4l3 3v5h-7V8Z M5.5 18.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM18.5 18.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z",
  home: "m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z M9 22V12h6v10",
  phone:
    "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z",
  pin: "M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0ZM12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z",
  refresh: "M3 12a9 9 0 0 1 15.36-6.36L21 8M21 3v5h-5M21 12a9 9 0 0 1-15.36 6.36L3 16m0 5v-5h5",
};

const STAGE_ICONS = {
  placed: ICON.receipt,
  confirmed: ICON.check,
  preparing: ICON.utensils,
  on_the_way: ICON.truck,
  delivered: ICON.home,
};

const fmtCountdown = (sec) => {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return m > 0 ? `${m}m ${s.toString().padStart(2, "0")}s` : `${s}s`;
};

const TimelineRow = ({ stage, index, currentIndex, orderDone }) => {
  const done = index < currentIndex;
  const active = index === currentIndex;
  const isLast = index === ORDER_STAGES.length - 1;

  return (
    <li className="relative flex gap-4 pb-8 last:pb-0">
      {!isLast && (
        <span
          className={`absolute left-[17px] top-10 bottom-0 w-0.5 transition-colors duration-500 ${
            done || active ? "bg-brand" : "bg-slate-200"
          }`}
        />
      )}
      <span
        className={`relative z-10 grid h-9 w-9 shrink-0 place-items-center rounded-full border-2 transition-all duration-300 ${
          done && "border-brand bg-brand text-white"
        } ${
          active &&
          "border-brand bg-white text-brand shadow-lg shadow-brand/25 scale-110"
        } ${!done && !active && "border-slate-200 bg-white text-slate-300"}`}
      >
        {done ? (
          <Svg d={ICON.check} className="h-4 w-4" strokeWidth={3} />
        ) : (
          <Svg d={STAGE_ICONS[stage.key]} className="h-4 w-4" strokeWidth={2} />
        )}
        {active && (
          <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-brand/30" />
        )}
      </span>
      <div className="pt-1">
        <p
          className={`text-sm font-bold leading-snug ${
            done || active ? "text-slate-900" : "text-slate-400"
          }`}
        >
          {stage.label}
        </p>
        <p className={`mt-0.5 text-xs ${active ? "text-brand font-semibold" : "text-slate-400"}`}>
          {done || (active && orderDone) ? "Completed" : active ? "In progress…" : "Pending"}
        </p>
      </div>
    </li>
  );
};

const TrackOrder = () => {
  const { orderId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const order = useSelector((s) =>
    (s.orders?.orders || []).find((o) => o.id === orderId)
  );

  // not in the local cache — pull it from the database (scoped to the
  // logged-in user; other users' orders come back 404 here)
  useEffect(() => {
    if (order || !orderId) return undefined;
    let cancelled = false;
    fetchOrder(orderId)
      .then((fetched) => {
        if (!cancelled && fetched) dispatch(placeOrder(fetched));
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [order, orderId, dispatch]);

  // tick once per second so the derived stage advances live; stops at delivered
  const [, forceTick] = useReducer((x) => x + 1, 0);
  const done = order ? isDelivered(order) : false;
  useEffect(() => {
    if (!order || done) return undefined;
    const t = setInterval(forceTick, 1000);
    return () => clearInterval(t);
  }, [order, done]);

  if (!order) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-6 py-16 text-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Order not found</h2>
          <p className="text-slate-500 mt-2">
            We couldn&apos;t find order #{orderId}. It may have been placed on another device.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 mt-6 px-6 py-3 rounded-3xl text-white font-semibold transition hover:brightness-110"
            style={{ background: ACCENT }}
          >
            Browse Restaurants
          </Link>
        </div>
      </div>
    );
  }

  const { key: stageKey, label, index: current, elapsedSec } = getOrderStage(order);
  const totalSec = ORDER_STAGES[ORDER_STAGES.length - 1].afterSec;
  const progress = Math.min(100, (elapsedSec / totalSec) * 100);
  const remainingSec = Math.max(0, totalSec - elapsedSec);

  const handleReorder = () => {
    dispatch(setCart(order.items));
    navigate("/cart");
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <Link
        to="/account"
        className="inline-flex items-center gap-2 text-sm text-slate-500 transition-colors hover:text-[#ff6b00]"
      >
        <Svg d={ICON.arrowLeft} className="w-3.5 h-3.5" strokeWidth={2.5} />
        My Orders
      </Link>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display font-extrabold text-3xl tracking-tight text-slate-900">
            {done ? "Order delivered 🎉" : "Track your order"}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Order <span className="font-semibold text-slate-700">#{order.id}</span> ·{" "}
            {new Date(order.placedAt).toLocaleString("en-IN", {
              day: "numeric",
              month: "short",
              hour: "numeric",
              minute: "2-digit",
            })}
          </p>
        </div>
        {!done && (
          <div className="text-right">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Arriving in
            </p>
            <p className="font-display font-extrabold text-2xl tabular-nums" style={{ color: ACCENT }}>
              {fmtCountdown(remainingSec)}
            </p>
          </div>
        )}
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* live status card */}
        <div
          className="lg:col-span-7 rounded-3xl overflow-hidden"
          style={{ background: "#fff", border: "1px solid #f1f1f1", boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}
        >
          <div
            className="px-6 py-5 flex items-center justify-between gap-3"
            style={{ background: "linear-gradient(135deg,#fff7ed,#fffbeb)" }}
          >
            <div className="flex items-center gap-3 min-w-0">
              <span className="w-10 h-10 rounded-xl grid place-items-center shrink-0 bg-white shadow-sm">
                <Svg d={STAGE_ICONS[stageKey]} className="w-5 h-5" />
              </span>
              <div className="min-w-0">
                <p className="font-display font-bold text-slate-900 truncate">{label}</p>
                <p className="text-xs text-slate-500">
                  {done ? "Hope you enjoyed your meal!" : `Step ${current + 1} of ${ORDER_STAGES.length}`}
                </p>
              </div>
            </div>
            {!done && (
              <span className="shrink-0 inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full bg-white/80" style={{ color: ACCENT }}>
                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: ACCENT }} />
                Live
              </span>
            )}
          </div>

          <div className="px-6 pt-5">
            <div className="h-2 rounded-full overflow-hidden" style={{ background: "#f1f5f9" }}>
              <div
                className="h-full rounded-full transition-all duration-1000 ease-linear"
                style={{ width: `${progress}%`, background: `linear-gradient(90deg, ${ACCENT}, #fb923c)` }}
              />
            </div>
          </div>

          <ol className="px-6 py-6">
            {ORDER_STAGES.map((stage, i) => (
              <TimelineRow key={stage.key} stage={stage} index={i} currentIndex={current} orderDone={done} />
            ))}
          </ol>

          {label === "Out for delivery" && (
            <div className="mx-6 mb-6 flex items-center justify-between gap-4 rounded-2xl p-4" style={{ background: "#f8fafc", border: "1px solid #e2e8f0" }}>
              <div className="flex items-center gap-3 min-w-0">
                <span
                  className="w-11 h-11 rounded-full grid place-items-center text-white font-bold shrink-0"
                  style={{ background: ACCENT }}
                >
                  RK
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-slate-900 truncate">Ramesh K.</p>
                  <p className="text-xs text-slate-500">Your delivery partner · ★ 4.9</p>
                </div>
              </div>
              <a
                href="tel:+919000000000"
                aria-label="Call delivery partner"
                className="shrink-0 w-11 h-11 grid place-items-center rounded-full text-white transition-all active:scale-90 hover:brightness-110"
                style={{ background: ACCENT }}
              >
                <Svg d={ICON.phone} className="w-4 h-4" />
              </a>
            </div>
          )}
        </div>

        {/* order details */}
        <aside className="lg:col-span-5 space-y-5">
          <div
            className="rounded-3xl overflow-hidden"
            style={{ background: "#fff", border: "1px solid #f1f1f1", boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}
          >
            <div className="px-6 py-4 flex items-center gap-3" style={{ borderBottom: "1px solid #f1f1f1" }}>
              <Svg d={ICON.receipt} className="w-4 h-4" />
              <h3 className="font-display font-bold text-slate-900">Order details</h3>
            </div>
            <div className="px-6 py-4 space-y-2">
              {(order.items || []).map((it, idx) => (
                <div key={it.info.id || it.info.name || idx} className="flex items-center justify-between gap-3 text-sm">
                  <span className="min-w-0 flex-1 truncate text-slate-600">
                    <span className="font-semibold text-slate-400 mr-1.5">{it.quantity}×</span>
                    {it.info.name}
                  </span>
                  <span className="font-semibold text-slate-700 tabular-nums shrink-0">
                    {formatCurrency((Number(it.info.price) || 0) * (it.quantity || 1))}
                  </span>
                </div>
              ))}
              <div className="pt-3 space-y-1.5" style={{ borderTop: "1px solid #f1f1f1" }}>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Item total</span>
                  <span className="font-medium text-slate-900 tabular-nums">
                    {formatCurrency(order.totals?.subtotal)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Delivery fee</span>
                  <span className={`font-medium tabular-nums ${!order.totals?.deliveryFee ? "text-emerald-600" : "text-slate-900"}`}>
                    {order.totals?.deliveryFee ? formatCurrency(order.totals.deliveryFee) : "FREE"}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Tax & charges</span>
                  <span className="font-medium text-slate-900 tabular-nums">
                    {formatCurrency(order.totals?.tax)}
                  </span>
                </div>
                <div className="flex justify-between items-baseline pt-2" style={{ borderTop: "1px solid #f1f1f1" }}>
                  <span className="font-bold text-slate-900">Total paid</span>
                  <span className="font-display font-extrabold text-xl text-slate-900 tabular-nums">
                    {formatCurrency(order.totals?.grandTotal)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div
            className="rounded-3xl p-6 space-y-3 text-sm"
            style={{ background: "#fff", border: "1px solid #f1f1f1", boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}
          >
            <div className="flex items-start gap-2.5">
              <Svg d={ICON.pin} className="w-4 h-4 mt-0.5" />
              <span className="text-slate-600">{order.address}</span>
            </div>
            <div className="flex items-center gap-2.5 text-slate-600">
              <Svg d={ICON.phone} className="w-4 h-4" />
              {order.phone}
            </div>
            <p className="text-slate-500">
              Paid via{" "}
              <span className="font-semibold text-slate-800">
                {order.paymentMethod === "COD" ? "Cash on Delivery" : "UPI"}
              </span>
            </p>
          </div>

          <button
            type="button"
            onClick={handleReorder}
            disabled={!done}
            title={done ? "Add these items back to your cart" : "Available after delivery"}
            className="group flex items-center justify-center gap-3 w-full rounded-full py-4 text-white font-bold text-sm transition-all duration-200 active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ background: done ? ACCENT : "#94a3b8", boxShadow: done ? "0 8px 24px rgba(255,107,0,0.25)" : "none" }}
          >
            <Svg d={ICON.refresh} className="w-4 h-4 transition-transform group-hover:rotate-180" />
            Reorder these items
          </button>
        </aside>
      </div>
    </div>
  );
};

export default TrackOrder;
