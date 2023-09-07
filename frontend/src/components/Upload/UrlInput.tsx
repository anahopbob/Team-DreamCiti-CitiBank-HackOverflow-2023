import { FunctionComponent, useState } from "react";
import { useAtom } from "jotai";
import { webScrapeAtom } from "../../jotai/webScrapeAtoms";
import type { webScrapes } from "../../jotai/webScrapeAtoms";
import axios from "axios";

const UrlInput: FunctionComponent = () => {
  const departments = ["Any", "finance", "sales", "technology", "legal"];
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
      toast.className =
        "bg-green-500 text-white px-4 py-2 rounded-md shadow-md";
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

  const [url, setUrl] = useState<string>("");
  const [webScrapeState, setWebScrapeState] = useAtom(webScrapeAtom);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    scrapURL(url);
    setUrl("");
    showToast("Uploaded!", false);
  };

  const scrapURL = (url: string) => {
    axios
      .post("http://127.0.0.1:8000/webscrape", {
        website: url,
        department: dept,
      })
      .then((response) => {
        setWebScrapeState((prev: webScrapes) => ({
          ...prev,
          [url]: { url },
        }));
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="flex items-center justify-center flex-col pt-20 pb-60">
      <div
        id="toast-container"
        className="fixed z-50 bottom-0 right-0 p-4 space-y-2"
      ></div>
      <form className="form-control" onSubmit={handleSubmit}>
        <div className="input-group lg:input-group-lg py-10 w-full text-base">
          <input
            type="text"
            placeholder="https://..."
            className="input input-bordered w-[40vw]"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <select
            className="input input-bordered"
            onChange={changeDepartment}
            value={dept}
          >
            {departments.map((option, index) => (
              <option key={index} value={option} className="">
                {capitalizeFirstLetter(option)}
              </option>
            ))}
          </select>
          {/* <button className="btn" type="submit">
            Department
          </button> */}

          <button className="btn text-base" type="submit">
            ADD
          </button>
        </div>
      </form>

      {Object.values(webScrapeState).length > 0 && (
        <div className="w-[60%] mx-auto my-10">
          <table className="table text-center text-base">
            <thead>
              <tr>
                <th className="w-1/12 text-base">No.</th>
                <th className="text-base">URL</th>
              </tr>
            </thead>
            <tbody>
              {Object.values(webScrapeState).map((item, index) => (
                <tr key={index}>
                  <td className="text-base">{index + 1}</td>
                  <td className="text-base">{item.url}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UrlInput;
