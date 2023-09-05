import React from "react";

import Layout from "../components/Layout";

import Home from "../components/Home/HomePage";
import { createBrowserRouter } from "react-router-dom";

export enum Routes {
  Home = "/",
}

const AppRoutes = createBrowserRouter([
  {
    element: <Layout />,
    children: [{ path: Routes.Home, element: <Home /> }],
  },
]);

export default AppRoutes;
