import { useState } from 'react'
import './App.css'
import Login from './views/Login'
import MainPage from './views/MainPage'

function App() {
  // Состояние: кто сейчас вошёл (null = никто)
  const [currentUser, setCurrentUser] = useState(null)

  // Если пользователь вошёл — показываем главную
  if (currentUser) {
    return <MainPage user={currentUser} onLogout={() => setCurrentUser(null)} />
  }

  // Иначе — страницу входа
  return <Login onLogin={setCurrentUser} />
}

export default App