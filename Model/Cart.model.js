import mongoose from "mongoose";


const cartschema = new mongoose.Schema({
    productID: mongoose.Schema.Types.ObjectId,
    quantity: Number,
    name:String,
        description: String,
        price :String,
});


const cartmodel = mongoose.model("cartmodel" , cartschema);


export default cartmodel;