import { useState, useEffect } from "react";
import Searchbar from "../components/Searchbar";
import ItemCard from "../components/ItemCard";
import { useAtom } from "jotai";
import { headerAtom } from "../jotai/webScrapeAtoms";

interface Results {
  ids: string[][];
  distances: number[][];
  metadatas: Metadata[][];
  embeddings: any;
  documents: string[][];
}

interface Metadata {
  department: string;
  object_id: string;
}

interface Data {
  results: Results;
}

interface MyObject {
  objectId: string;
  department: string;
  text: string;
}

function Search() {
  const [, setHeaderAtom] = useAtom(headerAtom);

  useEffect(() => {
    setHeaderAtom(false);
  }, [setHeaderAtom]);
  const departments = ["any", "finance", "sales", "legal"];
  const [tempArray, setTempArray] = useState<MyObject[]>([]);
  const [searched, setSearched] = useState(false); // Track whether a search has been performed
  // const [data, setData] = useState<Data | null>(null);
  const [searchItem, setSearchItem] = useState("");
  const [summary, setSummary] = useState(""); // Summary of the search results
  const [imgArray, setImgArray] = useState<string[]>([
    "/test1.png",
    "/test2.png",
    "/test3.png",
    "/test4.png",
    "/test5.png",
  ]); // Array of image URLs
  const [loading, setLoading] = useState(false);
  const [empty, setEmpty] = useState(false);
  let currentToast: HTMLElement | null = null;
  function showToast(message: string) {
    const toastContainer = document.getElementById("toast-container");
    // Check if there's an existing toast, and remove it if it exists
    if (currentToast) {
      currentToast.remove();
    }
    const toast = document.createElement("div");
    toast.className = "bg-red-500 text-white px-4 py-2 rounded-md shadow-md";
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
  // Callback function to handle the search item
  const handleSearch = (item: string, department: string) => {
    if (item === "") {
      setTempArray([]);
      setEmpty(true);
      setSearched(false);

      showToast("Search field cannot be empty!");
      return;
    }
    setHeaderAtom(true);
    setSearched(true);
    setEmpty(false);
    setSearchItem(item);
    // setDept(department);

    search(item, department);
  };

  const openLink = () => {
    // Specify the URL you want to open in the new window/tab
    const url = "";
    // Open the new window/tab
    window.open(url, "_blank");
  };

  const summarise = (data: Data) => {
    let apiUrl = "http://127.0.0.1:8000/summarise";
    setLoading(true);
    fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Set the content type to JSON
      },
      body: JSON.stringify(data), // Replace with your object data
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((responseData) => {
        if (
          responseData.summary ===
          "I apologize, but I'm unable to understand the context you provided. Can you please provide more information or ask a specific question?"
        ) {
          setSummary(
            "I apologize, but I'm unable to understand the context you provided. Can you please provide more information or ask a more relevant question?"
          );
        } else {
          setSummary(responseData.summary);
          setLoading(false);
        }
        // Handle the response data as needed
      })
      .catch((err) => {
        console.log(err.message);
        // Handle the error
      });
  };

  const search = (query: string, department: string) => {
    let apiUrl = "";
    // Define the API endpoint URL
    if (department === "any") {
      apiUrl = "http://127.0.0.1:8000/search/?query=" + query;
    } else {
      apiUrl =
        "http://127.0.0.1:8000/search/?department=" +
        department +
        "&query=" +
        query; // Replace with your API endpoint
    }
    // const apiUrl = 'http://127.0.0.1:8000/search/?department=finance&query=123131'
    // Make the API call
    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((responseData: Data) => {
        console.log(responseData);
        let temp: MyObject[] = [];
        for (let i = 0; i < responseData.results.documents[0].length; i++) {
          if (responseData.results.documents[0][i] === "") {
            continue;
          }
          let dict: MyObject = {
            objectId: responseData.results.metadatas[0][i].object_id,
            department: responseData.results.metadatas[0][i].department,
            text: responseData.results.documents[0][i],
          };
          temp.push(dict);
        }
        setTempArray(temp);
        summarise(responseData);
      })
      .catch((err) => {
        console.log(err.message);
      });
  };
  return (
    <div className="min-h-screen">
      <div
        id="toast-container"
        className="fixed z-50 bottom-0 right-0 p-4 space-y-2"
      ></div>
      <div
        className={`flex justify-center items-center flex-col h-full py-60 ${
          searched ? "hidden" : ""
        }`}
      >
        <img
          className="w-72 h-auto"
          src="/Citibank-Logo.svg"
          alt="CitiBank Logo"
        />
        <Searchbar onSearch={handleSearch} departments={departments} />
      </div>
      <div
        className={`flex justify-center items-center flex-col my-4 ${
          searched ? "" : "hidden"
        }`}
      >
        <Searchbar onSearch={handleSearch} departments={departments} />
      </div>

      <div className="flex justify-center items-center flex-col my-4 w-screen">
        {loading && (
          <span className="loading loading-spinner loading-lg w-15 py-8"></span>
        )}
        {!loading && summary && (
          <div className="flex justify-center items-center flex-col">
            <div className="card bg-base-100 shadow-xl w-3/4 py-4 my-2 border">
              <h1 className="card-title ml-4">
                AI Search results for: {searchItem}
              </h1>
              <div className="card-body">{summary}</div>
            </div>
            <div>
              <h1 className="card-title ml-4 py-10">
                Compiled Search Results for :{searchItem}
              </h1>
            </div>
          </div>
        )}
        {imgArray && (
          <div className="card bg-base-100 shadow-xl w-3/4 py-4 my-2 border">
            <span className="card-title ml-4">Images for: {searchItem}</span>
            <div className="card-body">
              <div className="flex flex-wrap ">
                {imgArray.map((item, index) => (
                  <img
                    onClick={openLink}
                    key={index}
                    className="w-1/2 md:w-1/3 lg:w-1/3 p-2 cursor-pointer"
                    src={item}
                    alt="Image"
                  ></img>
                ))}
              </div>
            </div>
          </div>
        )}

        {tempArray && (
          <div className="flex justify-center items-center flex-col">
            <div>
              <h1 className="card-title ml-4 py-10">Documents</h1>
            </div>
            {tempArray.map((item, index) => (
              <ItemCard
                key={index}
                department={item.department}
                text={item.text}
                objectId={item.objectId}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Search;
