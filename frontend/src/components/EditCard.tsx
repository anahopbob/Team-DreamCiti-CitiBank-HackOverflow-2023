import React, { useState } from 'react';
import DeleteButton from './DeleteButton';
interface Data {
    ObjectID: string;
    department: string | null;
    name: string;
    upvotes: number;
    downvotes: number;
    url: string;
}

const EditCard = (props: Data) => {

    const openLink = () => {
        // Specify the URL you want to open in the new window/tab
        const url = props.url;
        // Open the new window/tab
        window.open(url, '_blank');
      };
    // Function to capitalize the first letter
    // const capitalizeFirstLetter = (str: string) => {
    //     return str.charAt(0).toUpperCase() + str.slice(1);
    // };
    

    return (
        <div className="card bg-base-100 shadow-xl my-4 border">
            <h2 className="card-title ml-4 mt-4">Department: { props.department }</h2>
            <div className="card-body">
                <p>
                    <span className=' font-bold'>
                        Document Name:
                    </span> 
                    <span className='px-4'>
                        {props.name}
                    </span>
                </p>
                <p className="">
                    <span className=' font-bold'>
                        Votes: 
                    </span> 
                    <span className='px-4'>
                        {props.upvotes - props.downvotes}
                    </span>
                </p>
            </div>
            <div className='flex justify-end mx-20 mb-10'>
                <button className="btn btn-outline mx-4" onClick={openLink}>Go To</button>
                <DeleteButton ObjectID={props.ObjectID}/>
            </div>
        </div>
    );
};

export default EditCard;