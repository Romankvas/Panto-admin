const express = require('express');
const multer = require('multer');
const mongoose = require('mongoose');
const cors = require('cors');
const fs = require('fs');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));


if (!fs.existsSync('uploads')) fs.mkdirSync('uploads');


const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads'),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });


mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ База підключена. API готове до магії.'))
    .catch(err => console.error('❌ Помилка БД:', err));


const Product = mongoose.model('Product', new mongoose.Schema({
    name: String,
    price: Number,
    category: String,
    description: String,
    imageUrl: String
}, { timestamps: true }));




app.get('/', (req, res) => {
    res.send('<!DOCTYPE html><html><head><title>Shop</title></head><body></body></html>');
});


app.get('/admin', (req, res) => {
    res.send('<!DOCTYPE html><html><head><title>Admin Panel</title></head><body style="background:white;"></body></html>');
});




app.get('/api/products', async (req, res) => {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
});

// Створити
app.post('/api/products', upload.single('image'), async (req, res) => {
    const product = await Product.create({
        name: req.body.name,
        price: req.body.price,
        category: req.body.category,
        description: req.body.description,
        imageUrl: req.file ? `/uploads/${req.file.filename}` : ''
    });
    res.status(201).json(product);
});

// Редагувати (тепер він зможе це зробити в адмінці)
app.put('/api/products/:id', upload.single('image'), async (req, res) => {
    const updateData = { ...req.body };
    if (req.file) updateData.imageUrl = `/uploads/${req.file.filename}`;
    const updated = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(updated);
});

// Видалити
app.delete('/api/products/:id', async (req, res) => {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ success: true });
});


app.listen(port, () => {
    console.log(`🚀 Сервер: http://localhost:${port}`);
    console.log(`⚪️ Чиста адмінка: http://localhost:${port}/admin`);
});