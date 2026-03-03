import { useState, useEffect } from 'react'
import Header from '../components/Header'
import { useNavigate } from 'react-router-dom'
import ProductCard from '../components/ProductCard'

function MainPage({ user, onLogout }) {
  const [products, setProducts] = useState([])
  const [brands, setBrands] = useState([])  // ← Добавили состояние для брендов
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

    // 🔹 Состояния для фильтров (по умолчанию пустые = все товары)
  const [search, setSearch] = useState('')
  const [selectedBrand, setSelectedBrand] = useState('')
  const [sortBy, setSortBy] = useState('')

  const navigate = useNavigate();
  useEffect(() => { fetchBrands() }, [])
  useEffect(() => { fetchProducts() }, [search, selectedBrand, sortBy])

  const fetchProducts = async () => {
    setLoading(true)



    try {
      const params = new URLSearchParams()
      if (search.trim()) params.append('search', search.trim())
      if (selectedBrand) params.append('brand_id', selectedBrand)
      if (sortBy) params.append('sort', sortBy)
        
      // 🔹 Если params пустой — запрос будет /api/products/ (все товары)
      const queryString = params.toString()
      const url = `http://127.0.0.1:8000/api/products/${queryString ? '?' + queryString : ''}`
      
      const response = await fetch(url)
      if (!response.ok) throw new Error('Не удалось загрузить товары')
      
      const data = await response.json()
      setProducts(data)
    } catch (err) { setError(err.message) }
    finally { setLoading(false) }
  }

  const fetchBrands = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/products/brands/list')
      if (response.ok) {
        const data = await response.json()
        setBrands(data)
      }
    } catch (err) {
      console.error('Не удалось загрузить бренды:', err)
    }
  }

  // 🔹 Удаление товара
  // 🔹 Удаление товара (без тостов, через alert)
    const handleDelete = async (productId) => {
    if (!window.confirm('Удалить этот товар?')) return

    try {
        const res = await fetch(`http://127.0.0.1:8000/api/products/${productId}`, { 
        method: 'DELETE' 
        })
        
        // 🔹 Обработка статусов через alert
        if (res.status === 409) {
        alert('⚠️ Товар нельзя удалить: он присутствует в заказе')
        return
        }
        
        if (res.status === 404) {
        alert('❌ Товар не найден')
        return
        }
        
        if (!res.ok) {
        throw new Error('Не удалось удалить товар')
        }
        
        // ✅ Успех
        alert('✅ Товар удалён')
        fetchProducts() // Перезагружаем список
        
    } catch (err) {
        alert('❌ Ошибка: ' + err.message)
    }
    }

  // 🔹 Переход на редактирование
  const handleEdit = (productId) => {
    navigate(`/edit-product/${productId}`)
  }

  // 🔹 Переход на добавление
  const handleAdd = () => {
    navigate('/add-product')
  }

  // 🔹 Сброс всех фильтров
  const resetFilters = () => { setSearch(''); setSelectedBrand(''); setSortBy('') }

  return (
    <div className="main-page">
      <Header user={user} onLogout={onLogout} onAdd={handleAdd} />

      <main className="content">
        <h2>Каталог товаров</h2>
        <span className="count-products">{products.length} товаров</span>
        
        {/* ПОЛЯ ПОИСКА, ФИЛЬТРАЦИИ, СОРТИРОВКИ (просто UI, без логики) */}
        <div className="filters-bar">
          {/* Поиск по названию */}
          <input
            type="text"
            placeholder="Поиск по названию..."
            className="filter-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          
          {/* Фильтр по бренду */}
          <select 
            className="filter-select"
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
            >
            <option value="">Все бренды</option>
            {brands.map(brand => (
              <option key={brand.id_brand} value={brand.id_brand}>
                {brand.name_brand}
              </option>
            ))}
          </select>
          
          {/* Сортировка по цене */}
          <select 
            className="filter-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            >
            <option value="">По умолчанию</option>
            <option value="price_asc">По возрастанию ↑</option>
            <option value="price_desc">По убыванию ↓</option>
          </select>

          {/* Кнопка сброса */}
          {(search || selectedBrand || sortBy) && (
            <button className="btn-reset" onClick={resetFilters}>
              Сбросить
            </button>
          )}
        </div>
 
        {!loading && !error && products.length === 0 && <p className="no-products">Товаров не найдено</p>}
        
        {/* Список товаров */}
        {!loading && !error && products.length > 0 && (
          <div className="products-grid">
            {products.map((product) => (
              <ProductCard 
                key={product.id_product} 
                product={product}
                isAdmin={user?.role === 1}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

export default MainPage

