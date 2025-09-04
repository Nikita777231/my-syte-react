import OrderForm from '../components/OrderForm';
import { priceConfig } from '../config/price';

export default function Create() {
    const handleCreate = (create) => console.log('Заказ создан', order);
    return (
        <>
        <h1>Создать новый заказ</h1>
        <OrderForm priceConfig = {priceConfig} onSubmit={handleCreate}/>
        </>
    );
}