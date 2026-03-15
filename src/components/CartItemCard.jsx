import { useState } from "react"
import notFoundImage from '../assets/notf.jpg'

const images = import.meta.glob('../assets/products/*.{jpg,jpeg,png,gif}', { eager: true })

function CartItemCard({ item, updateQuantity, removeItem }) {

  const [removing, setRemoving] = useState(false)

  const getImageUrl = (imageName) => {

    if (!imageName || imageName === 'notf') {
      return notFoundImage
    }

    const path = `../assets/products/${imageName}`

    const image = images[path]

    if (image && image.default) {
      return image.default
    }

    return notFoundImage
  }

  const imageUrl = getImageUrl(item.image)

  const discount = item.discount_percent || 0
  const price = item.price_product || 0

  const discountedPrice =
    Math.round(price * (1 - discount / 100))

  const totalItemPrice =
    discountedPrice * item.quantity


  const increase = () => {

    if (item.quantity >= item.stock) return

    updateQuantity(item.id_product, item.quantity + 1)
  }


  const decrease = () => {

    if (item.quantity === 1) {
      handleRemove()
    } else {
      updateQuantity(item.id_product, item.quantity - 1)
    }
  }

  const handleRemove = () => {

    setRemoving(true)

    setTimeout(() => {
      removeItem(item.id_product)
    }, 300)

  }


  return (

    <div className={`cart-card ${removing ? "cart-removing" : ""}`}>

      <div className="cart-image">
        <img src={imageUrl} alt={item.name_product} />
      </div>


      <div className="cart-info">

        <h3>{item.name_product}</h3>


        {discount > 0 ? (

          <div className="cart-price">

            <span className="old-price">
              {price} ₽
            </span>

            <span className="discount">
              −{discount}% = 
            </span>

            <span className="new-price">
              {discountedPrice} ₽
            </span>

          </div>

        ) : (

          <p className="cart-price">
            {price} ₽
          </p>

        )}


        <p className="cart-stock">
          На складе: {item.stock ?? 0}
        </p>

        <p className="cart-total">
          Итого: <b>{totalItemPrice} ₽</b>
        </p>

      </div>


      <div className="cart-actions">

        <div className="cart-quantity">

          <button onClick={decrease}>−</button>

          <span>{item.quantity}</span>

          <button
            onClick={increase}
            disabled={item.quantity >= item.stock}
          >
            +
          </button>

        </div>


        <button
          className="btn-remove"
          onClick={handleRemove}
        >
          Удалить
        </button>

      </div>

    </div>

  )

}

export default CartItemCard