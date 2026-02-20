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

if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads'),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});

const upload = multer({ storage });

// =======================
// DATABASE
// =======================

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ База підключена'))
    .catch(err => console.log('❌ Помилка БД:', err));


// MODELS


const Product = mongoose.model('Product', new mongoose.Schema({
    name: String,
    price: Number,
    category: String,
    description: String,
    imageUrl: String
}, { timestamps: true }));

const Order = mongoose.model('Order', new mongoose.Schema({
    customerName: String,
    products: Array,
    totalPrice: Number
}, { timestamps: true }));

const Feedback = mongoose.model('Feedback', new mongoose.Schema({
    name: String,
    message: String
}, { timestamps: true }));

const Category = mongoose.model('Category', new mongoose.Schema({
    name: String
}, { timestamps: true }));

const Social = mongoose.model('Social', new mongoose.Schema({
    platform: String,
    link: String
}, { timestamps: true }));


app.get('/', (req, res) => {
    res.send('<h1>Shop API працює 🚀</h1>');
});

app.get('/admin', (req, res) => {
    res.send('<h1>Admin Panel</h1>');
});


// PRODUCTS


app.get('/all-products', async (req, res) => {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
});

app.post('/create-product', upload.single('image'), async (req, res) => {
    try {
        const product = await Product.create({
            name: req.body.name,
            price: req.body.price,
            category: req.body.category,
            description: req.body.description,
            imageUrl: req.file ? `/uploads/${req.file.filename}` : ''
        });
        res.status(201).json(product);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/edit-product/:id', upload.single('image'), async (req, res) => {
    try {
        const updateData = { ...req.body };

        if (req.file) {
            updateData.imageUrl = `/uploads/${req.file.filename}`;
        }

        const updated = await Product.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );

        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/delete-product/:id', async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// ORDERS


app.post('/create-order', async (req, res) => {
    try {
        const order = await Order.create({
            customerName: req.body.customerName,
            products: req.body.products,
            totalPrice: req.body.totalPrice
        });
        res.status(201).json(order);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/all-orders', async (req, res) => {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
});

app.delete('/delete-order/:id', async (req, res) => {
    try {
        await Order.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});



app.post('/create-feedback', async (req, res) => {
    try {
        const feedback = await Feedback.create({
            name: req.body.name,
            message: req.body.message
        });
        res.status(201).json(feedback);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/feedbacks', async (req, res) => {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    res.json(feedbacks);
});

app.put('/edit-feedback/:id', async (req, res) => {
    try {
        const updated = await Feedback.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/delete-feedback/:id', async (req, res) => {
    try {
        await Feedback.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// CATEGORIES

app.get('/all-categories', async (req, res) => {
    const categories = await Category.find();
    res.json(categories);
});

// SOCIA
app.post('/create-social', async (req, res) => {
    try {
        const social = await Social.create({
            platform: req.body.platform,
            link: req.body.link
        });
        res.status(201).json(social);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/social', async (req, res) => {
    const socials = await Social.find();
    res.json(socials);
});

app.put('/edit-social/:id', async (req, res) => {
    try {
        const updated = await Social.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/delete-social/:id', async (req, res) => {
    try {
        await Social.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/create-category', async (req, res) => {
    try {
        const category = await Category.create({
            name: req.body.name
        });
        res.status(201).json(category);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


app.delete('/delete-category/:id', async (req, res) => {
    try {
        await Category.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});



app.listen(port, () => {
    console.log(`🚀 Сервер запущений: http://localhost:${port}`);
});