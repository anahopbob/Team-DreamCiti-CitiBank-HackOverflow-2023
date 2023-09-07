import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus } from "@fortawesome/free-solid-svg-icons"; // Import the specific icon you want to use

interface Data {
  department: string;
  text: string;
  objectId: string;
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
  const [hasUpvote, setHasUpvote] = useState(false);
  const [hasDownvote, setHasDownvote] = useState(false);
  const [count, setCount] = useState(0);

  function showToast(message: string, error: boolean) {
    const toastContainer = document.getElementById("toast-container");
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
    // Automatically remove the toast after a few seconds
    setTimeout(() => {
      toast.remove();
    }, 3000); // 3000 milliseconds (3 seconds)
  }

  const queryData = async () => {
    const apiUrl =
      "http://127.0.0.1:8000/objectInfo?object_id=" + props.objectId;
    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((responseData: QueryData) => {
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
  useEffect(() => {
    queryData();
  }, []);

  return (
    <div className="card bg-base-100 shadow-xl w-3/4 my-4">
      <div
        id="toast-container"
        className="fixed z-50 bottom-0 right-0 p-4 space-y-2"
      ></div>

      <h2 className="card-title">
        Department: {capitalizeFirstLetter(props.department)}
      </h2>
      <div className="card-body">
        <p>{props.text}</p>
      </div>
      <div className="flex justify-end mx-20 my-10">
        <button className="btn btn-outline">Go To</button>
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
