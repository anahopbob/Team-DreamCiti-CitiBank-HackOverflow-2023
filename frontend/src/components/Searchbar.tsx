import React, { useState } from 'react';
interface SearchbarProps {
    onSearch: (searchValue: string, department: string) => void;
    departments: string[];
}
function Searchbar({ onSearch, departments }: SearchbarProps) {
    const [searchValue, setSearchValue] = useState('');
    const [dept, setDept] = useState(departments[0]);
    const handleInputChange = (e: any) => {
        setSearchValue(e.target.value);
    };
    const changeDepartment = (e: any) => {
        setDept(e.target.value);
    };
    const handleSubmit = (e: any) => {
        e.preventDefault();
        // Call the callback function with the searchValue
        onSearch(searchValue, dept);
        setSearchValue('');
    };
    return (
        <form className="max-w px-40">
            <div className="relative ">
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
                    className="w-full py-3 pl-12 pr-4 text-gray-500 border rounded-md outline-none bg-gray-50 focus:bg-white focus:border-indigo-600"
                    value={searchValue}
                    onChange={handleInputChange}
                />
                <button onClick={handleSubmit} className="absolute top-0 bottom-0 right-0 px-4 py-3  text-sm font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-500 focus:bg-indigo-700">Submit</button>
            </div>
            <div className="relative w-1/2">
                <span>
                    Department:
                </span>
                <select
                    className="w-full p-2.5 text-gray-500 bg-white border rounded-md shadow-sm outline-none appearance-none focus:border-indigo-600"
                    onChange={changeDepartment}
                    value={dept}
                >
                    {departments.map((option, index) => (
                        <option key={index} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
            </div>
        </form>
    );
}

export default Searchbar
