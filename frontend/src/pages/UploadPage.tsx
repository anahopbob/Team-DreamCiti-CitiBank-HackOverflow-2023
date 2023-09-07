import { useState } from "react";
import FileUpload from "../components/Upload/FileUpload";
import FileDownload from "../components/Upload/FileDownload";
import UrlInput from "../components/Upload/UrlInput";

function Upload() {
  const [selectedOption, setSelectedOption] = useState("URL");

  return (
    <div className="">
      <div className="flex items-center justify-center pt-10">
        <div className="inline-flex shadow-sm rounded-md mb-5" role="group">
          <button
            type="button"
            className={`border ${
              selectedOption === "URL"
                ? "bg-citiblue text-white"
                : "bg-white text-gray-900"
            } border-gray-400 text-sm font-medium py-2 focus:z-10 focus:bg-citiblue focus:text-white rounded-l-md px-8`}
            onClick={() => setSelectedOption("URL")}
          >
            URL
          </button>
          <button
            type="button"
            className={`border ${
              selectedOption === "PDF"
                ? "bg-citiblue text-white"
                : "bg-white text-gray-900"
            } border-gray-400 text-sm font-medium py-2 focus:z-10 focus:bg-citiblue focus:text-white rounded-r-md px-8`}
            onClick={() => setSelectedOption("PDF")}
          >
            PDF
          </button>
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
