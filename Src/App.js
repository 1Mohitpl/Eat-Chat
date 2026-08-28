import React, { lazy, Suspense } from "react";
import ReactDOM from "react-dom/client";
import Header from "./Components/Title";
import Body from "./Components/Body";
import Footer from "./Components/Footer";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import About from "./Components/about";
import Cart from "./Components/Cart";
import Checkout from "./Components/Checkout";
import Error from "./Components/Error";
import Contact from "./Components/Contact";
import RestauFood from "./Components/RestauFood";
import Profile from "./Components/Profile";
import Shimmer from "./Components/shimmer";
import Careers from "./Components/Careers";
import InstaFresh from "./Components/Instamart";
import {Provider} from "react-redux";
import store from "../utils/store";
import Login from "./Components/Login";
import ForgotPassword from "./Components/ForgotPassword";
import ResetPassword from "./Components/ResetPassword";
import Account from "./Components/Account";
import TrackOrder from "./Components/TrackOrder";
import ProtectedRoute from "./Components/ProtectedRoute";
import { UserProvider } from "../utils/UserContext";

/* Register service worker for PWA / offline support — never on localhost,
   where cache-first serving hides fresh code during development */
const isLocalhost = /^(localhost|127\.0\.0\.1|\[::1\])$/.test(window.location.hostname);
if ("serviceWorker" in navigator && !isLocalhost) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register(new URL("../sw.js", import.meta.url)).catch((err) => {
      console.warn("Service worker registration failed:", err);
    });
  });
}





const Instamart = lazy ( () => import ("./Components/Instamart"));   // dynamic import 

const AppLayout = () => {
  return (
    <Provider store = {store}> 
    <UserProvider>
    <>
  
      <Header />
      <main className="app-shell">
        <Outlet />
      </main>
      <Footer />
   
    </>
    </UserProvider>
    </Provider>
  );
};

const AuthLayout = () => {
  return (
    <Provider store = {store}> 
    <UserProvider>
      <Outlet />
    </UserProvider>
    </Provider>
  );
};

const appRouter = createBrowserRouter([
{
    path: "/login",
    element: <AuthLayout />,
    children: [
      {
        path: "",
        element: <Login/>,
      },
      {
        path: "forgot-password",
        element: <ForgotPassword />,
      },
      {
        path: "reset-password/:token",
        element: <ResetPassword />,
      },
    ],
  },
{
    path: "/",
    element: <AppLayout />,
    errorElement: <Error />,
    children: [
      {
        path: "/", // lowercase path
        element: <ProtectedRoute><Body /></ProtectedRoute>,
        
      },
      {
        path: "about", // lowercase path
        element: <ProtectedRoute><About /></ProtectedRoute>,
        children : [{
          path : "profile",   // parentpath/{path} locahost:123/about/profile 
          element:<Profile />
        }]
      },
      {
        path: "contact", // lowercase path
        element: <ProtectedRoute><Contact /></ProtectedRoute>,
      },
      {
        path: "cart", // lowercase path
        element: <ProtectedRoute><Cart/></ProtectedRoute>,
      },

      {
        path: "checkout", // lowercase path
        element: <ProtectedRoute><Checkout/></ProtectedRoute>,
      },

      {
        path: "order/:orderId",
        element: <ProtectedRoute><TrackOrder /></ProtectedRoute>,
      },

      {
        path: "account", // lowercase path
        element: <Account/>,
      },

      {
        path: "careers", // lowercase path 
        element: <ProtectedRoute><Careers/></ProtectedRoute>,
      },

      {
        path: "instafresh",
        element: (  
            <Suspense fallback={<Shimmer/>}> 
                  <InstaFresh />
                  </Suspense>
        ),
      }, 

      {
        path: "/restaurant/:resid", // lowercase path
        element: <ProtectedRoute><RestauFood /></ProtectedRoute>,
      },    
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(<RouterProvider router={appRouter} />);

