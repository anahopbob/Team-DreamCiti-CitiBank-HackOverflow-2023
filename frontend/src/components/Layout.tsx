import React, { useRef, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

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