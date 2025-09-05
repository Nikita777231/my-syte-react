import { useState } from 'react';
import PageLayout from '../components/PageLayout';

const Create = () => {
  const [showPhotoUpload, setShowPhotoUpload] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const stoneTypes = [
      'Гранит',
      'Мрамор',
      'Базальт',
      'Песчаник',
      'Известняк',
      'Кварцит',
      'Габбро',
      'Лабрадорит',
      'Оникс',
      'Травертин'
  ];

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    
    // Добавляем все поля формы
    const formElements = e.target.elements;
    formData.append('stone_type', formElements.stone_type.value);
    formData.append('size_label', formElements.size_label.value);
    formData.append('custom_height', formElements.custom_height.value);
    formData.append('custom_width', formElements.custom_width.value);
    formData.append('production_method', formElements.production_method.value);
    formData.append('fio', formElements.fio.value);
    formData.append('epitaph', formElements.epitaph.value);
    formData.append('flowers_or_candle', formElements.flowers_or_candle.value);
    formData.append('date_from', formElements.date_from.value);
    formData.append('date_to', formElements.date_to.value);
    formData.append('flowerbed', formElements.flowerbed.checked);
    formData.append('stand', formElements.stand.checked);
    formData.append('applied_cross', formElements.applied_cross.checked);
    formData.append('applied_photo', formElements.applied_photo.checked);
    formData.append('price_total', formElements.price_total.value);
    
    // Если фото выбрано, добавляем его
    if (selectedFile) {
      formData.append('photo', selectedFile);
    }

    // Отправка на сервер
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        body: formData
      });
      
      if (response.ok) {
        alert('Заказ успешно создан!');
        e.target.reset();
        setSelectedFile(null);
        setShowPhotoUpload(false);
      } else {
        alert('Ошибка при создании заказа');
      }
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Ошибка при создании заказа');
    }
  };

  return (
    <PageLayout title="Создать заказ">
      <form className="create-form" onSubmit={handleSubmit}>
        {/* Основная информация */}
        <div className="form-group">
          <label htmlFor="stone_type">Тип камня *</label>
          <select 
            id="stone_type"
            name="stone_type" 
            required
            className="form-select"
          >
            <option value="">Выберите тип камня</option>
            {stoneTypes.map((stone, index) => (
              <option key={index} value={stone}>
                {stone}
              </option>
            ))}
          </select>
        </div>
        
        <input type="text" placeholder="Размер (лейбл)*" name="size_label" required />
        <input type="number" placeholder="Высота (см)" name="custom_height" />
        <input type="number" placeholder="Ширина (см)" name="custom_width" />
        <input type="text" placeholder="Метод производства*" name="production_method" required />
        
        {/* Информация о клиенте */}
        <input type="text" placeholder="ФИО клиента*" name="fio" required />
        <textarea placeholder="Эпитафия" name="epitaph" rows="3" />
        <input type="text" placeholder="Цветы/свеча" name="flowers_or_candle" />
        
        {/* Даты */}
        <input type="date" placeholder="Дата от" name="date_from" />
        <input type="date" placeholder="Дата до" name="date_to" />
        
        {/* Дополнительные услуги */}
        <div className="checkbox-group">
          <label>
            <input type="checkbox" name="flowerbed" />
            Клумба
          </label>
          <label>
            <input type="checkbox" name="stand" />
            Столик
          </label>
          <label>
            <input type="checkbox" name="applied_cross" />
            Накладной крест
          </label>
          <label>
            <input 
              type="checkbox" 
              name="applied_photo" 
              onChange={(e) => setShowPhotoUpload(e.target.checked)}
            />
            Фотография
          </label>
        </div>

        {/* Поле для загрузки фото (появляется при активации чекбокса) */}
        {showPhotoUpload && (
          <div className="photo-upload">
            <label htmlFor="photo-upload" className="upload-label">
              Выберите фотографию *
            </label>
            <input
              id="photo-upload"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              required={showPhotoUpload}
            />
            {selectedFile && (
              <div className="file-info">
                Выбрано: {selectedFile.name}
              </div>
            )}
          </div>
        )}
        
        {/* Цена */}
        <input type="number" placeholder="Общая стоимость (руб)*" name="price_total" required />
        
        <button type="submit">Создать заказ</button>
      </form>
    </PageLayout>
  );
};

export default Create;