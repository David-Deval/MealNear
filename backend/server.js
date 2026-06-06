// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();
const app = express();

// Middleware
app.use(cors()); 
app.use(express.json());

// Koneksi ke MongoDB Atlas atau local fallback
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mealnear')
  .then(() => console.log('🚀 Terhubung ke MongoDB'))
  .catch(err => console.error('❌ Gagal koneksi database:', err));

// Skema Data Restoran
const RestaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  area: String,
  address: String,
  coords: String,
  isOpen: { type: Boolean, default: true },
  openTime: { type: String, default: "08:00" },
  closeTime: { type: String, default: "22:00" },
  rating: { type: Number, default: 0 },
  menu: [{ name: String, price: Number }],
  reviews: [{ user: String, comment: String, rating: Number }]
});

const Restaurant = mongoose.model('Restaurant', RestaurantSchema);

// --- API ENDPOINTS ---

// 1. Ambil semua restoran (Untuk Pengunjung)
app.get('/api/restaurants', async (req, res) => {
  try {
    const data = await Restaurant.find();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 2. Daftarkan Restoran Baru (Saat Mitra Register)
app.post('/api/restaurants', async (req, res) => {
  try {
    const newResto = new Restaurant(req.body);
    const savedResto = await newResto.save();
    res.status(201).json(savedResto);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// 3. Ubah Status Buka/Tutup Toko (Fitur Mitra)
app.put('/api/restaurants/:id/status', async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) return res.status(404).json({ message: 'Restoran tidak ditemukan' });
    
    restaurant.isOpen = !restaurant.isOpen;
    await restaurant.save();
    res.json(restaurant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 4. Tambah Menu Baru (Fitur Mitra)
app.post('/api/restaurants/:id/menu', async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) return res.status(404).json({ message: 'Restoran tidak ditemukan' });
    
    restaurant.menu.push(req.body); // req.body: { name, price }
    await restaurant.save();
    res.json(restaurant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 5. Hapus Menu (Fitur Mitra)
app.delete('/api/restaurants/:id/menu/:menuId', async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) return res.status(404).json({ message: 'Restoran tidak ditemukan' });
    
    restaurant.menu = restaurant.menu.filter(m => m._id.toString() !== req.params.menuId);
    await restaurant.save();
    res.json(restaurant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 6. Tambah Review/Testimoni Baru (Fitur Pengunjung)
app.post('/api/restaurants/:id/reviews', async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) return res.status(404).json({ message: 'Restoran tidak ditemukan' });
    
    restaurant.reviews.unshift(req.body); // req.body: { user, comment, rating }
    
    // Hitung ulang rata-rata rating restoran
    const totalRating = restaurant.reviews.reduce((acc, curr) => acc + curr.rating, 0);
    restaurant.rating = parseFloat((totalRating / restaurant.reviews.length).toFixed(1));
    
    await restaurant.save();
    res.json(restaurant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 7. Update jam operasional mitra
app.put('/api/restaurants/:id/hours', async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) return res.status(404).json({ message: 'Restoran tidak ditemukan' });

    const { openTime, closeTime } = req.body;
    if (openTime) restaurant.openTime = openTime;
    if (closeTime) restaurant.closeTime = closeTime;

    await restaurant.save();
    res.json(restaurant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 8. Ambil detail restoran berdasarkan ID
app.get('/api/restaurants/:id', async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) return res.status(404).json({ message: 'Restoran tidak ditemukan' });
    res.json(restaurant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// A. Endpoint untuk menambah menu makanan baru ke restoran tertentu
app.post('/api/restaurants/:id/menu', async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) return res.status(404).json({ message: 'Restoran tidak ditemukan' });

    const { name, price } = req.body;
    restaurant.menu.push({ name, price: Number(price) });
    
    await restaurant.save();
    res.json(restaurant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// B. Endpoint untuk menghapus menu makanan berdasarkan ID menu-nya
app.delete('/api/restaurants/:id/menu/:menuId', async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) return res.status(404).json({ message: 'Restoran tidak ditemukan' });

    // Memfilter menu untuk membuang menuId yang dipilih
    restaurant.menu = restaurant.menu.filter(item => item._id.toString() !== req.params.menuId);
    
    await restaurant.save();
    res.json(restaurant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// C. Endpoint untuk toggle Status Buka/Tutup Restoran
app.put('/api/restaurants/:id/toggle-status', async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) return res.status(404).json({ message: 'Restoran tidak ditemukan' });

    restaurant.isOpen = !restaurant.isOpen; // balikkan statusnya
    await restaurant.save();
    res.json(restaurant);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`💻 Server berjalan di port ${PORT}`));