import { useState } from 'react'
import './assets/styles/App.css'
import Search from './pages/Search'
import Navbar from './components/Navbar.tsx'
function App() {
  const [data, setData] = useState(null);

  return (
    <>
      <Navbar />
      <Search />
    </>
  )
}

export default App
