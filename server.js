import express from "express";
import mongoose from "mongoose";
import { routes } from "./Routes/product.routes.js"


mongoose.connect("mongodb://localhost:27017");

const db = mongoose.connection;



const app = new express();

app.use(express.json());

app.listen(3000, () => {
    console.log("Server is runnig on port 3000");
});

db.on("open" , () => {
    console.log("Mongosse is Connect Successfully");
});

db.on("error" , () => {
    console.log("Mongosse is not Connect");
});


routes(app);







