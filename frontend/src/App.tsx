import { RouterProvider } from "react-router-dom";
import "./index.css";
import AppRoutes from "./routes";
function App() {

  return (
    <div className="App">
      <RouterProvider router={AppRoutes} />
    </div>
  );
}

export default App;
