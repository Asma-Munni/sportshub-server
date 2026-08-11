import { Router } from "express";
import categoryRouter from "../services/category/category.route.js";
import wishlistRouter from "../services/wishlist/wishlist.route.js";
import productRouter from "../services/product/product.route.js";
import orderRouter from "../services/order/order.route.js";
import userRouter from "../services/user/user.route.js";

const router = Router();

// Temporary test route
router.get("/test", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Main router is working",
  });
});

router.use("/categories", categoryRouter);
router.use("/products", productRouter);
router.use("/wishlist", wishlistRouter);

export default router;