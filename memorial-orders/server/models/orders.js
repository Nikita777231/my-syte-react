import express from "express";
import {
  getOrders,
  createOrder,
  uploadFile,
  getOrderById
} from "../controllers/ordersController.js";


const router = express.Router();

router.get("/", getOrders);
router.get("/:id", getOrderById);
router.post("/", createOrder);

export default router;