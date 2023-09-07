import { Outlet } from "react-router-dom";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { useState } from "react";
const Layout = () => {
  // State to store the 'searched' value
  const [isSearched, setIsSearched] = useState(false);

  // Function to update the 'searched' state
  const updateSearchStatus = (status: boolean) => {
    setIsSearched(status);
  };
  return (
    <div className="">
      {/* Pass the updateSearchStatus function as a prop */}
      <Header isSearched={isSearched} updateSearchStatus={updateSearchStatus} />
      <Outlet />
      <Footer />
    </div>
  );
};

export default Layout;
