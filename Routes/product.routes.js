// routes.js
import {   createCart, updatequantiycart, getproduct, getproductByid,  deletecart } from "../Controller/Product.controller.js";
import { register , login } from "../Controller/Auth.controller.js";
import { authenticate } from "../middleware/authMiddleware.js";

export function routes(app) {
  // app.post("/api/products", createProduct);
  app.post("/register", register);
  app.post("/login", login);

  // Protected Cart Routes
  app.post("/cart", authenticate, createCart);
  app.put("/cart/:id", authenticate, updatequantiycart);
  app.delete("/cart/:id", authenticate, deletecart);

  app.get("/", getproduct);
  app.get("/product/:id", getproductByid);
}
