import Layout from "../components/Layout";

// import Home from "../pages/HomePage";
import Upload from "../pages/UploadPage";
import Search from "../pages/SearchPage";
import Edit from "../pages/EditPage";
import React, { createBrowserRouter } from "react-router-dom";

export enum Routes {
  // Home = "/",
  Upload = "/upload",
  Search = "/",
  Edit = "/edit",
}

const AppRoutes = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      // { path: Routes.Home, element: <Home /> },
      { path: Routes.Upload, element: <Upload /> },
      { path: Routes.Search, element: <Search /> },
      { path: Routes.Edit, element: <Edit /> },
    ],
  },
]);

export default AppRoutes;
