import { Link } from "react-router-dom"

function Header({ user, onLogout, onAdd, onCart }) {

  const getRoleName = (role) => {
    const roles = {
      0: 'Гость',
      1: 'Админ',
      2: 'Авторизированный клиент'
    }
    return roles[role] || 'Пользователь'
  }

  return (
    <header className="header">

      {/* КЛИКАБЕЛЬНЫЙ ЛОГОТИП */}
      <div className="header-left">
        <Link to="/" className="logo-link">
          <h1>Parfume Shop</h1>
        </Link>
      </div>

      <div className="header-user">
        <span className="user-name">
          {getRoleName(user.role)}: {user.name_user}
        </span>
      </div>

      <div className="header-right">

        {user.role === 2 && (
          <button className="btn-cart" onClick={onCart}>
            🛒 Корзина
          </button>
        )}

        {user.role === 1 && onAdd && (
          <button className="btn-add" onClick={onAdd}>
            + Добавить
          </button>
        )}

        <button className="btn-back" onClick={onLogout}>
          Выйти ⇨
        </button>

      </div>
    </header>
  )
}

export default Header