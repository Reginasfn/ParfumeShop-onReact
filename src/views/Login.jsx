import { useState } from 'react'

function Login({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Функция входа
  const handleLogin = async (isGuest = false) => {
    setError('')
    setLoading(true)

    try {
      // Отправляем запрос на backend
      const response = await fetch('http://127.0.0.1:8000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email_user: isGuest ? 'guest' : email,
          password_user: isGuest ? '' : password,
        }),
      })

      if (!response.ok) {
        throw new Error('Неверный email или пароль')
      }

      const data = await response.json()
      onLogin(data) // Передаём данные пользователя в App
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-box">
        <h2>Parfume Shop</h2>
        

        {error && <div className="error">{error}</div>}

        <div className="form-group">
          <label>Логин:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your email"
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label>Пароль:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            disabled={loading}
          />
        </div>

        <button 
          className="btn-login"
          onClick={() => handleLogin(false)}
          disabled={loading}
        >
          {loading ? 'Проверка...' : 'Войти'}
        </button>

        <button 
          className="btn-guest"
          onClick={() => handleLogin(true)}
          disabled={loading}
        >
          Войти как гость
        </button>
      </div>
    </div>
  )
}

export default Login