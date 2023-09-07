import React from "react";

export const Footer: React.FC = () => {
  return (
    <footer className="footer p-10 bg-gray-50 border-t-2 border-gray-100 text-gray-700">
      <aside>
        <p>
          <img className="w-28 h-20" src="/citi2.svg" alt="CitiBank Logo" />
          <br />
          Copyright © 2023 Citigroup Inc.
        </p>
      </aside>
      <nav>
        <header className="footer-title ">Services</header>
        <a className="link link-hover">Banking</a>
        <a className="link link-hover">Credit Cards</a>
        <a className="link link-hover">Mortagages</a>
        <a className="link link-hover">Loans</a>
      </nav>
      <nav>
        <header className="footer-title">Company</header>
        <a className="link link-hover">About us</a>
        <a className="link link-hover">Contact</a>
        <a className="link link-hover">Notices</a>
        <a className="link link-hover">Site Map</a>
      </nav>
    </footer>
  );
};
