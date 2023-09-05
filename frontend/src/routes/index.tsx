import Layout from "../components/Layout";

import Home from "../pages/HomePage";
import Upload from "../pages/UploadPage";
import { createBrowserRouter } from "react-router-dom";

export enum Routes {
  Home = "/",
  Upload = "/upload",
}

const AppRoutes = createBrowserRouter([
  {
    element: <Layout />,
    children: [{ path: Routes.Home, element: <Home /> }],
  },
  { path: Routes.Upload, element: <Upload /> },
]);

export default AppRoutes;
