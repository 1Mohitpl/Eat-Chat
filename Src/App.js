import React, { lazy, Suspense, useState } from "react";
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
import FoodCard from "./Components/Foodcard";





const Instamart = lazy ( () => import ("./Components/Instamart"));   // dynamic import 

const AppLayout = () => {
  return (
    <Provider store = {store}> 
    <>
      <Header />
      <Outlet />
      <Footer />
   
    </>
    </Provider>
  );
};

const appRouter = createBrowserRouter([
{
    path: "/",
    element: <AppLayout />,
    errorElement: <Error />,
    children: [
      {
        path: "/", // lowercase path
        element: <Body />,
        
      },
      {
        path: "about", // lowercase path
        element: <About />,
        children : [{
          path : "profile",   // parentpath/{path} locahost:123/about/profile 
          element:<Profile />
        }]
      },
      {
        path: "contact", // lowercase path
        element: <Contact />,
      },
      {
        path: "cart", // lowercase path
        element: <Cart/>,
      },

      {
        path: "checkout", // lowercase path
        element: <Checkout/>,
      },

      {
        path: "careers", // lowercase path 
        element: < Careers/>,
      },

      {
        path: "InstaFresh", // lowercase path
        element: (  
            <Suspense fallback={<Shimmer/>}> 
                  <InstaFresh />
                  </Suspense>
        ),
      }, 

      {
        path: "/restaurant/:resid", // lowercase path
        element: <RestauFood />,
      },    
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(<RouterProvider router={appRouter} />);

