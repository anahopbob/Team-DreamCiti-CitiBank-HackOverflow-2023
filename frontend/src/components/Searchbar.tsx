import React, { useState } from "react";
interface SearchbarProps {
  onSearch: (searchValue: string, department: string) => void;
  departments: string[];
}
function Searchbar({ onSearch, departments }: SearchbarProps) {
  const [searchValue, setSearchValue] = useState("");
  const [dept, setDept] = useState(departments[0]);

  const handleInputChange = (e: any) => {
    setSearchValue(e.target.value);
  };

  // Function to capitalize the first letter
  const capitalizeFirstLetter = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const changeDepartment = (e: any) => {
    setDept(e.target.value);
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    // Call the callback function with the searchValue
    onSearch(searchValue, dept);
    setSearchValue("");
  };

  return (
    <form className="w-3/5">
      <div className="relative my-6">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="absolute top-0 bottom-0 w-6 h-6 my-auto text-gray-400 left-3"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="text"
          placeholder="Search"
          className="w-full py-3 pl-12 pr-4 text-gray-500 border rounded-md outline-none bg-gray-50 focus:bg-white focus:border-indigo-600 text-base"
          value={searchValue}
          onChange={handleInputChange}
        />
        <button
          onClick={handleSubmit}
          className="absolute top-0 bottom-0 right-0 px-4 py-3 outline-none text-base font-semibold text-white bg-citiblue rounded-r-md hover:bg-citidark focus:bg-citidark"
        >
          Search
        </button>
      </div>
      <div className="relative w-1/2 my-8 text-base">
        <span>Department:</span>
        <select
          className="w-full p-2.5 text-gray-500 bg-white border rounded-md shadow-sm outline-none appearance-none focus:border-citiblue text-base"
          onChange={changeDepartment}
          value={dept}
        >
          {departments.map((option, index) => (
            <option key={index} value={option}>
              {capitalizeFirstLetter(option)}
            </option>
          ))}
        </select>
      </div>
    </form>
  );
}

export default Searchbar;
