// import { useState } from "react";
// import "./assets/styles/App.css";
// import Search from './pages/Search'
// import Navbar from './components/Navbar.tsx'
import { RouterProvider } from "react-router-dom";

import AppRoutes from "./routes";
function App() {
  // const [data, setData] = useState(null);

  return (
    <div className="App">
      <RouterProvider router={AppRoutes} />
    </div>
  );
}

export default App;
