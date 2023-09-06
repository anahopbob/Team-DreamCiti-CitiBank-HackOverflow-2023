import { useState } from 'react'
import '../assets/styles/App.css'
import Searchbar from '../components/Searchbar';

interface Data {
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



function Search() {
    const departments = ['any','finance', 'sales', 'marketing', 'hr', 'it', 'operations'];
    const [dept, setDept] = useState("");
    const [data, setData] = useState<Data | null>(null);
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
        // const apiUrl = 'http://127.0.0.1:8000/search/?department=finance&query=123131'
        // Make the API call
        fetch(apiUrl)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((responseData: Data) => {
                console.log(apiUrl)
                setData(responseData);
                console.log(responseData);
            })
            .catch((err) => {
                console.log(err.message);

            });
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
                Documents are:
                {data && (
                    <div>
                        <ul>
                            {data.documents.map((document, index) => (
                                <li key={index}>{document}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </>
    )
}

export default Search;
