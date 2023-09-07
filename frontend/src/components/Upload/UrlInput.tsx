import { FunctionComponent, useState } from "react";
import { useAtom } from "jotai";
import { webScrapeAtom } from "../../jotai/webScrapeAtoms";
import type { webScrapes } from "../../jotai/webScrapeAtoms";
import axios from "axios";

const UrlInput: FunctionComponent = () => {
  // TYLER CODE
  const departments = [
    "Department",
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
  // TYLER CODE

  const [url, setUrl] = useState<string>("");
  const [webScrapeState, setWebScrapeState] = useAtom(webScrapeAtom);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    scrapURL(url);
    setUrl("");
  };

  const scrapURL = (url: string) => {
    axios
      .post("http://127.0.0.1:8000/webscrape", {"website":url, "department":dept})
      .then((response) => {
        console.log(response.data);
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
    <div className="flex items-center justify-center flex-col pt-20 pb-60" >
      <form className="form-control" onSubmit={handleSubmit}>
        <div className="input-group lg:input-group-lg py-10 w-full">
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

          <button className="btn" type="submit">
            ADD
          </button>
        </div>
      </form>

      {Object.values(webScrapeState).length > 0 && (
        <div className="w-[60%] mx-auto my-10">
          <table className="table text-center">
            <thead>
              <tr>
                <th className="w-1/12">No.</th>
                <th>URL</th>
              </tr>
            </thead>
            <tbody>
              {Object.values(webScrapeState).map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{item.url}</td>
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
