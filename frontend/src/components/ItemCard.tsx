import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus } from "@fortawesome/free-solid-svg-icons"; // Import the specific icon you want to use

interface Data {
  department: string;
  text: string;
  objectId: string;
  contentId: string;
}

interface QueryData {
  ObjectID: string;
  Classification: string | null;
  Downvotes: number;
  URL: string;
  Upvotes: number;
  ObjectName: string;
  Department: string | null;
  isLink: boolean;
}

const ItemCard = (props: Data) => {
  const [isLink, setIsLink] = useState(false);
  const [hasUpvote, setHasUpvote] = useState(false);
  const [hasDownvote, setHasDownvote] = useState(false);
  const [count, setCount] = useState(0);
  const [url, setUrl] = useState("");
  const [filename, setFilename] = useState(""); // Name of the file to download
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

  const queryData = async () => {
    const apiUrl =
      "http://127.0.0.1:8000/objectInfo?object_id=" + props.objectId;
      console.log(apiUrl)
    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((responseData: QueryData) => {
        console.log(responseData);
        setIsLink(responseData.isLink);
        setUrl(responseData.URL);
        setFilename(responseData.ObjectName);
        setCount(responseData.Upvotes - responseData.Downvotes);
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  // Function to capitalize the first letter
  const capitalizeFirstLetter = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const addCount = () => {
    if (!hasUpvote) {
      if (hasDownvote) {
        setCount(count + 1);
        setHasDownvote(false);
        vote(false);
        showToast("Retracted Vote!", false);
      } else {
        showToast("Upvoted!", false);
        setHasUpvote(true);
        setCount(count + 1);
        vote(true);
      }
    } else {
      showToast("You already upvoted this document!", true);
    }
  };

  const subtractCount = () => {
    if (!hasDownvote) {
      if (hasUpvote) {
        setCount(count - 1);
        setHasUpvote(false);
        vote(true);
        showToast("Retracted Vote!", false);
      } else {
        showToast("Downvoted!", false);
        setHasDownvote(true);
        setCount(count - 1);
        vote(false);
      }
    } else {
      showToast("You already downvoted this document!", true);
    }
  };

  const vote = (upvote: boolean) => {
    let apiUrl = "";
    if (upvote) {
      apiUrl = "http://127.0.0.1:8000/upvote/" + props.objectId;
    } else {
      apiUrl = "http://127.0.0.1:8000/downvote/" + props.objectId;
    }

    fetch(apiUrl, {
      method: "PUT",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        return response.json();
      })
      .then((responseData: String) => {
        console.log(responseData);
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  const downloadFile = () => {
    
    if (isLink) {
      window.open(url, "_blank");
      return;
    }
    const apiUrl = "http://127.0.0.1:8000/download?file_name=" + props.objectId;
    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.blob(); // Parse the response as a Blob
      })
      .then((blob) => {
        // Create a URL for the Blob
        const url = window.URL.createObjectURL(blob);
        // Create a link element to trigger the download
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", props.objectId); // Set the filename
        document.body.appendChild(link);
        link.click();
  
        // Clean up the URL object to free resources
        window.URL.revokeObjectURL(url);
      })
      .catch((error) => {
        console.error("Error downloading the file.", error);
      });
  }

  useEffect(() => {
    queryData();
  }, []);

  return (
    <div className="card bg-base-100 shadow-xl w-3/4 py-4 my-2 border">
      <div
        id="toast-container"
        className="fixed z-50 bottom-0 right-0 p-4 space-y-2"
      ></div>

      <h2 className="card-title ml-4">

        Department: {capitalizeFirstLetter(props.department)}
      </h2>
      <div className="card-body ">
        <div className="text-ellipsis whitespace-normal overflow-hidden">{props.text}</div>
      </div>
      <div className="flex justify-end mx-20 my-10">
        <button className="btn btn-outline" onClick={downloadFile}>Go To</button>
        <div className="join ml-6">
          <button className="join-item btn" onClick={subtractCount}>
            <FontAwesomeIcon icon={faMinus} bounce />
          </button>
          <button className="join-item btn">{count}</button>
          <button className="join-item btn" onClick={addCount}>
            <FontAwesomeIcon icon={faPlus} bounce />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ItemCard;
