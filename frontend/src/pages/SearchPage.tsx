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
  content_id: string;
}

interface Data {
  results: Results;
}

interface MyObject {
  objectId: string;
  department: string;
  text: string;
  contentId: string;
}

function Search() {
  const [, setHeaderAtom] = useAtom(headerAtom);

  useEffect(() => {
    setHeaderAtom(false);
  }, [setHeaderAtom]);
  const departments = ["any", "finance", "sales", "legal"];
  const [tempArray, setTempArray] = useState<MyObject[]>([]);
  const [imageData, setImageData] = useState<string[][]>([]); // Array of image URLs
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
    toast.className = "px-4 py-2 text-white bg-red-500 rounded-md shadow-md";
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
      setSummary("");
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

  const openLink = (url) => {
    // Specify the URL you want to open in the new window/tab
    // url = "";
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
        let imageData = [];
        let temp: MyObject[] = [];
        for (let i = 0; i < responseData.results.documents[0].length; i++) {
          if (responseData.results.documents[0][i] === "") {
            continue;
          }
          let dict: MyObject = {
            objectId: responseData.results.metadatas[0][i].object_id,
            department: responseData.results.metadatas[0][i].department,
            text: responseData.results.documents[0][i],
            contentId:  responseData.results.metadatas[0][i].content_id,
          };

          // Xun Yi
          let images = [];
          if (dict.contentId !== "" && dict.contentId.includes(",")) {
            let contentIdArray = dict.contentId.split(",");
            contentIdArray.forEach((item) => {
              images.push([dict.objectId, item]);
            });
          } else if (dict.contentId !== "") {
            images.push([dict.objectId, dict.contentId]);
          }
          if (images.length !== 0) {
            imageData.push(images);
          }
          // Xun Yi

          temp.push(dict);
        }
        setTempArray(temp);
        setImageData(imageData);
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
        className="fixed bottom-0 right-0 z-50 p-4 space-y-2"
      ></div>
      <div
        className={`flex justify-center items-center flex-col h-full py-60 ${searched ? "hidden" : ""
          }`}
      >
        <img
          className="h-auto w-72"
          src="/Citibank-Logo.svg"
          alt="CitiBank Logo"
        />
        <Searchbar onSearch={handleSearch} departments={departments} />
      </div>
      <div
        className={`flex justify-center items-center flex-col my-4 ${searched ? "" : "hidden"
          }`}
      >
        <Searchbar onSearch={handleSearch} departments={departments} />
      </div>

      <div className="flex flex-col items-center justify-center w-screen my-4">
        {loading && (
          <span className="py-8 loading loading-spinner loading-lg w-15"></span>
        )}
        {!loading && summary && (
          <div className="flex flex-col items-center justify-center">
            <div className="w-3/4 py-4 my-2 border shadow-xl card bg-base-100">
              <h1 className="ml-4 card-title">
                AI Search results for: {searchItem}
              </h1>
              <div className="card-body">
                <p className="overflow-hidden whitespace-normal text-ellipsis">
                  {summary}
                </p>
                </div>
            </div>
            <div>
              <h1 className="py-10 ml-4 card-title">
                Compiled Search Results for : {searchItem}
              </h1>
            </div>
          </div>
        )}
        {imageData.length !== 0 && (
          <div className="w-3/4 py-4 my-2 border shadow-xl card bg-base-100">
            <span className="ml-4 card-title">Images for: {searchItem}</span>
            <div className="card-body">
              <div className="flex flex-wrap ">
                {imageData.map((item, index) => (
                  <div key={index}>
                    {item.map(([objectId, contentId], idx) => (
                      <div key={idx}>
                        <img
                          onClick={() => openLink(objectId)}
                          className="w-1/2 p-2 cursor-pointer md:w-1/3 lg:w-1/3"
                          src={"src/images/" + contentId + ".jpeg"}
                          alt="Image"
                          style={{ width: '200px', height: '150px' }}
                        />                      </div>
                    ))}
                  </div>
                ))}
                {/* {tempArray.map((item, index) => (
                  (
                  <p>
                    {item.contentId}
                  </p>

                  )
                  // <img
                  //   onClick={openLink}
                  //   key={index}
                  //   className="w-1/2 p-2 cursor-pointer md:w-1/3 lg:w-1/3"
                  //   src={"src/images/5cc9e0a6-e20c-42d8-ad4e-adf054a8faa1.jpeg"}
                  //   alt="Image"
                  // ></img>
                ), )} */}
              </div>
            </div>
          </div>
        )}
        {/* {imgArray && (
          <div className="w-3/4 py-4 my-2 border shadow-xl card bg-base-100">
            <span className="ml-4 card-title">Images for: {searchItem}</span>
            <div className="card-body">
              <div className="flex flex-wrap ">
                {imgArray.map((item, index) => (
                  <img
                    onClick={openLink}
                    key={index}
                    className="w-1/2 p-2 cursor-pointer md:w-1/3 lg:w-1/3"
                    src={item}
                    alt="Image"
                  ></img>
                ))}
              </div>
            </div>
          </div>
        )} */}

        {tempArray.length !== 0 && (
          <div className="flex flex-col items-center justify-center w-full">
            <div>
              <h1 className="py-10 ml-4 card-title">Documents</h1>
            </div>
            {tempArray.map((item, index) => (
              // <div>
              //   {JSON.stringify(item)}
              // </div>
              <ItemCard
                key={index}
                department={item.department}
                text={item.text}
                objectId={item.objectId}
                contentId={item.contentId}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Search;
