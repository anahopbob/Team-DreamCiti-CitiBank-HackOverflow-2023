// import { useState } from 'react'
import "./App.css";
import { RouterProvider } from "react-router-dom";

import AppRoutes from "../routes";
function App() {
  // const [data, setData] = useState(null);

  // const search = () => {
  //   // Define the API endpoint URL
  //   const apiUrl = 'http://127.0.0.1:8000/search/?department=finance&query=123131'; // Replace with your API endpoint
  //   // Make the API call
  //   fetch(apiUrl)
  //     .then((response) => response.json())
  //     .then((responseData) => setData(responseData))
  //     .catch((error) => console.error('Error fetching data:', error));
  // };
  return (
    <div className="App">
      <RouterProvider router={AppRoutes} />
    </div>
    // <>
    //   <div>
    //     TESTING APIS
    //   </div>
    //   <div>
    //     <button onClick={search}>Data is:{JSON.stringify(data, null, 2)}</button>
    //   </div>
    // </>
  );
}

export default App;
