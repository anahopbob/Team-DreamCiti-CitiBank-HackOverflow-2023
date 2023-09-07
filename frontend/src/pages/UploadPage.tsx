// import { useState } from 'react'

import FileUpload from "../components/Upload/FileUpload";
import FileDownload from "../components/Upload/FileDownload";

function Upload() {
  // const [data, setData] = useState(null);

  return (
    <div className="">
      <div className="mx-14 my-8">
        <input type="checkbox" className="toggle" checked />
      </div>

      <FileUpload />
      <FileDownload />
    </div>
  );
}

export default Upload;
