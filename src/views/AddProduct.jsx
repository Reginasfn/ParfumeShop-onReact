import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Header from '../components/Header'

function AddProduct({ user, onLogout, isEdit = false }) {
  const { productId } = useParams()
  const navigate = useNavigate()
  
  const [formData, setFormData] = useState({
    name_product: '',
    id_brand: '',
    id_concentrat: '',
    description_product: '',
    volume_product: '',
    price_product: '',
    discount: '',
    gender_product: 'Unisex',
    image: 'notf',
    status: 0
  })
  const [brands, setBrands] = useState([])
  const [concentrats, setConcentrats] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [imageFile, setImageFile] = useState(null)

  // Загрузка брендов и данных товара (если редактирование)
  useEffect(() => {
    fetchBrands()
    fetchConcentrats()
    if (isEdit && productId) {
      fetchProduct()
    }
  }, [])

  const fetchBrands = async () => {
    try {
      const res = await fetch('http://127.0.0.1:8000/api/products/brands/list')
      if (res.ok) setBrands(await res.json())
    } catch (err) { console.error(err) }
  }

  const fetchConcentrats = async () => {
    try {
      const res = await fetch('http://127.0.0.1:8000/api/products/concentrats/list')
      if (res.ok) setConcentrats(await res.json())
    } catch (err) { console.error(err) }
  }

  const fetchProduct = async () => {
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/products/${productId}`)
      if (res.ok) {
        const data = await res.json()
        setFormData({
          name_product: data.name_product || '',
          id_brand: data.brand?.id_brand || '',
          id_concentrat: data.concentrat?.id_concentrat || '',
          description_product: data.description_product || '',
          volume_product: data.volume_product || '',
          price_product: data.price_product || '',
          discount: data.discount || '',
          gender_product: data.gender_product || 'Unisex',
          image: data.image || 'notf.jpg',
          status: data.status ?? 0
        })
      }
    } catch (err) { setError('Не удалось загрузить товар') }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImageFile(file)
      setFormData(prev => ({ ...prev, image: file.name }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
    // 🔹 ВАЛИДАЦИЯ ПОЛЕЙ
    
    // 1. Проверка обязательных полей
    if (!formData.name_product.trim()) {
      throw new Error('Введите название парфюма')
    }
    if (!formData.id_brand) {
      throw new Error('Выберите бренд')
    }
    if (!formData.id_concentrat) {
      throw new Error('Выберите концентрацию')
    }
    if (!formData.volume_product || formData.volume_product <= 0) {
      throw new Error('Объём должен быть больше 0')
    }
    if (!formData.price_product || formData.price_product <= 0) {
      throw new Error('Цена должна быть больше 0 ₽')
    }
    
    // 2. Проверка скидки: не может быть 100% или больше
    const discount = formData.discount ? Number(formData.discount) : 0
    if (discount < 0) {
      throw new Error('Скидка не может быть отрицательной')
    }
    if (discount >= 100) {
      throw new Error('Скидка не может быть 100% или больше')
    }
    
    // 3. Проверка: цена со скидкой не должна быть 0
    const finalPrice = formData.price_product * (1 - discount / 100)
    if (finalPrice <= 0) {
      throw new Error('Цена со скидкой не может быть 0 ₽')
    }
    
    // 4. Проверка статуса
    const status = Number(formData.status)
    if (status !== 0 && status !== 1) {
      throw new Error('Неверный статус товара')
    }

      // 🔹 Подготовка данных
      const payload = {
        ...formData,
        id_brand: Number(formData.id_brand),
        id_concentrat: Number(formData.id_concentrat),
        volume_product: Number(formData.volume_product),
        price_product: Number(formData.price_product),
        discount: formData.discount ? Number(formData.discount) : 0,
        status: Number(formData.status)
      }

      const url = isEdit 
        ? `http://127.0.0.1:8000/api/products/${productId}`
        : 'http://127.0.0.1:8000/api/products/'
      
      const method = isEdit ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (!response.ok) throw new Error('Не удалось сохранить')
      navigate('/')
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
        <h2>{isEdit ? 'Редактирование товара' : 'Добавление товара'}</h2>
        
        {error && <p className="error">{error}</p>}
        
        <form onSubmit={handleSubmit} className="product-form">
          <div className="form-group">
            <label>Наименование парфюма *</label>
            <input name="name_product" value={formData.name_product} onChange={handleChange} required />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Бренд *</label>
              <select name="id_brand" value={formData.id_brand} onChange={handleChange} required>
                <option value="">Выберите бренд</option>
                {brands.map(b => (
                  <option key={b.id_brand} value={b.id_brand}>{b.name_brand}</option>
                ))}
              </select>
            </div>
            
            {/* 🔹 Поле для концентрации */}
            <div className="form-group">
              <label>Концентрация *</label>
              <select name="id_concentrat" value={formData.id_concentrat} onChange={handleChange} required>
                <option value="">Выберите концентрацию</option>
                {concentrats.map(c => (
                  <option key={c.id_concentrat} value={c.id_concentrat}>{c.name_concentrat}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="form-group">
            <label>Описание</label>
            <textarea name="description_product" value={formData.description_product} onChange={handleChange} rows="3" />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Объём (мл) *</label>
              <input type="number" name="volume_product" value={formData.volume_product} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Цена (₽) *</label>
              <input type="number" name="price_product" value={formData.price_product} onChange={handleChange} required />
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Скидка (%)</label>
              <input type="number" name="discount" value={formData.discount} onChange={handleChange} min="0" max="100" />
            </div>
            <div className="form-group">
              <label>Пол</label>
              <select name="gender_product" value={formData.gender_product} onChange={handleChange}>
                <option value="Women">Женский</option>
                <option value="Men">Мужской</option>
                <option value="Unisex">Унисекс</option>
              </select>
            </div>
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Статус</label>
              <select name="status" value={formData.status} onChange={handleChange}>
                <option value="0">Активен</option>
                <option value="1">Неактивен</option>
              </select>
            </div>
          </div>
          
          <div className="form-group">
            <label>Изображение (имя файла)</label>
            <input type="text" name="image" value={formData.image} onChange={handleChange} placeholder="notf.jpg" />
            <small>Файл должен лежать в public/products/</small>
          </div>
          
          <div className="form-actions">
            <button type="submit" className="btn-save" disabled={loading}>
              {loading ? 'Сохранение...' : 'Сохранить'}
            </button>
            <button type="button" className="btn-cancel" onClick={() => navigate('/')}>
              ✕ Отмена
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}

export default AddProduct