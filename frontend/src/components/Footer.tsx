import React from "react";
import citi from "/public/citi.png"

export const Footer: React.FC = () => {
  return <div>
    <footer className="footer footer-center p-10 text-base-content rounded">
      <nav className="grid grid-flow-col gap-4">
        <a className="link link-hover">About us</a>
        <a className="link link-hover">Contact</a>
        <a className="link link-hover">Jobs</a>
        <a className="link link-hover">Press kit</a>
      </nav>
      <nav>
        <div className="grid grid-flow-col gap-4">
          <img src={citi} className="inline-block stroke-current w-20" alt="Your SVG" />
        </div>
      </nav>
      <aside>
        <p>Copyright © 2023 - All right reserved</p>
      </aside>
    </footer>
  </div>;
};
