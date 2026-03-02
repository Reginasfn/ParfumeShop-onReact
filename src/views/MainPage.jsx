import { useState, useEffect } from 'react'
import Header from '../components/Header'
import ProductCard from '../components/ProductCard'

function MainPage({ user, onLogout }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Загружаем товары при открытии страницы
  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/products/')
      
      if (!response.ok) {
        throw new Error('Не удалось загрузить товары')
      }
      
      const data = await response.json()
      setProducts(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="main-page">
      <Header user={user} onLogout={onLogout} />

      <main className="content">
        <h2>Каталог товаров</h2>
        <span className="count-products">{products.length} товаров</span>
        
        {/* Если загрузка */}
        {loading && <p className="loading">Загрузка товаров...</p>}
        
        {/* Если ошибка */}
        {error && <p className="error">{error}</p>}
        
        {/* Если товаров нет */}
        {!loading && !error && products.length === 0 && (
          <p className="no-products">Товаров пока нет</p>
        )}
        
        {/* Список товаров */}
        {!loading && !error && products.length > 0 && (
          <div className="products-grid">
            {products.map((product) => (
              <ProductCard key={product.id_product} product={product} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

export default MainPage

