import React, { useState } from 'react';
interface Data {
    ObjectID: string;
}

function DeleteButton(props: Data) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };
    // const [data, setData] = useState(null);
    const deleteDocument = () => {
        const apiUrl = "http://127.0.0.1:8000/delete_object/" + props.ObjectID;
        console.log(apiUrl);
        fetch(apiUrl, {
            method: 'DELETE', // Specify the HTTP method as 'DELETE'
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                window.location.reload();
                return response.json();
            })
            .then((responseData: String) => {
                console.log(responseData);
            })
            .catch((err) => {
                console.log(err.message);
            });
    }
    const handleSubmit = (event: any) => {
        event.preventDefault(); // Prevent the default form submission behavior
        // Call your deleteDocument function or any other form submission logic here
        closeModal(); // Close the modal after form submission if needed
    };
    return (
        <div className="">
            <button className="btn btn-outline btn-error mx-4" onClick={openModal}>Delete Document</button>
            {isModalOpen && (
                <dialog open={isModalOpen} id={props.ObjectID} className="modal backdrop-blur-md">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg">
                            Are you sure you want to delete your document?
                        </h3>
                        <p className="py-4">This action cannot be undone!</p>
                        <div className="flex justify-end">
                            <button
                                className="btn btn-outline btn-error mx-4"
                                onClick={deleteDocument}
                            >
                                Delete Document
                            </button>
                        </div>
                    </div>
                    <form onSubmit={handleSubmit} method="dialog" className="modal-backdrop">
                        <button>Close</button>
                    </form>
                </dialog>
            )}
        </div>
    );
}

export default DeleteButton;
