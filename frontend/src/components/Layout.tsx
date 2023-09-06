import { Outlet } from "react-router-dom";
import "../styles/globals.scss";
import { Footer } from "./Footer";
import { Header } from "./Header";

const Layout = () => {
  return (
    <div className="">
      <div>
        <Header />
      </div>
      <Outlet />
      <Footer />
    </div>
  );
};

export default Layout;
