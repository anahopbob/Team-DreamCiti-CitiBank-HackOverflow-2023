import React, { useState } from "react";
import Searchbar from "../components/Searchbar";
import ItemCard from "../components/ItemCard";
import CitiBankFull from "../assets/CitibankFull";

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
  const departments = [
    "any",
    "finance",
    "sales",
    "marketing",
    "hr",
    "it",
    "operations",
  ];
  const [tempArray, setTempArray] = useState<MyObject[]>([]);
  const [searched, setSearched] = useState(false); // Track whether a search has been performed
  // const [data, setData] = useState<Data | null>(null);
  const [searchItem, setSearchItem] = useState("");
  const [empty, setEmpty] = useState(false);
  // Callback function to handle the search item
  const handleSearch = (item: string, department: string) => {
    if (item === "") {
      setTempArray([]);
      setEmpty(true);
      setSearched(false);
      return;
    }
    setSearched(true);
    setEmpty(false);
    setSearchItem(item);
    // setDept(department);

    search(item, department);
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
        console.log(responseData.results.documents);
        let temp: MyObject[] = [];
        for (let i = 0; i < responseData.results.documents[0].length; i++) {
          let dict: MyObject = {
            objectId: responseData.results.metadatas[0][i].object_id,
            department: responseData.results.metadatas[0][i].department,
            text: responseData.results.documents[0][i],
          };
          temp.push(dict);
        }
        setTempArray(temp);
      })
      .catch((err) => {
        console.log(err.message);
      });
  };
  return (
    <div className="min-h-screen">
      <div
        className={`flex justify-center items-center flex-col h-screen ${
          searched ? "hidden" : ""
        }`}
      >
        <img
          className="w-72 h-48"
          src="/Citibank-Logo.svg"
          alt="CitiBank Logo"
        />
        <Searchbar onSearch={handleSearch} departments={departments} />
        {empty ? (
          <div className="badge badge-error text-xl p-6">
            Please enter text in the input field before searching
          </div>
        ) : (
          <span></span>
        )}
      </div>
      <div
        className={`flex justify-center items-center flex-col my-4 ${
          searched ? "" : "hidden"
        }`}
      >
        <Searchbar onSearch={handleSearch} departments={departments} />
      </div>

      <div className="flex justify-center items-center flex-col my-4">
        {tempArray && (
          <div className="flex justify-center items-center flex-col">
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
