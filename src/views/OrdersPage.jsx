import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'  // 👈 Импортируем, не определяем внутри!

function OrdersPage({ user, onLogout }) {
  const navigate = useNavigate()

  // 🔹 Функции-обработчики для кнопок в Header
  const handleCart = () => navigate('/cart')
  const handleOrders = () => navigate('/orders')
  const handleAdd = () => navigate('/add-product')

  return (
    <div className="orders-page">
      {/* 👈 Передаём onOrders в Header */}
      <Header 
        user={user} 
        onLogout={onLogout} 
        onCart={handleCart} 
        onOrders={handleOrders} 
        onAdd={handleAdd} 
      />

      <main className="content">
        <h1>Мои заказы</h1>
        {/* Здесь будет список заказов */}
        <p>Страница заказов в разработке...</p>
      </main>
    </div>
  )
}

export default OrdersPage