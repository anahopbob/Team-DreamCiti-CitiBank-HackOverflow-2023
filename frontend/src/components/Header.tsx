import React from "react";
import citi from "/public/citi.png"
import { Routes } from "../routes/index";
import { Link } from "react-router-dom";

export const Header: React.FC = () => {
  return <div>
    <div className="navbar my-4">
      <div className="flex-1">
        <Link to={Routes.Home}>
          <button className="btn btn-square mx-5 hover:bg-gray-300">
            <img src={citi} className="inline-block stroke-current" alt="Your SVG" />
          </button>
        </Link>
      </div>
      <div className="flex-none content-end">
        <Link to={Routes.Search}>
          <button className="btn normal-case text-xl w-40 mx-10 hover:bg-gray-300">Search</button>
        </Link>
        <Link to={Routes.Upload}>
          <button className="btn normal-case text-xl w-40 mx-10 hover:bg-gray-300">Upload</button>
        </Link>
      </div>
    </div>
  </div>;
};
