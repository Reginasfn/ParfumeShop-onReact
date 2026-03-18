// 👇 1. ДОБАВЬТЕ useNavigate В ИМПОРТ
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"  // 👈 ВОТ ЭТО!
import Header from "../components/Header"
import CartItemCard from "../components/CartItemCard"

function CartPage({ user, onLogout }) {
  
  // 👇 2. ОБЪЯВИТЕ navigate СРАЗУ ПОСЛЕ СТЭЙТОВ
  const [cartItems, setCartItems] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()  // 👈 ВОТ ЭТО!

  useEffect(() => {
    if (!user?.email_user) return
    fetchCart()
  }, [user])

  // 👇 3. ТЕПЕРЬ ЭТА ФУНКЦИЯ БУДЕТ РАБОТАТЬ
  const handleOrders = () => navigate('/orders')

  // ... остальной код без изменений ...

  const fetchCart = async () => {

    try {

      const response =
        await fetch(`http://127.0.0.1:8000/api/cart/${user.email_user}`)

      const data = await response.json()

      setCartItems(data)

    } catch {

      alert("Ошибка загрузки корзины")

    } finally {

      setLoading(false)

    }

  }


  const updateQuantity = async (productId, quantity) => {

    const response = await fetch(
      "http://127.0.0.1:8000/api/cart/update",
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email_user: user.email_user,
          id_product: productId,
          quantity: quantity
        })
      }
    )

    if (response.ok) fetchCart()
  }


  const removeItem = async (productId) => {

    const response = await fetch(
      "http://127.0.0.1:8000/api/cart/remove",
      {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email_user: user.email_user,
          id_product: productId
        })
      }
    )

    if (response.ok) fetchCart()
  }


  const clearCart = async () => {

    for (const item of cartItems) {

      await removeItem(item.id_product)

    }

  }


  const createOrder = async () => {

    const response = await fetch(
      "http://127.0.0.1:8000/api/orders/create",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email_user: user.email_user
        })
      }
    )

    if (response.ok) {

      alert("Вы успешно оформили заказ!")

      fetchCart()

    }

  }


  const totalPrice = cartItems.reduce((sum, item) => {

    const discount = item.discount_percent || 0

    const discountedPrice =
      item.price_product * (1 - discount / 100)

    return sum + discountedPrice * item.quantity

  }, 0)


  const totalWithoutDiscount = cartItems.reduce((sum, item) => {

    return sum + item.price_product * item.quantity

  }, 0)


  const totalSaving =
    totalWithoutDiscount - totalPrice


  const totalCount = cartItems.reduce(
    (sum, item) => sum + item.quantity,
    0
  )


  return (

    <div className="cart-page">

      <Header 
        user={user}
        onLogout={onLogout}
        onCart={() => navigate('/cart')}
        onOrders={() => navigate('/orders')}
        onAdd={() => navigate('/add-product')}
      />

      <main className="content">

        <h2 className="cart-title">
          Корзина
        </h2>

        {loading && <p>Загрузка...</p>}

        {!loading && cartItems.length === 0 && (
          <p>Корзина пуста</p>
        )}

        {!loading && cartItems.length > 0 && (

          <div className="cart-layout">

            <div className="cart-products">

              {cartItems.map(item => (

                <CartItemCard
                  key={item.id_product}
                  item={item}
                  updateQuantity={updateQuantity}
                  removeItem={removeItem}
                />

              ))}

            </div>


            <div className="cart-summary">

              <h3>
                Итог заказа
              </h3>

              <div className="summary-row">

                <span>Товаров</span>

                <span>{totalCount}</span>

              </div>


              <div className="summary-row">

                <span>Без скидки</span>

                <span>{Math.round(totalWithoutDiscount)} ₽</span>

              </div>


              <div className="summary-row total">

                <span>Итого</span>

                <span className="summary-price">
                  {Math.round(totalPrice)} ₽
                </span>

              </div>


              <button
                className="btn-order"
                onClick={createOrder}
              >
                Оформить заказ
              </button>


              <button
                className="btn-clear-cart"
                onClick={clearCart}
              >
                Очистить корзину
              </button>

            </div>

          </div>

        )}

      </main>

    </div>

  )

}

export default CartPage