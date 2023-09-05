import { useState } from 'react'
import citi from "../../public/citi.png"
function Navbar() {

  return (
    <>
        <div className="navbar bg-base-100 my-4">
            <div className="flex-1">
                <button className="btn btn-square btn-ghost mx-5">
                    <img src={citi} className="inline-block stroke-current" alt="Your SVG" />
                </button>
            </div>
            <div className="flex-none content-end">
                <a className="btn btn-ghost normal-case text-xl w-40 mx-10">Search</a>
                <a className="btn btn-ghost normal-case text-xl w-40 mx-10">Upload</a>
            </div>
        </div>
    </>
  )
}

export default Navbar
