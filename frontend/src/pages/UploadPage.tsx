// import { useState } from 'react'

import FileUpload from "../components/Upload/FileUpload";

function Upload() {
  // const [data, setData] = useState(null);

  return (
    <div className="min-h-screen">
      <div>Upload page</div>
      <FileUpload />
    </div>
  );
}

export default Upload;
