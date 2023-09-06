// import { useState } from 'react'

import FileUpload from "../components/Upload/FileUpload";
import FileDownload from "../components/Upload/FileDownload";

function Upload() {
  // const [data, setData] = useState(null);

  return (
    <div className="">
      <FileUpload />
      <FileDownload />
    </div>
  );
}

export default Upload;
