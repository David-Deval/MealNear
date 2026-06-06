import React, { useState, useMemo, useEffect } from 'react';
import { 
  MapPin, 
  Store, 
  User, 
  LogOut, 
  Plus, 
  Trash2, 
  Edit2, 
  Star, 
  Clock, 
  LogIn,
  Send,
  X,
  Check,
  Loader2,
  Mail,
  Lock,
  UserCircle,
  MapPinned,
  Search,
  SlidersHorizontal,
  Wallet,
  MessageSquare,
  Hand,
  ChevronRight,
  UtensilsCrossed,
  LayoutDashboard,
  Navigation,
  Power,
  Calendar,
  Quote,
  Save,
  ChevronLeft,
  Bell,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

// --- KONFIGURASI & DATA AWAL ---
const APP_STORAGE_KEY = 'mealnear_v1_data';
const USER_STORAGE_KEY = 'mealnear_v1_user';

const JAKARTA_BARAT_AREAS = [
  "Kemanggisan", "Palmerah", "Grogol", "Kebon Jeruk", 
  "Kembangan", "Tanjung Duren", "Cengkareng"
];

const INITIAL_RESTAURANTS = [
  {
    id: 'r1',
    name: 'Warung Tenang Sejahtera',
    area: 'Kemanggisan',
    address: 'Jl. Melati No. 123, Dekat Kampus Anggrek',
    coords: '-6.2023,106.7845',
    isOpen: true,
    openTime: "08:00",
    closeTime: "22:00",
    rating: 4.5,
    reviews: [
      { id: 1, user: 'Budi', comment: 'Tempatnya sepi, cocok buat nugas!', rating: 5 },
      { id: 2, user: 'Santi', comment: 'Makanannya enak tapi porsinya dikit.', rating: 4 }
    ],
    menu: [
      { id: 'm1', name: 'Nasi Goreng Spesial', price: 25000 },
      { id: 'm2', name: 'Es Teh Manis', price: 5000 },
      { id: 'm3', name: 'Ayam Bakar', price: 30000 }
    ]
  },
  {
    id: 'r2',
    name: 'Kopi Sunyi',
    area: 'Tanjung Duren',
    address: 'Gg. Damai No. 9, Belakang Mall',
    coords: '-6.1754,106.7912',
    isOpen: true,
    openTime: "10:00",
    closeTime: "23:00",
    rating: 4.8,
    reviews: [{ id: 1, user: 'Ani', comment: 'Kopinya mantap, wifi kencang.', rating: 5 }],
    menu: [
      { id: 'm4', name: 'Latte', price: 18000 },
      { id: 'm5', name: 'Croissant', price: 12000 }
    ]
  },
  {
    id: 'r3',
    name: 'Bakmi Grogol Sentosa',
    area: 'Grogol',
    address: 'Jl. Dr. Muwardi I No. 45, Grogol',
    coords: '-6.1674,106.7881',
    isOpen: true,
    openTime: "07:00",
    closeTime: "17:00",
    rating: 4.6,
    reviews: [
      { id: 1, user: 'Rian', comment: 'Bakmi karetnya kenyal mantap, kuahnya gurih.', rating: 5 },
      { id: 2, user: 'Dewi', comment: 'Porsi pas untuk sarapan, pangsit gorengnya juara.', rating: 4 }
    ],
    menu: [
      { id: 'm6', name: 'Bakmi Ayam Jamur', price: 28000 },
      { id: 'm7', name: 'Pangsit Goreng (5 Pcs)', price: 15000 },
      { id: 'm8', name: 'Bakso Sapi Kuah', price: 20000 }
    ]
  },
  {
    id: 'r4',
    name: 'Nasi Uduk Bang Kebon',
    area: 'Kebon Jeruk',
    address: 'Jl. Kebon Jeruk Raya No. 12, Samping Kantor Pos',
    coords: '-6.1912,106.7645',
    isOpen: true,
    openTime: "17:00",
    closeTime: "23:30",
    rating: 4.7,
    reviews: [
      { id: 1, user: 'Joko', comment: 'Sambalnya pedas manis mantap! Selalu ramai pas malam.', rating: 5 }
    ],
    menu: [
      { id: 'm9', name: 'Nasi Uduk Spesial (Ayam & Tahu)', price: 22000 },
      { id: 'm10', name: 'Sate Paru Goreng', price: 8000 },
      { id: 'm11', name: 'Kol Goreng Tepung', price: 5000 }
    ]
  },
  {
    id: 'r5',
    name: 'Soto Betawi Palmerah Ibu Haji',
    area: 'Palmerah',
    address: 'Jl. Palmerah Barat No. 89, Dekat Stasiun',
    coords: '-6.2089,106.7972',
    isOpen: true,
    openTime: "09:00",
    closeTime: "19:00",
    rating: 4.4,
    reviews: [
      { id: 1, user: 'Hendra', comment: 'Kuah susunya kental berempah, dagingnya empuk banget.', rating: 5 },
      { id: 2, user: 'Rina', comment: 'Enak, tapi sering kehabisan kalau jam makan siang.', rating: 4 }
    ],
    menu: [
      { id: 'm12', name: 'Soto Betawi Daging Campur', price: 35000 },
      { id: 'm13', name: 'Nasi Putih', price: 6000 },
      { id: 'm14', name: 'Es Jeruk Nipis', price: 8000 }
    ]
  },
  {
    id: 'r6',
    name: 'Kembangan Coffee & Bites',
    area: 'Kembangan',
    address: 'Ruko Sentra Niaga, Jl. Puri Kembangan No. 2A',
    coords: '-6.1887,106.7381',
    isOpen: true,
    openTime: "09:00",
    closeTime: "22:00",
    rating: 4.7,
    reviews: [
      { id: 1, user: 'Bella', comment: 'Suasana modern, kopi arenya creamy & manisnya pas.', rating: 5 }
    ],
    menu: [
      { id: 'm15', name: 'Es Kopi Susu Aren Pekat', price: 19000 },
      { id: 'm16', name: 'Waffle Cokelat Klasik', price: 15000 },
      { id: 'm17', name: 'Fries & Sausage Combo', price: 25000 }
    ]
  },
  {
    id: 'r7',
    name: 'Penyetan Cengkareng Maknyus',
    area: 'Cengkareng',
    address: 'Jl. Outer Ring Road Cengkareng No. 56',
    coords: '-6.1523,106.7212',
    isOpen: true,
    openTime: "11:00",
    closeTime: "21:00",
    rating: 4.3,
    reviews: [
      { id: 1, user: 'Dono', comment: 'Bebek penyetnya garing di luar, sambalnya melimpah!', rating: 4 }
    ],
    menu: [
      { id: 'm18', name: 'Bebek Penyet Sambal Ijo', price: 32000 },
      { id: 'm19', name: 'Ayam Penyet Kremes', price: 22000 },
      { id: 'm20', name: 'Tempe Penyet Kemangi', price: 10000 }
    ]
  },
  {
    id: 'r8',
    name: 'Martabak Manis Kemanggisan',
    area: 'Kemanggisan',
    address: 'Jl. KH. Syahdan No. 44, Dekat Binus',
    coords: '-6.2011,106.7812',
    isOpen: true,
    openTime: "16:00",
    closeTime: "23:00",
    rating: 4.8,
    reviews: [
      { id: 1, user: 'Kiki', comment: 'Menteganya melimpah ruah, adonan lembut banget.', rating: 5 }
    ],
    menu: [
      { id: 'm21', name: 'Martabak Klasik Cokelat Kacang Keju', price: 45000 },
      { id: 'm22', name: 'Martabak Tipker Keju Jagung', price: 25000 },
      { id: 'm23', name: 'Martabak Telur Daging Sapi (3 Telur)', price: 40000 }
    ]
  },
  {
    id: 'r9',
    name: 'Steak Rakyat Palmerah',
    area: 'Palmerah',
    address: 'Jl. Palmerah Utara No. 110',
    coords: '-6.2105,106.7925',
    isOpen: true,
    openTime: "12:00",
    closeTime: "22:00",
    rating: 4.2,
    reviews: [
      { id: 1, user: 'Alwi', comment: 'Steak ayam krispi murah meriah, saus BBQ-nya oke.', rating: 4 }
    ],
    menu: [
      { id: 'm24', name: 'Double Crispy Chicken Steak BBQ', price: 29000 },
      { id: 'm25', name: 'Sirloin Beef Steak Pepper', price: 49000 },
      { id: 'm26', name: 'French Fries Extra Cheese', price: 12000 }
    ]
  },
  {
    id: 'r10',
    name: 'Ketoprak Grogol Jaya',
    area: 'Grogol',
    address: 'Jl. Kyai Tapa No. 18, Dekat Universitas Trisakti',
    coords: '-6.1633,106.7842',
    isOpen: true,
    openTime: "08:00",
    closeTime: "16:00",
    rating: 4.5,
    reviews: [
      { id: 1, user: 'Rara', comment: 'Bumbu kacangnya diulek halus banget, manis gurih mantap.', rating: 5 }
    ],
    menu: [
      { id: 'm27', name: 'Ketoprak Spesial Telur Asin', price: 20000 },
      { id: 'm28', name: 'Ketoprak Biasa Telur Ceplok', price: 16000 },
      { id: 'm29', name: 'Es Kelapa Muda Gula Aren', price: 10000 }
    ]
  }
];

export default function App() {
  // --- STATE UTAMA ---
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem(USER_STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  });

  const [restaurants, setRestaurants] = useState(() => {
    const saved = localStorage.getItem(APP_STORAGE_KEY);
    return saved ? JSON.parse(saved) : INITIAL_RESTAURANTS;
  });

  const [view, setView] = useState(user ? (user.role === 'mitra' ? 'dashboard' : 'landing') : 'auth');
  const [selectedResId, setSelectedResId] = useState(null);
  const [authMode, setAuthMode] = useState('login');
  const [selectedRole, setSelectedRole] = useState('user');
  const [isLoading, setIsLoading] = useState(false);

  // --- STATE NOTIFIKASI (TOAST) ---
  const [toast, setToast] = useState(null);

  // --- STATE FORM & FILTER ---
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArea, setSelectedArea] = useState('Semua Lokasi');
  const [maxBudget, setMaxBudget] = useState(100000); 

  const [formData, setFormData] = useState({
    username: '', email: '', password: '', businessName: '', location: JAKARTA_BARAT_AREAS[0], addressDetail: ''
  });

  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [isAddingMenu, setIsAddingMenu] = useState(false);
  const [menuInput, setMenuInput] = useState({ name: '', price: '' });
  
  // State baru untuk mengedit jam operasional mitra
  const [isEditingHours, setIsEditingHours] = useState(false);
  const [hoursInput, setHoursInput] = useState({ openTime: '08:00', closeTime: '21:00' });

  const normalizeMenuItem = (item) => ({
    ...item,
    id: item.id || item._id?.toString() || `${Date.now()}-${Math.random()}`
  });

  const normalizeReviewItem = (item) => ({
    ...item,
    id: item.id || item._id?.toString() || `${Date.now()}-${Math.random()}`
  });

  const normalizeRestaurant = (restaurant) => ({
    ...restaurant,
    id: restaurant.id || restaurant._id?.toString() || restaurant.name,
    menu: (restaurant.menu || []).map(normalizeMenuItem),
    reviews: (restaurant.reviews || []).map(normalizeReviewItem)
  });

  const normalizeRestaurants = (list) => (list || []).map(normalizeRestaurant);

  const loadRestaurants = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/restaurants`);
      if (!response.ok) throw new Error('Gagal memuat restoran dari backend');
      const data = await response.json();
      setRestaurants(normalizeRestaurants(data));
    } catch (error) {
      console.error(error);
      showToast('Backend tidak terhubung, data lokal digunakan.', 'info');
    }
  };

  useEffect(() => {
    loadRestaurants();
  }, []);

  // Reset form data ketika berganti mode registrasi atau peran
  useEffect(() => {
    setFormData({
      username: '',
      email: '',
      password: '',
      businessName: '',
      location: JAKARTA_BARAT_AREAS[0],
      addressDetail: ''
    });
  }, [authMode, selectedRole]);

  // --- DERIVED STATE ---
  const selectedRes = restaurants.find(r => r.id === selectedResId);
  const myRestaurant = restaurants.find(r => r.name === user?.name || r.id === user?.restaurantId);

  // --- MODUL PERSISTENCE ---
  useEffect(() => {
    localStorage.setItem(APP_STORAGE_KEY, JSON.stringify(restaurants));
  }, [restaurants]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_STORAGE_KEY);
    }
  }, [user]);

  // Sinkronisasi input jam operasional saat restoran mitra terdeteksi
  useEffect(() => {
    if (myRestaurant) {
      setHoursInput({
        openTime: myRestaurant.openTime || "08:00",
        closeTime: myRestaurant.closeTime || "22:00"
      });
    }
  }, [myRestaurant]);

  // --- MODUL NOTIFIKASI ---
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  // --- FUNGSI NAVIGASI MAPS ---
  const openInGoogleMaps = (coords, name) => {
    if (!coords) {
      showToast("Koordinat lokasi tidak tersedia", "error");
      return;
    }
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(coords)}`;
    window.open(url, '_blank');
  };

  // --- LOGIKA AUTH DENGAN VALIDASI ---
  const handleAuthSubmit = async (e) => {
    e.preventDefault();

    // Validasi dasar (berlaku untuk semua)
    if (formData.username.length < 5) {
      showToast("Username minimal 5 karakter", "error");
      return;
    }

    if (formData.password.length < 8) {
      showToast("Password minimal 8 karakter", "error");
      return;
    }

    // Validasi khusus Registrasi
    if (authMode === 'register') {
      if (!formData.email.includes('@') || !formData.email.includes('.')) {
        showToast("Format Email tidak valid", "error");
        return;
      }

      // Validasi Tambahan Khusus Mitra Bisnis
      if (selectedRole === 'mitra') {
        if (!formData.businessName.trim() || formData.businessName.length < 3) {
          showToast("Nama bisnis minimal 3 karakter", "error");
          return;
        }
        if (!formData.addressDetail.trim() || formData.addressDetail.length < 10) {
          showToast("Alamat lengkap minimal 10 karakter untuk rute kurir", "error");
          return;
        }
      }
    }

    setIsLoading(true);

    try {
      let displayName = formData.username || 'User';
      let restaurantId = null;

      if (selectedRole === 'mitra') {
        displayName = formData.businessName || formData.username;

        if (authMode === 'register') {
          const newResto = {
            name: displayName,
            area: formData.location,
            address: formData.addressDetail || `Area ${formData.location}`,
            coords: '-6.2000,106.8000',
            isOpen: true,
            openTime: "08:00",
            closeTime: "21:00",
            rating: 0,
            reviews: [],
            menu: []
          };

          const response = await fetch(`${API_BASE_URL}/restaurants`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newResto)
          });

          if (!response.ok) throw new Error('Gagal membuat restoran mitra');

          const createdRestaurant = normalizeRestaurant(await response.json());
          setRestaurants(prev => [createdRestaurant, ...prev]);
          restaurantId = createdRestaurant.id;
        }
      }

      setUser({ role: selectedRole, name: displayName, restaurantId, isGuest: false });
      setView(selectedRole === 'user' ? 'landing' : 'dashboard');
      showToast(authMode === 'login' ? `Selamat datang kembali, ${displayName}!` : `Pendaftaran ${displayName} Berhasil!`);
    } catch (error) {
      console.error(error);
      showToast('Terjadi kesalahan koneksi backend.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const continueAsGuest = () => {
    setIsLoading(true);
    setTimeout(() => {
      setUser({ role: 'user', name: 'Tamu', isGuest: true });
      setIsLoading(false);
      setView('landing');
      showToast("Masuk sebagai tamu", "info");
    }, 800);
  };

  const handleLogout = () => {
    setUser(null);
    setView('auth');
    showToast("Berhasil keluar akun");
  };

  // --- LOGIKA BISNIS ---
  const calculateNetPrice = (menu) => {
    if (!menu || menu.length === 0) return 0;
    const total = menu.reduce((acc, curr) => acc + curr.price, 0);
    return Math.round(total / menu.length);
  };

  const filteredRestaurants = useMemo(() => {
    return restaurants.filter(res => {
      const matchesSearch = res.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesArea = selectedArea === 'Semua Lokasi' || res.area === selectedArea;
      const netPrice = calculateNetPrice(res.menu);
      const matchesBudget = netPrice <= maxBudget;
      return matchesSearch && matchesArea && matchesBudget;
    });
  }, [restaurants, searchQuery, selectedArea, maxBudget]);

  const toggleStoreStatus = async () => {
    const restaurantId = myRestaurant?.id || user?.restaurantId;
    if (!restaurantId) return;

    try {
      const response = await fetch(`${API_BASE_URL}/restaurants/${restaurantId}/status`, {
        method: 'PUT'
      });
      if (!response.ok) throw new Error('Gagal memperbarui status toko');

      const updatedRestaurant = normalizeRestaurant(await response.json());
      setRestaurants(prev => prev.map(res => (res.id === updatedRestaurant.id ? updatedRestaurant : res)));
      showToast(`Toko sekarang ${updatedRestaurant.isOpen ? 'Buka' : 'Tutup'}`, updatedRestaurant.isOpen ? 'success' : 'info');
    } catch (error) {
      console.error(error);
      showToast('Gagal memperbarui status toko.', 'error');
    }
  };

  const handleUpdateHours = async () => {
    if (!hoursInput.openTime || !hoursInput.closeTime) {
      showToast("Jam buka dan tutup wajib diisi", "error");
      return;
    }

    const restaurantId = myRestaurant?.id || user?.restaurantId;
    if (!restaurantId) return;

    try {
      const response = await fetch(`${API_BASE_URL}/restaurants/${restaurantId}/hours`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ openTime: hoursInput.openTime, closeTime: hoursInput.closeTime })
      });
      if (!response.ok) throw new Error('Gagal memperbarui jam operasional');

      const updatedRestaurant = normalizeRestaurant(await response.json());
      setRestaurants(prev => prev.map(res => (res.id === updatedRestaurant.id ? updatedRestaurant : res)));
      setIsEditingHours(false);
      showToast("Jam operasional berhasil diperbarui");
    } catch (error) {
      console.error(error);
      showToast('Gagal memperbarui jam operasional.', 'error');
    }
  };

  const handleAddMenu = async () => {
    if (!menuInput.name || !menuInput.price) return;
    const price = parseInt(menuInput.price, 10);
    if (Number.isNaN(price)) {
      showToast('Harga menu harus angka', 'error');
      return;
    }

    const restaurantId = myRestaurant?.id || user?.restaurantId;
    if (!restaurantId) return;

    try {
      const response = await fetch(`${API_BASE_URL}/restaurants/${restaurantId}/menu`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: menuInput.name, price })
      });
      if (!response.ok) throw new Error('Gagal menambahkan menu');

      const updatedRestaurant = normalizeRestaurant(await response.json());
      setRestaurants(prev => prev.map(res => (res.id === updatedRestaurant.id ? updatedRestaurant : res)));
      setMenuInput({ name: '', price: '' });
      setIsAddingMenu(false);
      showToast("Menu berhasil ditambahkan");
    } catch (error) {
      console.error(error);
      showToast('Gagal menambahkan menu.', 'error');
    }
  };

  const handleDeleteMenu = async (menuId) => {
    const restaurantId = myRestaurant?.id || user?.restaurantId;
    if (!restaurantId) return;

    try {
      const response = await fetch(`${API_BASE_URL}/restaurants/${restaurantId}/menu/${menuId}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Gagal menghapus menu');

      const updatedRestaurant = normalizeRestaurant(await response.json());
      setRestaurants(prev => prev.map(res => (res.id === updatedRestaurant.id ? updatedRestaurant : res)));
      showToast("Menu dihapus", "info");
    } catch (error) {
      console.error(error);
      showToast('Gagal menghapus menu.', 'error');
    }
  };

  const handleSubmitReview = async (id) => {
    if (!newComment.trim()) return;
    const payload = { user: user.name, comment: newComment.trim(), rating: newRating };

    try {
      const response = await fetch(`${API_BASE_URL}/restaurants/${id}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error('Gagal mengirim review');

      const updatedRestaurant = normalizeRestaurant(await response.json());
      setRestaurants(prev => prev.map(res => (res.id === updatedRestaurant.id ? updatedRestaurant : res)));
      setNewComment('');
      setNewRating(5);
      showToast('Review berhasil dikirim!', 'success');
    } catch (error) {
      console.error(error);
      showToast('Gagal mengirim review.', 'error');
    }
  };

  // --- KOMPONEN UI ---
  const Toast = () => {
    if (!toast) return null;
    return (
      <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[200] animate-in slide-in-from-top-4 fade-in duration-300">
        <div className={`px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border ${
          toast.type === 'success' ? 'bg-green-600 border-green-500' : 
          toast.type === 'info' ? 'bg-blue-600 border-blue-500' : 'bg-orange-600 border-orange-500'
        } text-white`}>
          {toast.type === 'success' ? <CheckCircle2 size={18}/> : <AlertCircle size={18}/>}
          <span className="text-sm font-bold">{toast.message}</span>
        </div>
      </div>
    );
  };

  const LoadingOverlay = () => (
    <div className="fixed inset-0 bg-white/90 backdrop-blur-md z-[150] flex flex-col items-center justify-center">
      <div className="w-16 h-16 border-4 border-orange-100 border-t-orange-600 rounded-full animate-spin mb-4"></div>
      <h3 className="text-xl font-bold text-gray-800 italic">Sinkronisasi Data...</h3>
    </div>
  );

  const Navbar = () => (
    <nav className="bg-white border-b p-4 sticky top-0 z-50 flex justify-between items-center shadow-sm">
      <h1 className="text-2xl font-bold text-orange-600 cursor-pointer flex items-center gap-2" onClick={() => setView(user?.role === 'mitra' ? 'dashboard' : 'landing')}>
        <div className="bg-orange-600 text-white p-1 rounded-lg"><Store size={20} /></div>
        <span className="tracking-tighter italic">MealNear</span>
      </h1>
      <div className="flex items-center gap-4">
        {user ? (
          <div className="flex items-center gap-3">
            <div className="hidden md:flex flex-col items-end">
               <span className="text-xs font-black text-gray-400 uppercase tracking-widest">{user.role}</span>
               <span className="text-sm font-bold text-gray-800">{user.name}</span>
            </div>
            <button onClick={handleLogout} className="p-2.5 text-red-500 hover:bg-red-50 rounded-2xl transition-all border border-transparent hover:border-red-100">
              <LogOut size={20} />
            </button>
          </div>
        ) : (
          <button 
            onClick={() => setView('auth')}
            className="bg-orange-600 text-white px-6 py-2.5 rounded-2xl font-black hover:bg-orange-700 shadow-lg active:scale-95 transition-all text-sm"
          >
            Masuk
          </button>
        )}
      </div>
    </nav>
  );

  // --- RENDER HALAMAN AUTH ---
  if (view === 'auth') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        {isLoading && <LoadingOverlay />}
        <Toast />
        
        <div className="mb-10 flex flex-col items-center animate-bounce-slow">
           <div className="bg-orange-600 text-white p-5 rounded-[2.5rem] shadow-2xl shadow-orange-200 mb-4 ring-8 ring-orange-50">
              <Store size={52} />
           </div>
           <h1 className="text-4xl font-black text-gray-900 italic tracking-tighter">MealNear</h1>
           <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mt-2">Jakarta Barat Culinary Guide</p>
        </div>

        <div className="bg-white p-8 md:p-10 rounded-[3rem] shadow-2xl w-full max-w-lg border border-gray-100">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-black text-gray-800">
              {authMode === 'login' ? 'Selamat Datang' : 'Buat Akun Baru'}
            </h2>
            <p className="text-gray-400 text-sm mt-1 font-medium">
              {authMode === 'login' 
                ? 'Masuk untuk akses fitur lengkap kuliner' 
                : `Daftar sebagai ${selectedRole === 'user' ? 'Pengunjung' : 'Mitra Bisnis'} MealNear`}
            </p>
          </div>

          <div className="flex p-1.5 bg-gray-100 rounded-[1.8rem] mb-8">
            <button onClick={() => setSelectedRole('user')} className={`flex-1 py-3.5 rounded-[1.4rem] font-black text-xs transition-all flex items-center justify-center gap-2 ${selectedRole === 'user' ? 'bg-white shadow-lg text-orange-600' : 'text-gray-400'}`}>
              <UserCircle size={16}/> PENGUNJUNG
            </button>
            <button onClick={() => setSelectedRole('mitra')} className={`flex-1 py-3.5 rounded-[1.4rem] font-black text-xs transition-all flex items-center justify-center gap-2 ${selectedRole === 'mitra' ? 'bg-white shadow-lg text-orange-600' : 'text-gray-400'}`}>
              <Store size={16}/> MITRA BISNIS
            </button>
          </div>

          <form onSubmit={handleAuthSubmit} className="space-y-4">
            
            {/* INPUT FIELD: USERNAME (Selalu Ada) */}
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-orange-500 transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Username Akun" 
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent rounded-[1.2rem] outline-none focus:ring-4 focus:ring-orange-50 focus:bg-white focus:border-orange-200 transition-all text-sm font-bold" 
                value={formData.username} 
                onChange={(e) => setFormData({...formData, username: e.target.value})} 
                required 
              />
              <p className={`text-[10px] mt-1 ml-2 font-black italic tracking-tighter ${formData.username.length > 0 && formData.username.length < 5 ? 'text-red-500' : 'text-gray-300'}`}>
                * Minimal 5 karakter
              </p>
            </div>

            {/* INPUT FIELD: EMAIL (Hanya Saat Daftar) */}
            {authMode === 'register' && (
              <div className="relative group animate-in slide-in-from-top-2 duration-200">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-orange-500 transition-colors" size={18} />
                <input 
                  type="email" 
                  placeholder={selectedRole === 'user' ? "Alamat Email Aktif" : "Email Bisnis / Kantor"} 
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent rounded-[1.2rem] outline-none focus:ring-4 focus:ring-orange-50 focus:bg-white focus:border-orange-200 transition-all text-sm font-bold" 
                  value={formData.email} 
                  onChange={(e) => setFormData({...formData, email: e.target.value})} 
                  required 
                />
              </div>
            )}

            {/* INPUT FIELD: NAMA BISNIS & ALAMAT (Hanya Saat Daftar Mitra Bisnis) */}
            {authMode === 'register' && selectedRole === 'mitra' && (
              <div className="space-y-4 animate-in slide-in-from-top-2 duration-300">
                {/* Nama Bisnis */}
                <div className="relative group">
                  <Store className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-orange-500 transition-colors" size={18} />
                  <input 
                    type="text" 
                    placeholder="Nama Warung / Kedai / Restoran" 
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent rounded-[1.2rem] outline-none focus:ring-4 focus:ring-orange-50 focus:bg-white focus:border-orange-200 transition-all text-sm font-bold" 
                    value={formData.businessName} 
                    onChange={(e) => setFormData({...formData, businessName: e.target.value})} 
                    required 
                  />
                </div>

                {/* Pilih Area Jakarta Barat */}
                <div className="relative group flex flex-col gap-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Area Operasional Toko</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-orange-500 transition-colors" size={18} />
                    <select 
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent rounded-[1.2rem] outline-none focus:ring-4 focus:ring-orange-50 focus:bg-white focus:border-orange-200 transition-all text-sm font-bold appearance-none" 
                      value={formData.location} 
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                    >
                      {JAKARTA_BARAT_AREAS.map(area => (
                        <option key={area} value={area}>{area}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Alamat Lengkap */}
                <div className="relative group">
                  <MapPinned className="absolute left-4 top-4 text-gray-300 group-focus-within:text-orange-500 transition-colors" size={18} />
                  <textarea 
                    placeholder="Alamat Lengkap (Jl, No, RT/RW, Patokan Toko)" 
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent rounded-[1.2rem] outline-none focus:ring-4 focus:ring-orange-50 focus:bg-white focus:border-orange-200 transition-all text-sm font-bold h-24 resize-none" 
                    value={formData.addressDetail} 
                    onChange={(e) => setFormData({...formData, addressDetail: e.target.value})} 
                    required 
                  />
                  <p className={`text-[10px] mt-1 ml-2 font-black italic tracking-tighter ${formData.addressDetail.length > 0 && formData.addressDetail.length < 10 ? 'text-red-500' : 'text-gray-300'}`}>
                    * Minimal 10 karakter untuk verifikasi maps
                  </p>
                </div>
              </div>
            )}

            {/* INPUT FIELD: PASSWORD (Selalu Ada) */}
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-orange-500 transition-colors" size={18} />
              <input 
                type="password" 
                placeholder="Password Akun" 
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent rounded-[1.2rem] outline-none focus:ring-4 focus:ring-orange-50 focus:bg-white focus:border-orange-200 transition-all text-sm font-bold" 
                value={formData.password} 
                onChange={(e) => setFormData({...formData, password: e.target.value})} 
                required 
              />
              <p className={`text-[10px] mt-1 ml-2 font-black italic tracking-tighter ${formData.password.length > 0 && formData.password.length < 8 ? 'text-red-500' : 'text-gray-300'}`}>
                * Minimal 8 karakter
              </p>
            </div>

            <button className="w-full bg-orange-600 text-white py-5 rounded-[1.5rem] font-black hover:bg-orange-700 shadow-xl shadow-orange-100 transition-all active:scale-95 text-lg mt-4">
              {authMode === 'login' ? 'MULAI MASUK' : 'DAFTAR SEKARANG'}
            </button>
          </form>

          <div className="mt-8 flex flex-col gap-5">
            <button onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')} className="text-xs text-gray-400 font-black text-center hover:text-orange-600 tracking-widest">
              {authMode === 'login' ? 'TIDAK PUNYA AKUN? ' : 'SUDAH ADA AKUN? '}
              <span className="text-orange-600 decoration-2 underline-offset-4">{authMode === 'login' ? 'DAFTAR' : 'LOG IN'}</span>
            </button>
            
            {selectedRole === 'user' && (
              <button onClick={continueAsGuest} className="w-full border-2 border-dashed border-gray-200 py-4 rounded-[1.5rem] font-black hover:bg-gray-50 text-gray-400 transition-all flex items-center justify-center gap-2 text-xs tracking-widest">
                MASUK SEBAGAI TAMU <ChevronRight size={16}/>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // --- RENDER APLIKASI UTAMA (Landing & Detail tetap sama) ---
  return (
    <div className="min-h-screen bg-gray-50">
      {isLoading && <LoadingOverlay />}
      <Toast />
      <Navbar />
      
      <main className="max-w-4xl mx-auto p-4 md:p-8">
        {/* DASHBOARD MITRA */}
        {view === 'dashboard' && user?.role === 'mitra' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="text-4xl font-black text-gray-900 tracking-tighter italic">Halo, {user.name}</h2>
                <div className="flex items-center gap-2 mt-2">
                   <span className="bg-orange-100 text-orange-600 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter flex items-center gap-1">
                     <MapPinned size={12}/> {myRestaurant?.area}
                   </span>
                   <span className="text-gray-400 text-xs font-bold italic cursor-pointer hover:text-orange-600" onClick={() => openInGoogleMaps(myRestaurant?.coords)}>
                      {myRestaurant?.address}
                   </span>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-white px-5 py-3 rounded-2xl shadow-sm border border-gray-100">
                <Star size={20} fill="#f59e0b" className="text-yellow-500" />
                <span className="text-xl font-black text-gray-800">{myRestaurant?.rating || '0.0'}</span>
                <span className="text-gray-300 font-bold">/ 5.0</span>
              </div>
            </header>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
               <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm text-center group hover:border-orange-200 transition-all">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Status Toko</p>
                  <button onClick={toggleStoreStatus} className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${myRestaurant?.isOpen ? 'bg-green-500 text-white shadow-lg shadow-green-100' : 'bg-red-500 text-white shadow-lg shadow-red-100'}`}>
                    {myRestaurant?.isOpen ? 'BUKA' : 'TUTUP'}
                  </button>
               </div>
               <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm text-center">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Total Menu</p>
                  <p className="text-2xl font-black text-gray-800">{myRestaurant?.menu.length || 0}</p>
               </div>
               
               {/* KARTU JAM OPERASIONAL YANG DAPAT DIEDIT */}
               <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm text-center col-span-2 flex flex-col justify-center items-center">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Jam Operasional</p>
                  {isEditingHours ? (
                    <div className="flex flex-col items-center gap-2 w-full animate-in fade-in duration-200">
                      <div className="flex items-center gap-1.5 justify-center">
                        <input 
                          type="time" 
                          className="px-2 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-800 focus:ring-2 focus:ring-orange-500 outline-none"
                          value={hoursInput.openTime}
                          onChange={(e) => setHoursInput({ ...hoursInput, openTime: e.target.value })}
                        />
                        <span className="text-gray-400 text-xs font-bold">s/d</span>
                        <input 
                          type="time" 
                          className="px-2 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-800 focus:ring-2 focus:ring-orange-500 outline-none"
                          value={hoursInput.closeTime}
                          onChange={(e) => setHoursInput({ ...hoursInput, closeTime: e.target.value })}
                        />
                      </div>
                      <div className="flex gap-1.5 mt-1">
                        <button 
                          onClick={handleUpdateHours} 
                          className="bg-green-600 hover:bg-green-700 text-white p-1.5 rounded-lg shadow-md hover:scale-105 active:scale-95 transition-all"
                          title="Simpan Jam Operasional"
                        >
                          <Check size={14} />
                        </button>
                        <button 
                          onClick={() => setIsEditingHours(false)} 
                          className="bg-gray-100 hover:bg-gray-200 text-gray-500 p-1.5 rounded-lg hover:scale-105 active:scale-95 transition-all"
                          title="Batal"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center w-full">
                      <div className="flex items-center justify-center gap-2">
                         <Clock size={16} className="text-orange-500"/>
                         <span className="font-bold text-gray-800">{myRestaurant?.openTime} - {myRestaurant?.closeTime}</span>
                      </div>
                      <button 
                        onClick={() => setIsEditingHours(true)} 
                        className="mt-2 text-[10px] font-black text-orange-600 hover:text-orange-700 hover:underline flex items-center gap-1 transition-all"
                      >
                        <Edit2 size={10}/> UBAH JAM
                      </button>
                    </div>
                  )}
               </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* MANAGEMENT MENU */}
              <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-xl font-black text-gray-800 flex items-center gap-3 italic">
                    <UtensilsCrossed size={24} className="text-orange-500"/> Menu Andalan
                  </h3>
                  <button onClick={() => setIsAddingMenu(!isAddingMenu)} className={`p-2.5 rounded-xl transition-all shadow-md ${isAddingMenu ? 'bg-gray-100 text-gray-500' : 'bg-orange-600 text-white hover:bg-orange-700'}`}>
                    {isAddingMenu ? <X size={20}/> : <Plus size={20}/>}
                  </button>
                </div>

                {isAddingMenu && (
                  <div className="mb-8 p-6 bg-orange-50 rounded-[2rem] border-2 border-dashed border-orange-200 animate-in slide-in-from-top-4 duration-300">
                    <div className="space-y-4">
                       <input type="text" placeholder="Nama Makanan" className="w-full px-5 py-3 rounded-xl border-none outline-none focus:ring-2 focus:ring-orange-500 font-bold text-sm" value={menuInput.name} onChange={(e) => setMenuInput({...menuInput, name: e.target.value})} />
                       <div className="relative">
                         <span className="absolute left-5 top-1/2 -translate-y-1/2 font-black text-gray-400 text-sm">Rp</span>
                         <input type="number" placeholder="Harga" className="w-full pl-12 pr-5 py-3 rounded-xl border-none outline-none focus:ring-2 focus:ring-orange-500 font-black text-sm" value={menuInput.price} onChange={(e) => setMenuInput({...menuInput, price: e.target.value})} />
                       </div>
                       <button onClick={handleAddMenu} className="w-full bg-orange-600 text-white py-3 rounded-xl font-black text-sm flex items-center justify-center gap-2 hover:bg-orange-700 transition-all">
                         <Save size={18}/> SIMPAN MENU
                       </button>
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  {myRestaurant?.menu.map(item => (
                    <div key={item.id} className="flex justify-between items-center p-5 bg-gray-50 rounded-2xl group hover:bg-white hover:shadow-md hover:border-gray-100 border border-transparent transition-all">
                      <div>
                        <p className="font-black text-gray-800 text-sm">{item.name}</p>
                        <p className="text-orange-600 text-xs font-black italic">Rp {item.price.toLocaleString()}</p>
                      </div>
                      <button onClick={() => handleDeleteMenu(item.id)} className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100">
                        <Trash2 size={18}/>
                      </button>
                    </div>
                  ))}
                  {myRestaurant?.menu.length === 0 && (
                    <div className="text-center py-10">
                      <p className="text-gray-400 text-sm italic">Belum ada menu terdaftar.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* REVIEW PELANGGAN */}
              <div className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-sm">
                <h3 className="text-xl font-black text-gray-800 flex items-center gap-3 italic mb-8">
                  <MessageSquare size={24} className="text-orange-500"/> Testimoni
                </h3>
                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                  {myRestaurant?.reviews.length > 0 ? (
                    myRestaurant.reviews.map(rev => (
                      <div key={rev.id} className="p-5 bg-gray-50 rounded-3xl border border-gray-100">
                        <div className="flex justify-between items-center mb-3">
                           <span className="text-sm font-black text-gray-800">{rev.user}</span>
                           <div className="flex items-center gap-1 text-yellow-500 bg-white px-2 py-1 rounded-lg border border-gray-100 shadow-xs">
                             <Star size={10} fill="currentColor"/>
                             <span className="text-[10px] font-black">{rev.rating}</span>
                           </div>
                        </div>
                        <p className="text-xs text-gray-500 italic leading-relaxed">"{rev.comment}"</p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-gray-400 text-sm italic">Menunggu ulasan pertama...</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW LANDING (PENGUNJUNG) */}
        {view === 'landing' && (
          <div className="space-y-8 animate-in fade-in duration-700">
            <header className="space-y-6">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-orange-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                    <MapPin size={24}/>
                 </div>
                 <h2 className="text-4xl font-black text-gray-900 tracking-tighter italic">Cari Makan Apa?</h2>
              </div>

              <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-50 grid md:grid-cols-3 gap-8">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 ml-2">Pencarian</label>
                    <div className="relative">
                       <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" size={16}/>
                       <input type="text" placeholder="Nama warung..." className="w-full pl-12 pr-4 py-3.5 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-orange-500 font-bold text-sm" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                    </div>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 ml-2">Area Jakarta Barat</label>
                    <select 
                      className="w-full px-5 py-3.5 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-orange-500 font-black text-sm transition-all"
                      value={selectedArea}
                      onChange={(e) => setSelectedArea(e.target.value)}
                    >
                      <option value="Semua Lokasi">🌍 SEMUA LOKASI</option>
                      {JAKARTA_BARAT_AREAS.map(area => <option key={area} value={area}>📍 {area.toUpperCase()}</option>)}
                    </select>
                 </div>
                 <div className="space-y-3">
                    <div className="flex justify-between items-center ml-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Budget Maks</label>
                      <span className="text-orange-600 font-black text-xs">Rp {maxBudget.toLocaleString()}</span>
                    </div>
                    <input type="range" min="15000" max="100000" step="5000" className="w-full accent-orange-600 cursor-pointer" value={maxBudget} onChange={(e) => setMaxBudget(parseInt(e.target.value))} />
                 </div>
              </div>
            </header>

            <div className="grid gap-6">
              {filteredRestaurants.length > 0 ? (
                filteredRestaurants.map(res => (
                  <div key={res.id} className={`bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100 hover:shadow-xl hover:scale-[1.01] transition-all group overflow-hidden relative ${!res.isOpen && 'opacity-70 grayscale-[0.4]'}`}>
                    <div className="flex flex-col md:flex-row justify-between gap-6 relative z-10">
                      <div className="flex-1">
                          <div className="flex items-center gap-3 flex-wrap">
                            <h3 className="text-2xl font-black text-gray-900 group-hover:text-orange-600 transition-colors">{res.name}</h3>
                            <span className="bg-gray-100 text-gray-500 text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-tighter">{res.area}</span>
                          </div>
                          <p className="text-gray-400 text-xs font-medium flex items-center gap-1.5 mt-2 italic"><MapPin size={14} className="text-orange-400"/> {res.address}</p>
                          
                          <div className="flex items-center gap-3 mt-4">
                            <div className={`px-3 py-1 rounded-lg text-[10px] font-black tracking-widest ${res.isOpen ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                              {res.isOpen ? 'OPEN NOW' : 'CLOSED'}
                            </div>
                            <span className="text-[10px] font-bold text-gray-400 flex items-center gap-1.5 bg-gray-50 px-3 py-1 rounded-lg">
                              <Clock size={12}/> {res.openTime} - {res.closeTime}
                            </span>
                          </div>
                      </div>

                      <div className="flex flex-col items-end justify-between gap-4">
                        <div className="text-right">
                          <div className="bg-yellow-400 text-white px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 shadow-lg shadow-yellow-100 mb-2">
                             <Star size={14} fill="currentColor"/> {res.rating}
                          </div>
                          <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Rata-rata</div>
                          <div className="text-lg font-black text-gray-800">Rp {calculateNetPrice(res.menu).toLocaleString()}</div>
                        </div>
                        <div className="flex gap-2 w-full md:w-auto">
                          <button onClick={() => { setSelectedResId(res.id); setView('detail'); }} className="flex-1 md:px-8 bg-orange-600 text-white py-3.5 rounded-2xl font-black hover:bg-orange-700 transition-all shadow-lg shadow-orange-100 active:scale-95 text-sm uppercase tracking-widest">Menu</button>
                          <button onClick={() => openInGoogleMaps(res.coords, res.name)} className="p-3.5 bg-gray-900 text-white rounded-2xl hover:bg-black transition-all shadow-lg active:scale-95"><Navigation size={20} /></button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-24 bg-white rounded-[4rem] border-4 border-dashed border-gray-50 flex flex-col items-center">
                  <Search className="text-gray-100 mb-4" size={84} strokeWidth={3} />
                  <p className="text-gray-300 font-black italic text-xl">Waduh, gak ketemu nih...</p>
                  <button onClick={() => {setSearchQuery(''); setSelectedArea('Semua Lokasi'); setMaxBudget(100000);}} className="mt-4 text-orange-500 font-bold text-sm underline underline-offset-8">Reset Filter</button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* DETAIL RESTO */}
        {view === 'detail' && selectedRes && (
          <div className="space-y-6 animate-in slide-in-from-right-8 duration-500">
            <button onClick={() => setView('landing')} className="text-orange-600 font-black flex items-center gap-2 hover:translate-x-[-6px] transition-transform text-sm uppercase tracking-widest">
               <ChevronLeft size={20}/> Kembali
            </button>
            <div className="bg-white p-10 rounded-[3.5rem] shadow-xl border border-gray-100">
              <div className="flex flex-col md:flex-row justify-between items-start mb-10 gap-8">
                <div className="space-y-3">
                  <div className="flex items-center gap-4 flex-wrap">
                    <h2 className="text-4xl font-black text-gray-900 italic tracking-tighter">{selectedRes.name}</h2>
                    <div className="bg-yellow-400 text-white px-4 py-1.5 rounded-2xl text-sm font-black flex items-center gap-2 shadow-lg shadow-yellow-50">
                       <Star size={18} fill="currentColor"/> {selectedRes.rating}
                    </div>
                  </div>
                  <div className="flex items-start gap-2 text-gray-400 max-w-md italic font-medium">
                    <MapPin size={20} className="mt-1 flex-shrink-0 text-orange-500" />
                    <p className="text-sm leading-relaxed">{selectedRes.address}</p>
                  </div>
                  <div className="flex items-center gap-4 pt-2">
                    <div className={`px-5 py-2 rounded-xl text-[10px] font-black tracking-widest shadow-lg ${selectedRes.isOpen ? 'bg-green-500 text-white shadow-green-100' : 'bg-red-500 text-white shadow-red-100'}`}>
                      {selectedRes.isOpen ? 'BUKA SEKARANG' : 'SEDANG TUTUP'}
                    </div>
                    <span className="text-xs font-bold text-gray-400 flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-xl">
                      <Clock size={16} className="text-orange-500"/> {selectedRes.openTime} - {selectedRes.closeTime}
                    </span>
                  </div>
                </div>
                <button onClick={() => openInGoogleMaps(selectedRes.coords, selectedRes.name)} className="w-full md:w-auto bg-gray-900 text-white px-8 py-5 rounded-[1.5rem] font-black flex items-center justify-center gap-3 hover:bg-black transition-all shadow-2xl active:scale-95 tracking-widest uppercase text-xs">
                  <Navigation size={20} /> Lihat Rute
                </button>
              </div>

              <div className="mb-12">
                <h3 className="text-xl font-black text-gray-900 mb-8 italic flex items-center gap-3">
                   <UtensilsCrossed size={24} className="text-orange-600"/> Daftar Menu & Harga
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  {selectedRes.menu.map(item => (
                    <div key={item.id} className="flex justify-between items-center p-6 bg-gray-50 rounded-[1.8rem] border border-transparent hover:border-orange-200 hover:bg-white hover:shadow-xl transition-all group">
                      <span className="text-gray-800 font-bold group-hover:text-orange-600 transition-colors">{item.name}</span>
                      <span className="text-gray-900 font-black tracking-tighter">Rp {item.price.toLocaleString()}</span>
                    </div>
                  ))}
                  {selectedRes.menu.length === 0 && <p className="text-gray-400 italic text-center py-8 bg-gray-50 rounded-3xl col-span-2">Belum ada daftar menu untuk tempat ini.</p>}
                </div>
              </div>

              <div className="border-t-2 border-dashed border-gray-100 pt-12">
                <h3 className="text-2xl font-black text-gray-900 mb-10 flex items-center gap-4 italic">
                  <Quote size={28} className="text-orange-600 fill-current opacity-20"/> Suara Pelanggan
                </h3>
                
                {(!user || user.isGuest) ? (
                  <div className="mb-12 p-14 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center text-gray-200 mb-6 shadow-sm">
                       <MessageSquare size={32} />
                    </div>
                    <p className="text-gray-500 font-black text-lg mb-8 italic tracking-tight">Mau kasih ulasan juga?<br/><span className="text-sm font-medium not-italic text-gray-400">Silakan masuk ke akun Anda dulu ya.</span></p>
                    <button 
                      onClick={() => { setView('auth'); setAuthMode('login'); }}
                      className="bg-orange-600 text-white px-12 py-4 rounded-[1.5rem] font-black shadow-xl shadow-orange-100 hover:bg-orange-700 transition-all active:scale-95 text-xs tracking-widest uppercase"
                    >
                      LOGIN SEKARANG
                    </button>
                  </div>
                ) : (
                  <div className="mb-12 p-8 bg-orange-50 rounded-[2.5rem] border border-orange-100 space-y-6 animate-in slide-in-from-bottom-4 duration-500">
                    <p className="font-black text-orange-900 text-sm italic">Berikan Penilaian Anda:</p>
                    <div className="flex gap-3 bg-white w-fit p-3 rounded-2xl shadow-sm">
                        {[1,2,3,4,5].map(s => <Star key={s} size={32} className={newRating >= s ? 'text-yellow-400 fill-current cursor-pointer hover:scale-125 transition-transform duration-300' : 'text-gray-100 cursor-pointer'} onClick={() => setNewRating(s)}/>)}
                    </div>
                    <textarea placeholder="Ceritakan suasana atau rasa makanannya..." className="w-full p-6 bg-white border-none rounded-[2rem] outline-none focus:ring-4 focus:ring-orange-200 h-36 font-medium text-sm shadow-inner transition-all italic" value={newComment} onChange={(e) => setNewComment(e.target.value)} />
                    <button onClick={() => { handleSubmitReview(selectedRes.id); showToast("Review berhasil dikirim!"); }} className="bg-gray-900 text-white px-10 py-4 rounded-2xl font-black flex items-center gap-3 hover:bg-black shadow-xl transition-all active:scale-95 text-xs tracking-widest uppercase">
                       <Send size={18} /> KIRIM REVIEW
                    </button>
                  </div>
                )}

                <div className="grid gap-6">
                  {selectedRes.reviews.map(rev => (
                    <div key={rev.id} className="p-8 bg-white border border-gray-100 rounded-[2.5rem] shadow-sm relative group hover:border-orange-100 transition-all">
                      <div className="flex justify-between items-start mb-6">
                        <div className="flex items-center gap-5">
                            <div className="w-14 h-14 rounded-[1.2rem] bg-orange-600 text-white flex items-center justify-center font-black text-xl shadow-lg shadow-orange-100 italic">{rev.user.charAt(0)}</div>
                            <div>
                              <span className="font-black text-gray-900 text-lg block italic">{rev.user}</span>
                              <div className="bg-yellow-400 text-white px-3 py-1 rounded-lg text-[10px] font-black inline-flex items-center gap-1.5 shadow-md shadow-yellow-50 mt-1">
                                <Star size={10} fill="currentColor"/> {rev.rating} / 5
                              </div>
                            </div>
                        </div>
                      </div>
                      <div className="relative">
                        <Quote size={40} className="absolute -left-2 -top-4 text-gray-50 opacity-10 group-hover:opacity-20 transition-opacity" />
                        <p className="text-gray-500 italic leading-relaxed text-sm relative z-10 pl-4 border-l-4 border-orange-50">"{rev.comment}"</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 4s infinite ease-in-out;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f8fafc;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #fdba74;
          border-radius: 10px;
        }+
        input[type=range]::-webkit-slider-thumb {
          box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
          border: 4px solid white;
          height: 24px;
          width: 24px;
        }
      `}} />
    </div>
  );
}