import Layout from "../components/Layout";

import Home from "../pages/HomePage";
import Upload from "../pages/UploadPage";
import Search from "../pages/SearchPage";
import { createBrowserRouter } from "react-router-dom";

export enum Routes {
  Home = "/",
  Upload = "/upload",
  Search = "/search",
}

const AppRoutes = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: Routes.Home, element: <Home /> },
      { path: Routes.Upload, element: <Upload /> },
      { path: Routes.Search, element: <Search /> },
    ],
  },
]);

export default AppRoutes;
