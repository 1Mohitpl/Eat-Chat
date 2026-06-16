import React, { useContext, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleCheck,
  faLocationDot,
  faMoneyBillWave,
  faMobileScreenButton,
} from "@fortawesome/free-solid-svg-icons";
import UserContext from "../../utils/UserContext";
import { clearCart } from "../../utils/cartslice";
import { computeCartTotals, formatCurrency } from "../../utils/cartTotals";

const PAYMENT_METHODS = [
  { id: "COD", label: "Cash on Delivery", icon: faMoneyBillWave },
  { id: "UPI", label: "UPI", icon: faMobileScreenButton },
];

const Checkout = () => {
  const { user } = useContext(UserContext);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector((store) => store.cart.items || []);

  const [step, setStep] = useState("form"); // "form" | "placing" | "success"
  const [order, setOrder] = useState(null);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    name: user?.name || "",
    phone: "",
    address: "",
    paymentMethod: "COD",
    upiId: "",
  });

  const totals = useMemo(() => computeCartTotals(cartItems), [cartItems]);

  const updateField = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const validate = () => {
    const nextErrors = {};
    if (!form.name.trim()) nextErrors.name = "Name is required";
    if (!/^\d{10}$/.test(form.phone.trim()))
      nextErrors.phone = "Enter a valid 10-digit phone number";
    if (form.address.trim().length < 10)
      nextErrors.address = "Enter a complete delivery address";
    if (form.paymentMethod === "UPI" && !/^[\w.\-]+@[\w]+$/.test(form.upiId.trim()))
      nextErrors.upiId = "Enter a valid UPI ID (e.g. name@bank)";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setStep("placing");
    const placedOrder = {
      id: `ORD${Date.now().toString().slice(-8)}`,
      total: totals.grandTotal,
      address: form.address.trim(),
      paymentMethod: form.paymentMethod,
    };

    // simulate order processing — no real payment/order backend exists yet
    setTimeout(() => {
      setOrder(placedOrder);
      dispatch(clearCart());
      setStep("success");
    }, 1200);
  };

  if (step === "success" && order) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-6 py-16">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-lime-100 flex items-center justify-center">
            <FontAwesomeIcon icon={faCircleCheck} className="text-4xl text-lime-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Order placed!</h2>
          <p className="text-slate-500 mt-2">
            Your order <span className="font-semibold text-slate-700">#{order.id}</span> has
            been confirmed and will arrive in 30-40 mins.
          </p>
          <div className="mt-6 bg-slate-50 rounded-3xl border border-slate-200 p-5 text-left text-sm space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-500">Delivering to</span>
              <span className="font-medium text-slate-900 text-right max-w-[60%]">{order.address}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Payment method</span>
              <span className="font-medium text-slate-900">
                {order.paymentMethod === "COD" ? "Cash on Delivery" : "UPI"}
              </span>
            </div>
            <div className="flex justify-between border-t border-slate-200 pt-2">
              <span className="font-semibold text-slate-900">Total Paid</span>
              <span className="font-bold text-slate-900">{formatCurrency(order.total)}</span>
            </div>
          </div>
          <Link
            to="/"
            className="inline-flex items-center gap-2 mt-6 px-6 py-3 rounded-3xl bg-lime-500 text-white font-semibold transition hover:bg-lime-600"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  if (!cartItems.length) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-6 py-16 text-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Nothing to check out</h2>
          <p className="text-slate-500 mt-2">Your cart is empty. Add some items first.</p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 mt-6 px-6 py-3 rounded-3xl bg-lime-500 text-white font-semibold transition hover:bg-lime-600"
          >
            Browse Restaurants
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="font-extrabold text-3xl text-slate-900 mb-6">Checkout</h1>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
            <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
              <FontAwesomeIcon icon={faLocationDot} className="text-lime-600" />
              Delivery Details
            </h3>

            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Full Name</label>
              <input
                type="text"
                value={form.name}
                onChange={updateField("name")}
                className="w-full rounded-2xl border border-slate-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-lime-500"
                placeholder="Your name"
              />
              {errors.name && <p className="text-red-600 text-xs mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Phone Number</label>
              <input
                type="tel"
                value={form.phone}
                onChange={updateField("phone")}
                className="w-full rounded-2xl border border-slate-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-lime-500"
                placeholder="10-digit mobile number"
              />
              {errors.phone && <p className="text-red-600 text-xs mt-1">{errors.phone}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Delivery Address</label>
              <textarea
                value={form.address}
                onChange={updateField("address")}
                rows={3}
                className="w-full rounded-2xl border border-slate-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-lime-500"
                placeholder="House no, street, area, city, pincode"
              />
              {errors.address && <p className="text-red-600 text-xs mt-1">{errors.address}</p>}
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
            <h3 className="font-bold text-lg text-slate-900">Payment Method</h3>
            <div className="grid grid-cols-2 gap-3">
              {PAYMENT_METHODS.map((method) => (
                <button
                  key={method.id}
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, paymentMethod: method.id }))}
                  className={`flex items-center gap-2 justify-center rounded-2xl border px-4 py-3 font-medium transition ${
                    form.paymentMethod === method.id
                      ? "border-lime-500 bg-lime-50 text-lime-700"
                      : "border-slate-300 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <FontAwesomeIcon icon={method.icon} />
                  {method.label}
                </button>
              ))}
            </div>

            {form.paymentMethod === "UPI" && (
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">UPI ID</label>
                <input
                  type="text"
                  value={form.upiId}
                  onChange={updateField("upiId")}
                  className="w-full rounded-2xl border border-slate-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-lime-500"
                  placeholder="name@bank"
                />
                {errors.upiId && <p className="text-red-600 text-xs mt-1">{errors.upiId}</p>}
              </div>
            )}
          </div>
        </div>

        <aside className="lg:sticky lg:top-6 bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
          <div className="bg-slate-900 text-white px-6 py-5">
            <h3 className="font-bold text-lg">Order Summary</h3>
          </div>
          <div className="p-6 space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">Subtotal ({totals.totalItems} items)</span>
              <span className="font-medium text-slate-900">{formatCurrency(totals.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Delivery Fee</span>
              <span className={`font-medium ${totals.deliveryFee === 0 ? "text-lime-600" : "text-slate-900"}`}>
                {totals.deliveryFee === 0 ? "FREE" : formatCurrency(totals.deliveryFee)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Taxes & Charges</span>
              <span className="font-medium text-slate-900">{formatCurrency(totals.tax)}</span>
            </div>
            <div className="border-t border-slate-200 pt-3 flex justify-between items-baseline">
              <span className="font-semibold text-slate-900">To Pay</span>
              <span className="font-extrabold text-2xl text-slate-900">
                {formatCurrency(totals.grandTotal)}
              </span>
            </div>
          </div>
          <div className="p-6 pt-0 space-y-3">
            <button
              type="submit"
              disabled={step === "placing"}
              className="w-full bg-lime-500 text-white font-semibold py-3 rounded-3xl transition hover:bg-lime-600 disabled:opacity-60"
            >
              {step === "placing" ? "Placing order..." : "Place Order"}
            </button>
            <Link
              to="/cart"
              className="block w-full text-center border border-slate-300 py-3 rounded-3xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition"
            >
              Back to Cart
            </Link>
          </div>
        </aside>
      </form>
    </div>
  );
};

export default Checkout;
