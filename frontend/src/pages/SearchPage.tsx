import { useState } from 'react'
import '../assets/styles/App.css'
import Searchbar from '../components/Searchbar';
import ItemCard from '../components/ItemCard';

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

interface MyObject {
    department: string;
    text: string;
}

function Search() {
    const departments = ['any', 'finance', 'sales', 'marketing', 'hr', 'it', 'operations'];
    const [tempArray, setTempArray] = useState<MyObject[]>([]);
    const [dept, setDept] = useState("");
    // const [data, setData] = useState<Data | null>(null);
    const [searchItem, setSearchItem] = useState('');
    const [empty, setEmpty] = useState(false);
    // Callback function to handle the search item
    const handleSearch = (item: string, department: string) => {
        if (item === '') {
            setTempArray([]);
            setEmpty(true);
            return;
        }
        setEmpty(false);
        setSearchItem(item);
        // setDept(department);

        search(item, department);
    };

    const search = (query: string, department: string) => {

        var apiUrl = ''
        // Define the API endpoint URL
        if (department === "any") {
            apiUrl = 'http://127.0.0.1:8000/search/?query=' + query;
        }
        else {
            apiUrl = 'http://127.0.0.1:8000/search/?department=' + department + '&query=' + query; // Replace with your API endpoint
        }
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
                var temp = []
                for (let i = 0; i < responseData.documents[0].length; i++) {
                    var dict: MyObject = {
                        "department": responseData.metadatas[0][i].department,
                        "text": responseData.documents[0][i],
                    }
                    temp.push(dict);
                }
                setTempArray(temp);
            })
            .catch((err) => {
                console.log(err.message);

            });
    };
    return (
        <div className='h-screen'>
            <div className="flex justify-center items-center flex-col">
                <Searchbar onSearch={handleSearch} departments={departments} />
            </div>

            <div className='flex justify-center items-center flex-col my-4'>
                {tempArray && (
                    <div className='flex justify-center items-center flex-col'>
                        {tempArray.map((item, index) => (
                            <ItemCard key={index} department={item.department} text={item.text}/>
                        ))}
                    </div>
                )}
                <div>
                    {empty ? (
                        <p>Please enter text in the input field before searching.</p>
                    ) : (
                        <span></span>
                    )}
                </div>

            </div>

        </div>
    )
}

export default Search;
