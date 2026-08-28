import { useContext, useEffect, useReducer } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import UserContext from "../../utils/UserContext";
import { setCart } from "../../utils/cartslice";
import { getOrderStage, isDelivered, setOrders } from "../../utils/orderslice";
import { formatCurrency } from "../../utils/cartTotals";
import { fetchOrders } from "../../utils/auth";

const ACCENT = "#ff6b00";

const summarizeItems = (items = []) => {
  const first = items[0];
  if (!first) return "No items";
  const extra = items.length - 1;
  const qty = first.quantity > 1 ? ` ×${first.quantity}` : "";
  return extra > 0 ? `${first.info.name}${qty} + ${extra} more` : `${first.info.name}${qty}`;
};

const OrderCard = ({ order }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { key, label } = getOrderStage(order);
  const delivered = key === "delivered";

  const handleReorder = () => {
    dispatch(setCart(order.items));
    navigate("/cart");
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-slate-900">#{order.id}</span>
            <span
              className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full ${
                delivered ? "bg-emerald-50 text-emerald-700" : "bg-orange-50 text-[#c2410c]"
              }`}
            >
              {!delivered && (
                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: ACCENT }} />
              )}
              {label}
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1 truncate">
            {summarizeItems(order.items)} ·{" "}
            {new Date(order.placedAt).toLocaleString("en-IN", {
              day: "numeric",
              month: "short",
              hour: "numeric",
              minute: "2-digit",
            })}
          </p>
        </div>
        <div className="flex items-center gap-4 shrink-0">
          <span className="font-display font-extrabold text-lg text-slate-900 tabular-nums">
            {formatCurrency(order.totals?.grandTotal)}
          </span>
          <div className="flex items-center gap-2">
            <Link
              to={`/order/${order.id}`}
              className="px-4 py-2 rounded-full border border-slate-300 text-sm font-semibold text-slate-600 hover:bg-slate-100 transition"
            >
              Track
            </Link>
            <button
              type="button"
              onClick={handleReorder}
              disabled={!delivered}
              title={delivered ? "Add these items back to your cart" : "Available after delivery"}
              className="px-4 py-2 rounded-full text-white text-sm font-semibold transition hover:brightness-110 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: delivered ? ACCENT : "#94a3b8" }}
            >
              Reorder
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const AccountPage = () => {
  const { user, loggedIn, logout } = useContext(UserContext);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const orders = useSelector((s) => s.orders?.orders || []);

  // My Orders comes from the database, scoped to the logged-in user —
  // the server only ever returns req.user's rows
  useEffect(() => {
    if (!loggedIn) return undefined;
    let cancelled = false;
    fetchOrders()
      .then((orders) => {
        if (!cancelled) dispatch(setOrders(orders));
      })
      .catch(() => {
        /* offline — keep showing the local cache */
      });
    return () => {
      cancelled = true;
    };
  }, [loggedIn, dispatch]);

  // re-render periodically so live order badges stay current without a timer per card
  const [, forceTick] = useReducer((x) => x + 1, 0);
  const hasActiveOrders = orders.some((o) => !isDelivered(o));
  useEffect(() => {
    if (!hasActiveOrders) return undefined;
    const t = setInterval(forceTick, 5000);
    return () => clearInterval(t);
  }, [hasActiveOrders]);

  const handleLogout = () => {
    logout();
    navigate("/account");
  };

  if (!loggedIn) {
    return (
      <div className="account-page p-11 m-14">
        <h2 className="font-bold text-2xl text-lime-800">You are logged out</h2>
        <p className="mt-4">Please log in to access your account.</p>
        <Link to="/login">
          <button className="btn mt-4">LogIn</button>
        </Link>
      </div>
    );
  }

  return (
    <div className="account-page p-6 sm:p-11 max-w-4xl mx-auto">
      <h2 className="font-bold text-2xl text-lime-800">My Account</h2>
      <div className="mt-6 bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
        <p className="font-bold text-xl">{user.name}</p>
        <p className="mt-2 text-slate-600">{user.email}</p>
        <button className="btn mt-6" onClick={handleLogout}>
          Signout
        </button>
      </div>

      <h3 className="font-display font-extrabold text-xl tracking-tight mt-10 mb-4">My Orders</h3>
      {orders.length === 0 ? (
        <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-10 text-center">
          <p className="text-slate-500">
            No orders yet.{" "}
            <Link to="/" className="font-semibold hover:brightness-110" style={{ color: ACCENT }}>
              Browse restaurants
            </Link>{" "}
            to place your first order.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((o) => (
            <OrderCard key={o.id} order={o} />
          ))}
        </div>
      )}
    </div>
  );
};

export default AccountPage;
