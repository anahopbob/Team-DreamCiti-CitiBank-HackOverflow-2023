import React from "react";
import { Routes } from "../routes/index";
import { Link } from "react-router-dom";

export const Header: React.FC = () => {
  return (
    <div>
      <div className="navbar bg-citiblue py-4">
        <div className="flex-1">
          <Link to={Routes.Search}>
            <img src="/citi.svg" className="pl-6 h-18 w-32 " alt="Your SVG" />
          </Link>
        </div>
        <div className="flex content-end">
          {/* <Link
            to={Routes.Search}
            className="w-40 text-l text-neutral-50 font-semibold link-hover"
          >
            Search
          </Link> */}
          <Link
            to={Routes.Upload}
            className="w-40 text-l text-neutral-50 link-hover font-semibold"
          >
            Upload
          </Link>
          <Link
            to={Routes.Edit}
            className="w-40 text-l text-neutral-50 link-hover font-semibold"
          >
            Edit
          </Link>
        </div>
      </div>
    </div>
  );
};
