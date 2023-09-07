import { useState } from "react";
import FileUpload from "../components/Upload/FileUpload";
import FileDownload from "../components/Upload/FileDownload";
import UrlInput from "../components/Upload/UrlInput";

function Upload() {
  const [selectedOption, setSelectedOption] = useState("URL");

  return (
    <div className="">
      <div className="flex items-center justify-center pt-10">
        <div className="join ">
          <input
            className={"join-item btn btn-pill px-8"}
            type="radio"
            name="options"
            aria-label="URL"
            defaultChecked={true}
            onChange={() => setSelectedOption("URL")}
          />
          <input
            className="join-item bg-white btn px-8"
            type="radio"
            name="options"
            aria-label="PDF"
            onChange={() => setSelectedOption("PDF")}
          />
        </div>
      </div>
      {selectedOption === "URL" && <UrlInput />}
      {selectedOption === "PDF" && (
        <>
          <FileUpload />
          <FileDownload />
        </>
      )}
    </div>
  );
}

export default Upload;
