import React, { useState, useEffect } from 'react'
import EditCard from '../components/EditCard';

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
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((responseData: Content[]) => {
                let temp: Document[] = []
                for (let i = 0; i < responseData.length; i++) {
                    let dict: Document = {
                        "department": responseData[i].Department,
                        "name": responseData[i].ObjectName,
                        "upvotes": responseData[i].Upvotes,
                        "downvotes": responseData[i].Downvotes,
                        "url": responseData[i].URL,
                        "ObjectID": responseData[i].ObjectID,
                    }
                    temp.push(dict);
                }
                setDocuments(temp);
            })
            .catch((err) => {
                console.log(err.message);
            });
    }

    useEffect(() => {
        getFolders();
    }, []);

    return (
        <div className="flex justify-center items-center min-h-screen">
            {Documents.length == 0 ? (
                <div className="badge badge-error gap-2 text-xl p-6">
                    No documents in system to view. Please upload a document first!
                </div>
            ) : (
                <div className='flex flex-col w-3/4'>
                    {Documents.map((item, index) => (
                        <EditCard key={index} department={item.department} name={item.name} upvotes={item.upvotes} downvotes={item.downvotes} url={item.url} ObjectID={item.ObjectID} />
                    ))}
                </div>
            )}

        </div>
    );
};

export default Edit;

