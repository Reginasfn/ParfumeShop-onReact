import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useState } from 'react'
import Login from './views/Login'
import MainPage from './views/MainPage'
import AddProduct from './views/AddProduct'
import CartPage from './views/CartPage'
import './App.css'

function App() {
  const [currentUser, setCurrentUser] = useState(null)

  if (!currentUser) {
    return <Login onLogin={setCurrentUser} />
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage user={currentUser} onLogout={() => setCurrentUser(null)} />} />
        <Route 
          path="/add-product" 
          element={<AddProduct user={currentUser} onLogout={() => setCurrentUser(null)} isEdit={false} />} 
        />
        <Route 
          path="/edit-product/:productId" 
          element={<AddProduct user={currentUser} onLogout={() => setCurrentUser(null)} isEdit={true} />} 
        />
        <Route 
          path="/cart" 
          element={<CartPage user={currentUser} onLogout={() => setCurrentUser(null)} />} 
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App