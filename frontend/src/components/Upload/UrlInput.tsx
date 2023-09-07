import { FunctionComponent, useState } from "react";
import { useAtom } from "jotai";
import { webScrapeAtom } from "../../jotai/webScrapeAtoms";
import type { webScrapes } from "../../jotai/webScrapeAtoms";
import axios from "axios";

const UrlInput: FunctionComponent = () => {
  const [url, setUrl] = useState<string>("");
  const [webScrapeState, setWebScrapeState] = useAtom(webScrapeAtom);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    scrapURL(url);
    setUrl("");
  };

  const scrapURL = (url: string) => {
    axios
      .post("http://127.0.0.1:8000/webscrape", {"website":url})
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
    <div className="flex items-center justify-center flex-col pt-20 pb-60">
      <form className="form-control" onSubmit={handleSubmit}>
        <div className="input-group lg:input-group-lg">
          <input
            type="text"
            placeholder="https://..."
            className="input input-bordered"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
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
