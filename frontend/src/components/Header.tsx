import React from "react";
import { Routes } from "../routes/index";
import { Link } from "react-router-dom";

interface HeaderProps {
  isSearched: boolean; // Receive the 'isSearched' prop
}

export const Header: React.FC<HeaderProps> = ({ isSearched }) => {
  const navbarBgColor = isSearched ? "bg-citiblue" : "bg-white";
  const buttonClass = isSearched ? "text-neutral-50" : "text-black";

  return (
    <div>
      <div className={`navbar ${navbarBgColor} py-4`}>
        <div className="flex-1">
          <Link to={Routes.Search}>
            {isSearched && (
              <img src="/citi.svg" className="pl-6 h-18 w-32 " alt="Your SVG" />
            )}
          </Link>
        </div>
        <div className="flex content-end">
          <Link
            to={Routes.Upload}
            className={`w-40 text-l link-hover font-semibold ${buttonClass}`}
          >
            Upload
          </Link>
          <Link
            to={Routes.Edit}
            className={`w-40 text-l link-hover font-semibold ${buttonClass}`}
          >
            Edit
          </Link>
        </div>
      </div>
    </div>
  );
};
