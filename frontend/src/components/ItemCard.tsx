import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus } from "@fortawesome/free-solid-svg-icons"; // Import the specific icon you want to use

interface Data {
  department: string;
  text: string;
}

const ItemCard = (props: Data) => {
  const [department, setDepartment] = useState("");

  // Function to capitalize the first letter
  const capitalizeFirstLetter = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  return (
    <div className="card bg-base-100 shadow-xl w-3/4 my-4">
      <h2 className="card-title">
        Department: {capitalizeFirstLetter(props.department)}
      </h2>
      <div className="card-body">
        <p>{props.text}</p>
      </div>
      <div className="flex justify-end mx-20 my-10">
        <button className="btn btn-outline">Go To</button>
        <div className="join ml-6">
          <button className="join-item btn">
            <FontAwesomeIcon icon={faMinus} bounce />
          </button>
          <button className="join-item btn">1</button>
          <button className="join-item btn">
            <FontAwesomeIcon icon={faPlus} bounce />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ItemCard;
