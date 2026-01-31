const express = require('express');
const multer = require('multer');
const moongoose = require('mongoose'); 
const env = require('dotenv').config();
const app = express();
const port = 3000;

app.use(express.json());

moongoose.connect('mongodb+srv://admin:frmoC7ynruZdIARX@cluster0.zqs7qjl.mongodb.net/?appName=Cluster0',)
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Could not connect to MongoDB...', err));

  Schema = moongoose.Schema;
const productSchema = new Schema({
name:{ type: String, required: true },
price: { type: Number, required: true },
category: { type: String, required: true },
description: { type: String, required: true },
});
const Product = moongoose.model('Product', productSchema);

app.post('/createProduct', async (req, res) => {
  try {
    const newProduct = new Product(req.body);
    const savedProduct = await newProduct.save();
    res.status(201).json({message: 'Product created successfully', product: savedProduct });
  } catch (error) {
    res.status(500).json({ message: 'Error creating product', error: error.message });
  }
});

app.delete('/deleteProduct/:id', async (req, res) => {
  try {
    const {id} = req.params;
    await Product.findByIdAndDelete(id);
    res.json({ message: 'Product deleted successfully' });
  } catch (error) { 
    res.status(500).json({ message: 'Error deleting product', error: error.message });
  }
});

app.put('/updateProduct/:id', async (req, res) => {
  try {
    const {id} = req.params;
    const updatedProduct = await Product.findByIdAndUpdate(id, req.body, { new: true });
    res.json({ message: 'Product updated successfully', product: updatedProduct });
  } catch (error) {
    res.status(500).json({ message: 'Error updating product', error: error.message });
  }
});

app.get('/all-Product', async (req, res) => {
  try {
    const allProducts = await Product.find();
    res.json({ products: allProducts });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error: error.message});
  }
});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});