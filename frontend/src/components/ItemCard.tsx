import React, { useState } from 'react';

interface Data {
    department: string;
    text: string;
}

const ItemCard = (props: Data) => {
    const [department, setDepartment] = useState('');

    // Function to capitalize the first letter
    const capitalizeFirstLetter = (str: string) => {
        return str.charAt(0).toUpperCase() + str.slice(1);
    };

    return (
        <div className="card bg-base-100 shadow-xl w-3/4 my-4">
            <h2 className="card-title">Department: { capitalizeFirstLetter(props.department) }</h2>
            <div className="card-body">
                <p>{props.text}</p>
            </div>
            <div>

            </div>
        </div>
    );
};

export default ItemCard;