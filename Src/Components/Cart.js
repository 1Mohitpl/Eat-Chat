import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMinus,
  faPlus,
  faTrashCan,
  faCartShopping,
  faBagShopping,
  faTag,
} from "@fortawesome/free-solid-svg-icons";
import { img_cdn_url } from "../config";
import {
  clearCart,
  incrementQuantity,
  decrementQuantity,
  removeItem,
} from "../../utils/cartslice";
import { computeCartTotals, formatCurrency, FREE_DELIVERY_THRESHOLD } from "../../utils/cartTotals";

const Cart = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((store) => store.cart.items || []);
  const [confirmingClear, setConfirmingClear] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(cartItems));
    } catch (e) {}
  }, [cartItems]);

  const { totalItems, subtotal, deliveryFee, tax, grandTotal } = useMemo(
    () => computeCartTotals(cartItems),
    [cartItems]
  );

  const handleClearCart = () => {
    if (confirmingClear) {
      dispatch(clearCart());
      setConfirmingClear(false);
    } else {
      setConfirmingClear(true);
    }
  };

  if (!cartItems.length) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-6 py-16">
        <div className="text-center max-w-sm">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-slate-100 flex items-center justify-center">
            <FontAwesomeIcon icon={faCartShopping} className="text-4xl text-slate-400" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Your cart is empty</h2>
          <p className="text-slate-500 mt-2">
            Looks like you haven't added anything yet. Explore restaurants and find something tasty.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 mt-6 px-6 py-3 rounded-3xl bg-lime-500 text-white font-semibold transition hover:bg-lime-600"
          >
            <FontAwesomeIcon icon={faBagShopping} />
            Browse Restaurants
          </Link>
        </div>
      </div>
    );
  }

  const freeDeliveryProgress = Math.min(100, (subtotal / FREE_DELIVERY_THRESHOLD) * 100);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
        <div>
          <h1 className="font-extrabold text-3xl text-slate-900">Your Cart</h1>
          <p className="text-slate-500 text-sm mt-1">
            <span className="inline-flex items-center justify-center min-w-5 h-5 px-1.5 mr-1.5 rounded-full bg-lime-100 text-lime-700 text-xs font-bold">
              {totalItems}
            </span>
            {totalItems === 1 ? "item" : "items"} in your cart
          </p>
        </div>
        <button
          type="button"
          onClick={handleClearCart}
          onBlur={() => setConfirmingClear(false)}
          className={`text-sm font-semibold px-4 py-2 rounded-2xl border transition ${
            confirmingClear
              ? "bg-red-600 text-white border-red-600"
              : "border-slate-300 text-slate-600 hover:bg-slate-100"
          }`}
        >
          {confirmingClear ? "Click again to confirm" : "Clear Cart"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 min-w-0 space-y-4">
          {cartItems.map((item) => {
            const { info = {}, quantity = 1 } = item || {};
            const itemKey = info.id || info.name;
            const imageUrl = info.imageId
              ? `${img_cdn_url}fl_lossy,f_auto,q_auto,w_660/${info.imageId}`
              : "https://via.placeholder.com/150";
            const lineTotal = (Number(info.price) || 0) * quantity;

            return (
              <div
                key={itemKey}
                className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 sm:p-5 bg-white rounded-3xl border border-slate-200 shadow-sm transition hover:shadow-md hover:border-slate-300"
              >
                <div className="flex items-center gap-4 min-w-0 flex-1">
                  <img
                    src={imageUrl}
                    alt={info.name}
                    className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-2xl flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <h3 className="font-semibold text-lg text-slate-900 truncate">{info.name}</h3>
                    <div className="text-sm text-slate-500 mt-1 flex items-center gap-1">
                      <span className="text-amber-500">⭐</span>
                      {info.ratings?.aggregatedRating?.rating || "N/A"}
                    </div>
                    <div className="mt-2 font-medium text-slate-700">
                      {formatCurrency(info.price)} <span className="text-slate-400 font-normal">each</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:flex-col sm:items-end gap-3 sm:gap-3 pl-0 sm:pl-2 border-t sm:border-t-0 border-slate-100 pt-3 sm:pt-0">
                  <div className="flex items-center rounded-full border border-slate-200 bg-slate-50 flex-shrink-0">
                    <button
                      type="button"
                      aria-label={`Decrease quantity of ${info.name}`}
                      className="w-9 h-9 flex items-center justify-center rounded-full text-slate-600 hover:bg-slate-200 active:scale-95 transition"
                      onClick={() => dispatch(decrementQuantity(itemKey))}
                    >
                      <FontAwesomeIcon icon={faMinus} size="xs" />
                    </button>
                    <div className="w-8 text-center font-semibold text-slate-900">{quantity}</div>
                    <button
                      type="button"
                      aria-label={`Increase quantity of ${info.name}`}
                      className="w-9 h-9 flex items-center justify-center rounded-full text-slate-600 hover:bg-slate-200 active:scale-95 transition"
                      onClick={() => dispatch(incrementQuantity(itemKey))}
                    >
                      <FontAwesomeIcon icon={faPlus} size="xs" />
                    </button>
                  </div>

                  <div className="flex items-center gap-4 sm:flex-col sm:items-end sm:gap-2">
                    <div className="font-bold text-slate-900 whitespace-nowrap">{formatCurrency(lineTotal)}</div>
                    <button
                      type="button"
                      aria-label={`Remove ${info.name} from cart`}
                      className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-red-600 transition"
                      onClick={() => dispatch(removeItem(itemKey))}
                    >
                      <FontAwesomeIcon icon={faTrashCan} />
                      <span className="hidden sm:inline">Remove</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          <Link
            to="/"
            className="inline-flex items-center gap-2 mt-2 text-sm font-semibold text-lime-600 hover:text-lime-700"
          >
            + Add more items
          </Link>
        </div>

        <aside className="lg:sticky lg:top-6 min-w-0 bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
          <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-white px-6 py-5">
            <h3 className="font-bold text-lg">Order Summary</h3>
          </div>

          <div className="p-6 space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">Subtotal ({totalItems} items)</span>
              <span className="font-medium text-slate-900">{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Delivery Fee</span>
              <span className={`font-medium ${deliveryFee === 0 ? "text-lime-600" : "text-slate-900"}`}>
                {deliveryFee === 0 ? "FREE" : formatCurrency(deliveryFee)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Taxes & Charges</span>
              <span className="font-medium text-slate-900">{formatCurrency(tax)}</span>
            </div>

            {deliveryFee > 0 && (
              <div className="space-y-1.5 pt-1">
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-lime-500 rounded-full transition-all"
                    style={{ width: `${freeDeliveryProgress}%` }}
                  />
                </div>
                <div className="flex items-start gap-1.5 text-lime-700 text-xs">
                  <FontAwesomeIcon icon={faTag} className="mt-0.5" />
                  <span>
                    Add {formatCurrency(FREE_DELIVERY_THRESHOLD - subtotal)} more for free delivery!
                  </span>
                </div>
              </div>
            )}

            <div className="border-t border-slate-200 pt-3 flex justify-between items-baseline">
              <span className="font-semibold text-slate-900">To Pay</span>
              <span className="font-extrabold text-2xl text-slate-900">
                {formatCurrency(grandTotal)}
              </span>
            </div>
          </div>

          <div className="p-6 pt-0 space-y-3">
            <Link
              to="/checkout"
              className="block w-full text-center bg-lime-500 text-white font-semibold py-3 rounded-3xl shadow-lg shadow-lime-200 transition hover:bg-lime-600 hover:shadow-lime-300"
            >
              Proceed to Checkout
            </Link>
            <Link
              to="/"
              className="block w-full text-center border border-slate-300 py-3 rounded-3xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition"
            >
              Continue Shopping
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Cart;
