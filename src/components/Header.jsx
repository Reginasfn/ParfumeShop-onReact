function Header({ user, onLogout }) {
  // Роли: 0=гость, 1=админ, 2=менеджер, 3=клиент
  const getRoleName = (role) => {
    const roles = {
      0: 'Гость',
      1: 'Админ',
      2: 'Авторизированный клиент'
    }
    return roles[role] || 'Пользователь'
  }

  // Обработка кнопки "Добавить"
  const handleAdd = () => {
    alert('Здесь будет форма добавления товара')
  }

  return (
    <header className="header">
      {/* Слева — название магазина */}
      <div className="header-left">
        <h1>Parfume Shop</h1>
      </div>

      <div className="header-user">
        <span className="user-name">{getRoleName(user.role)}: {user.name_user}</span>
      </div>

      {/* Справа — кнопки */}
      <div className="header-right">
        {user.role === 1 && (
          <button className="btn-add" onClick={handleAdd}>
            + Добавить
          </button>
        )}
        
        {/* Кнопка "Назад" (выйти) */}
        <button className="btn-back" onClick={onLogout}>
          ← Назад
        </button>
      </div>
    </header>
  )
}

export default Header