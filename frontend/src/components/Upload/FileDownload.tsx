import { FunctionComponent, useState } from "react";
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
    const apiUrl = `http://localhost:8000/download?file_name=${message}`;

    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.blob(); // Parse the response as a Blob
      })
      .then((blob) => {
        // Create a URL for the Blob
        const url = window.URL.createObjectURL(blob);
  
        // Create a link element to trigger the download
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", message); // Set the filename
        document.body.appendChild(link);
        link.click();
  
        // Clean up the URL object to free resources
        window.URL.revokeObjectURL(url);
      })
      .catch((error) => {
        console.error("Error downloading the file.", error);
      });
  };
  return (
    <div className="flex flex-col items-center border border-gray-900 mb-10">
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
