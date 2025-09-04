import express from "express";
import {
  getOrders,
  createOrder,
  uploadFile,
  getOrderById
} from "../controllers/ordersController.js";

export default function (upload) {
  const router = express.Router();

  router.get("/", getOrders);
  router.get("/:id", getOrderById);           // GET все заказы
  router.post("/", createOrder);        // POST новый заказ
  router.post("/upload", upload.single("file"), uploadFile); // POST загрузка файла

  return router;
}
