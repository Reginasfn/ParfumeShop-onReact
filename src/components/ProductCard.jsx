import notFoundImage from '../assets/notf.jpg'
const images = import.meta.glob('../assets/products/*.{jpg,jpeg,png,gif}', { eager: true })

function ProductCard({ product, isAdmin, onEdit, onDelete }) {
  // получения пути к картинке
  const getImageUrl = (imageName) => {
    if (!imageName || imageName === 'notf') {
      return notFoundImage
    }
    const path = `../assets/products/${imageName}`
    const image = images[path]
    if (image && image.default) {
      return image.default
    }
    for (const [key, value] of Object.entries(images)) {
      if (key.includes(imageName)) {
        return value.default
      }
    }

    return notFoundImage
  }
  const imageUrl = getImageUrl(product.image)
  
  // 🔹 Вычисляем скидку и цену
    const discount = product.discount || 0 
    const originalPrice = product.price_product
    const finalPrice = discount > 0 
    ? (originalPrice * (1 - discount / 100)).toFixed(2) 
    : originalPrice
    const hasDiscount = discount > 0

    // const isHighDiscount = discount > 15
    // const isOutOfStock = product.quantity === 0 || product.status === 0

  return (
    <div className="product-card">
      {/* Картинка */}
      <div className="product-image">
        <img 
          src={imageUrl} 
          alt={product.name_product}
          onError={(e) => {
            e.target.src = notFoundImage
            e.target.onerror = null
          }}
        />

        {/* 🔧 КНОПКИ АДМИНА — только если isAdmin=true */}
        {isAdmin && (
          <div className="admin-buttons">
            <button 
              className="btn-admin btn-edit" 
              onClick={(e) => {
                e.stopPropagation()
                onEdit?.(product.id_product)
              }}
              title="Редактировать"
            >
              ✏️
            </button>
            <button 
              className="btn-admin btn-delete" 
              onClick={(e) => {
                e.stopPropagation()
                if (window.confirm('Удалить этот товар?')) {
                  onDelete?.(product.id_product)
                }
              }}
              title="Удалить"
            >
              🗑️
            </button>
          </div>
        )}
        
      </div>

      {/* Информация */}
      <div className="product-info">
        <h3 className="product-name">{product.name_product}</h3>
        
        <p className="product-brand">Бренд: {product.brand?.name_brand || 'Бренд не указан'}</p>
        
        <p className="product-description">Описание: {product.description_product}</p>
        
        <div className="product-details">
          <span className="product-volume">Объём: {product.volume_product} мл</span>
          <span className="product-gender">
            {product.gender_product === 'Women' ? 'Женский' : 
             product.gender_product === 'Men' ? 'Мужской' : 'Унисекс'}
          </span>
        </div>
        
        {/* 🔹 Цена со скидкой */}
        <div className="product-price">
            {hasDiscount ? (
                <>
                {/* Старая цена — с подписью, красная, зачёркнутая */}
                <div className="price-row">
                    <span className="price-original">{originalPrice} ₽</span>
                </div>
                
                {/* Новая цена — с подписью, чёрная, жирная */}
                <div className="price-row">
                    <span className="price-final">{finalPrice} ₽</span>
                </div>
                </>
            ) : (
                /* Обычная цена без скидки */
                <div className="price-row">
                    <span className="price-final">{originalPrice} ₽</span>
                </div>
            )}
        </div>
      </div>
    </div>
  )
}

export default ProductCard