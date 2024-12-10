import productmodel from "../Model/product.model.js";
import cartmodel from "../Model/Cart.model.js";
import mongoose from "mongoose";



export function createProduct(req, res) {
    // Destructure the incoming data from request body
    const { name, description, price, stockquantity } = req.body;

    // Check if all required fields are provided
    if (!name || !description || !price || !stockquantity) {
        return res.status(400).json({ error: "All fields are required" });
    }

    // Create a new product instance
    const newProduct = new productmodel({
        name: name,
        price: price,
        description: description,
        stockquantity: stockquantity,
    });

    // Save the new product to the database
    newProduct.save()
        .then(data => {
            if (!data) {
                return res.status(404).send("Something went wrong, product not saved.");
            }
            res.status(201).json(data);  // Send the created product as response
        })
        .catch(err => {
            // Handle database or any other errors
            console.error(err);
            res.status(500).json({ error: "Internal Server Error", details: err.message });
        });
}
    


export async function createCart(req, res) {
    try {
        const { productID, quantity } = req.body;

        // Validate product existence
        const product = await productmodel.findById(productID);
        if (!product) {
            return res.status(404).json({ error: "Product not found" });
        }

        // Save product details in the cart
        const cartItem = new cartmodel({
            productID,
            quantity,
            name: product.name,
            description: product.description,
            price: product.price,
        });

        const savedItem = await cartItem.save();

        res.status(201).json({ message: "Product added to cart", data: savedItem });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
};

export async function getproduct(req, res) {
    try {
        const productdata = await productmodel.find(); // Wait for the data to be fetched
        res.status(200).json({ data: productdata }); // Send the data as a JSON response
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
};

export async function getproductByid(req, res) {
    try {
        const { id } = req.params; // Get the product ID from the request parameters
        const product = await productmodel.findById(id); // Fetch the product by ID

        if (!product) {
            return res.status(404).json({ error: "Product not found" }); // If no product is found
        }

        res.status(200).json({ data: product }); // Return the found product
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error", details: error.message }); // Handle any server errors
    }
};

export async function updatequantiycart(req, res) {
    try {
        const productId = req.params.id; // Get product ID from request parameters
        const { quantity } = req.body; // Get the new quantity from the request body

        // Validate productId format
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ message: "Invalid product ID format" });
        }

        // Find the cart item by ID
        const cartItem = await cartmodel.findById(productId);

        if (!cartItem) {
            return res.status(404).json({ message: "Cart item not found" });
        }

        // Update the quantity
        cartItem.quantity = quantity;

        // Save the updated cart item
        const updatedCart = await cartItem.save();

        res.status(200).json({ message: "Cart updated successfully", data: updatedCart });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
}

export async function deletecart(req, res) {
    try {
        const cartId = req.params.id; // Get cart ID from request parameters

        // Find and delete the cart item
        const deletedCart = await cartmodel.findByIdAndDelete(cartId);

        // If the cart item does not exist
        if (!mongoose.Types.ObjectId.isValid(cartId)) {
            return res.status(404).json({ message: "Cart item not found" });
        }

        res.status(200).json({ message: "Cart item deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", details: error.message });
    }
}


