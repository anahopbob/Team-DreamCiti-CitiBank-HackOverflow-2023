import React, { useState, useEffect } from "react";
import EditCard from "../components/EditCard";
import { Routes } from "../routes/index";
import { Link } from "react-router-dom";

interface Document {
  department: string | null;
  name: string;
  upvotes: number;
  downvotes: number;
  url: string;
  ObjectID: string;
}

interface Content {
  ObjectID: string;
  Classification: string | null;
  Downvotes: number;
  URL: string;
  Upvotes: number;
  ObjectName: string;
  Department: string | null;
  isLink: boolean;
}

const Edit = () => {
  const [Documents, setDocuments] = useState<Document[]>([]);

  const getFolders = async () => {
    const apiUrl = "http://127.0.0.1:8000/objectInfo/all";
    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((responseData: Content[]) => {
        let temp: Document[] = [];
        for (let i = 0; i < responseData.length; i++) {
          let dict: Document = {
            department: responseData[i].Department,
            name: responseData[i].ObjectName,
            upvotes: responseData[i].Upvotes,
            downvotes: responseData[i].Downvotes,
            url: responseData[i].URL,
            ObjectID: responseData[i].ObjectID,
          };
          temp.push(dict);
        }
        setDocuments(temp);
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  useEffect(() => {
    getFolders();
  }, []);

  return (
    <div className="flex justify-center items-center min-h-screen">
      {Documents.length == 0 ? (
        <div className="hero min-h-screen bg-base-200">
          <div className="hero-content text-center">
            <div className="max-w-md">
              <h1 className="text-5xl font-bold">Hello!</h1>
              <p className="py-6">
                No documents in system. To view please upload a document!
              </p>
              <Link
                to={Routes.Upload}
                className="w-40 text-l text-neutral-50 link-hover font-semibold"
              >
                <button className="btn btn-primary">
                  Upload a Document Here!
                </button>
              </Link>
            </div>
          </div>
        </div>
      ) : (
        // <div className="badge badge-error gap-2 text-xl p-6">
        //     No documents in system to view. Please upload a document first!
        // </div>
        <div className="flex flex-col w-3/4">
          {Documents.map((item, index) => (
            <EditCard
              key={index}
              department={item.department}
              name={item.name}
              upvotes={item.upvotes}
              downvotes={item.downvotes}
              url={item.url}
              ObjectID={item.ObjectID}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Edit;
