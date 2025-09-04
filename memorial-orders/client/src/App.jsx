import { Routes, Route } from "react-router-dom";
import OrderForm from "./components/OrderForm";
import OrderList from "./components/OrderList";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<OrderForm />} />
      <Route path="/orders" element={<OrderList orders={[]} />} />
    </Routes>
  );
}
