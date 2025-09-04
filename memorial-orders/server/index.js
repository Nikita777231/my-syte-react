import express from "express";
import cors from "cors";
import multer from "multer";
import ordersRoutes from "./routes/orders.js";

const app = express();
const PORT = 5000;

// middlewares
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// multer для загрузки файлов
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// маршруты
const orderRoutes = require('./controllers/orderController');
app.use("/api/orders", ordersRoutes(upload));

app.listen(PORT, () => {
  console.log(`✅ Сервер запущен: http://localhost:${PORT}`);
});
