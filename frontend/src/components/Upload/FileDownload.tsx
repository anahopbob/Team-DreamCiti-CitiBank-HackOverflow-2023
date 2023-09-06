import React, { FunctionComponent, useState } from "react";
import axios from "axios";

const FileDownload: FunctionComponent = () => {
  const [message, setMessage] = useState("");
  const [updated, setUpdated] = useState(message);

  const handleChange = (event) => {
    setMessage(event.target.value);
  };

  const handleClick = () => {
    setUpdated(message);
    // Make a GET request to download the file
    console.log("calling download");
    axios
      .get(`http://localhost:8000/download?file_name=${message}`)
      .then((response) => {
        // Trigger the file download
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", message); //or any other extension
        document.body.appendChild(link);
        link.click();
      })
      .catch((error) => {
        console.error("Error downloading the file.", error);
      });
  };
  return (
    <div className="flex flex-col items-center border border-gray-900">
      <input
        type="text"
        id="fileID"
        name="fileDownload"
        onChange={handleChange}
        value={message}
      />
      <h2>Downloading: {updated}</h2>
      <button onClick={handleClick} className="border border-gray-900">
        Download File
      </button>
    </div>
  );
};

export default FileDownload;
