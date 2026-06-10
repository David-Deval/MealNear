// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
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

// Skema Data User
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['user', 'mitra'], default: 'user' },
  restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', UserSchema);

// --- API ENDPOINTS ---

// Auth: Registrasi pengguna / mitra
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password, role, businessName, location, addressDetail } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Username, email, dan password wajib diisi.' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const existing = await User.findOne({ $or: [{ email: normalizedEmail }, { username }] });
    if (existing) {
      return res.status(409).json({ message: 'Email atau username sudah terdaftar.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const userData = {
      username,
      email: normalizedEmail,
      passwordHash,
      role: role === 'mitra' ? 'mitra' : 'user'
    };

    let createdRestaurant = null;
    if (role === 'mitra') {
      if (!businessName || !location || !addressDetail) {
        return res.status(400).json({ message: 'Business name, location, dan address detail wajib untuk mitra.' });
      }

      const newResto = new Restaurant({
        name: businessName,
        area: location,
        address: addressDetail,
        coords: '-6.2000,106.8000',
        isOpen: true,
        openTime: '08:00',
        closeTime: '21:00',
        rating: 0,
        reviews: [],
        menu: []
      });
      createdRestaurant = await newResto.save();
      userData.restaurantId = createdRestaurant._id;
    }

    const user = new User(userData);
    await user.save();

    res.status(201).json({
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      restaurantId: user.restaurantId,
      restaurant: createdRestaurant ? createdRestaurant.toObject() : null
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Terjadi kesalahan saat registrasi.' });
  }
});

// Auth: Login pengguna / mitra
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: 'Username/email dan password wajib diisi.' });
    }

    const lookup = username.toLowerCase().trim();
    const user = await User.findOne({
      $or: [
        { email: lookup },
        { username: req.body.username }
      ]
    });

    if (!user) {
      return res.status(401).json({ message: 'Akun tidak ditemukan. Pastikan username atau email benar.' });
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      return res.status(401).json({ message: 'Password salah. Coba lagi.' });
    }

    let restaurant = null;
    if (user.role === 'mitra' && user.restaurantId) {
      restaurant = await Restaurant.findById(user.restaurantId);
    }

    res.json({
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      restaurantId: user.restaurantId,
      restaurant: restaurant ? restaurant.toObject() : null
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Terjadi kesalahan saat login.' });
  }
});

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