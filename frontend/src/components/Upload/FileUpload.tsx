import { FunctionComponent, useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import axios from "axios";
import FileText from "../../assets/filetext";
import InfoSvg from "../../assets/infoicon";
import { Button } from "antd";

const fileUploadChildren = (
  <div className="h-[420px] cursor-pointer border-2 border-dashed border-gray-400 hover:border-gray-800 focus:border-gray-800 mx-12">
    <div className="grid justify-items-center content-center">
      <div className="mt-20 mb-14">
        <FileText />
      </div>
      <p className="label-regular mb-14 text-gray-800">
        Drag & drop a file here or <span className="link">upload</span>
      </p>
      <p className="body-base text-14 leading-20 text-gray-800">
        File format: pdf
      </p>
    </div>
  </div>
);

const fileTypes = ["PDF"];

const FileUpload: FunctionComponent = () => {
  // TYLER CODE
  const departments = [
    "any",
    "finance",
    "sales",
    "legal",
  ];
  const [dept, setDept] = useState(departments[0]);
  const changeDepartment = (e: any) => {
    setDept(e.target.value);
  };

  // Function to capitalize the first letter
  const capitalizeFirstLetter = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  let currentToast: HTMLElement | null = null;
  function showToast(message: string, error: boolean) {
    const toastContainer = document.getElementById("toast-container");

    // Check if there's an existing toast, and remove it if it exists
    if (currentToast) {
      currentToast.remove();
    }

    const toast = document.createElement("div");

    if (error) {
      toast.className = "bg-red-500 text-white px-4 py-2 rounded-md shadow-md";
    } else {
      toast.className = "bg-green-500 text-white px-4 py-2 rounded-md shadow-md";
    }

    toast.textContent = message;
    if (toastContainer) {
      toastContainer.appendChild(toast);
    }

    currentToast = toast;

    // Automatically remove the toast after a few seconds
    setTimeout(() => {
      toast.remove();
      currentToast = null; // Reset the currentToast
    }, 3000); // 3000 milliseconds (3 seconds)
  }
  // TYLER CODE

  
  const [dragStyling, setDragStyling] = useState<string>("");
  const [file, setFile] = useState(null);
  const [files, setFiles] = useState([]);

  const handleUploadOnChange = (file: File) => {
    setFile(file);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("department", dept);

    axios
      .post("http://localhost:8000/pdf-enroll", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        showToast("Uploaded!", false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleFiles = () => {
    axios
      .get("http://localhost:8000/getallfiles")
      .then((response) => {
        setFiles(response.data.Contents);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleOnDraggingStateChange = (dragging: boolean) => {
    if (dragging) {
      setDragStyling("on-drag");
    } else {
      setDragStyling("");
    }
  };

  return (
    <div>
        <div
        id="toast-container"
        className="fixed z-50 bottom-0 right-0 p-4 space-y-2"
      ></div>
      <div className="rounded-lg border border-blue-700 bg-blue-100 my-10 mx-12">
        <div className="flex items-center">
          <div className="py-2 pl-4 pr-6">
            <InfoSvg />
          </div>
          <div className="label-regular leading-24 text-gray-900">
            <span className="">Upload Citibank documents below!</span>
          </div>

        </div>
      </div>
      <div className="my-10 mx-12 flex items-center justify-center w-3/4">
      Select Department:
      <select
            className="input input-bordered w-full p-2.5 text-gray-500 bg-white border rounded-md shadow-sm outline-none focus:border-indigo-600"
            onChange={changeDepartment}
            value={dept}
          >
            {departments.map((option, index) => (
              <option key={index} value={option}>
                 {capitalizeFirstLetter(option)}
              </option>
            ))}
          </select>
      </div>

      <div className={`${dragStyling} mb-32`}>
        <FileUploader
          children={fileUploadChildren}
          multiple={false}
          hoverTitle={" "}
          handleChange={handleUploadOnChange}
          onDraggingStateChange={handleOnDraggingStateChange}
          name="file"
          types={fileTypes}
        />
        {/* <p>{file ? `File name: ${file.name}` : "no files uploaded yet"}</p> */}
      </div>
      {/* <div className="border border-gray-900 my-10 flex flex-col items-center">
        <Button className="border border-gray-900" onClick={handleFiles}>
          Get files
        </Button>
        <h1>List of Files:</h1>
        <ol>
          {files.map((file, index) => (
            <li key={index}>
              <div>{file.Key}</div>
            </li>
          ))}
        </ol>
      </div> */}
    </div>
  );
};

export default FileUpload;
