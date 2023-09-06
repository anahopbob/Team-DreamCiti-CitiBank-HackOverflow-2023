import { useState } from 'react'
import '../assets/styles/App.css'
import Searchbar from '../components/Searchbar';
function Search() {
    const departments = ['Finance', 'Sales', 'Marketing', 'HR', 'IT', 'Operations'];
    const [dept, setDept] = useState("");
    const [data, setData] = useState(null);
    const [searchItem, setSearchItem] = useState('');
    const [empty, setEmpty] = useState(false);
    // Callback function to handle the search item
    const handleSearch = (item: string, department: string) => {
        if (item === '') {
            setData(null);
            setEmpty(true);
            return;
        }
        setEmpty(false);
        setSearchItem(item);
        setDept(department);

        search(item, department);
    };

    const search = (query: string, department: string) => {
        // Define the API endpoint URL
        const apiUrl = 'http://127.0.0.1:8000/search/?department=' + department + '&query=' + query; // Replace with your API endpoint
        // Make the API call
        fetch(apiUrl)
            .then((response) => response.json())
            .then((responseData) => setData(responseData))
            .catch((error) => console.error('Error fetching data:', error));
    };
    return (
        <>
            <div className="">
                <Searchbar onSearch={handleSearch} departments={departments} />
                <p>Search Item: {searchItem}</p>
            </div>
            {empty ? (
                <p>Please enter something in the input field.</p>
            ) : (
                <span></span>
            )}
            <div>
                Data is:{JSON.stringify(data, null, 2)}
            </div>
        </>
    )
}

export default Search;
