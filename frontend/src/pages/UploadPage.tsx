// import { useState } from 'react'

import FileUpload from "../components/Upload/FileUpload";
import FileDownload from "../components/Upload/FileDownload";
// import { useLocation, Link } from "react-router-dom";

function Upload() {
  // const [data, setData] = useState(null);
  return (
    <div className="flex flex-row">
      <div className="join ">
        <input
          className="join-item bg-white btn"
          type="radio"
          name="options"
          aria-label="URL"
        />
        <input
          className="join-item bg-white btn"
          type="radio"
          name="options"
          aria-label="PDF"
        />
      </div>

      <FileUpload />
      <FileDownload />
    </div>
  );
}

export default Upload;
