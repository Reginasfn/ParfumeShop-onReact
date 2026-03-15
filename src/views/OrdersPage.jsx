import { useEffect, useState } from "react"
import Header from "../components/Header"

function OrdersPage({ user, onLogout }) {

  const [orders, setOrders] = useState([])

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {

    const response = await fetch(`http://127.0.0.1:8000/api/orders/${user.email_user}`)

    const data = await response.json()

    setOrders(data)
  }

  return (

    <div>

      <Header user={user} onLogout={onLogout} />

      <main className="content">

        <h2>Мои заказы</h2>

        {orders.map(order => (

          <div key={order.id_order} className="order-card">

            <h3>Заказ №{order.id_order}</h3>

            <p>Дата: {order.datetime_order}</p>

            <p>Сумма: {order.cost} ₽</p>

          </div>

        ))}

      </main>

    </div>
  )
}

export default OrdersPage