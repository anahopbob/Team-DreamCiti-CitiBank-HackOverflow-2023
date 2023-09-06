import { FunctionComponent, useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import axios from "axios";
import FileText from "../../assets/filetext";
import InfoSvg from "../../assets/infoicon";

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
  const [dragStyling, setDragStyling] = useState<string>("");

  const [file, setFile] = useState(null);
  const handleUploadOnChange = (file: File) => {
    setFile(file);
    const formData = new FormData();
    formData.append("file", file);
    console.log(formData);
    console.log(file);
    axios
      .post("http://localhost:8000/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        console.log(response.data);
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
        className={`rounded-lg border border-blue-700 bg-blue-100 my-20 mx-12`}
      >
        <div className="flex items-center">
          <div className="py-2 pl-4 pr-6">
            <InfoSvg />
          </div>
          <div className="label-regular leading-24 text-gray-900">
            <span className="">Upload Citibank documents below!</span>
          </div>
        </div>
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
        <p>{file ? `File name: ${file.name}` : "no files uploaded yet"}</p>
      </div>
    </div>
  );
};

export default FileUpload;
