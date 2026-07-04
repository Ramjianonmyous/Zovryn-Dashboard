import React, { useState, useEffect, useRef } from 'react';
import './App.css';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true); // Default to collapsed for "full screen" feel
  const [profileDropdownShow, setProfileDropdownShow] = useState(false);
  const [notifDropdownShow, setNotifDropdownShow] = useState(false);
  const [accountDropdownShow, setAccountDropdownShow] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showFillUserDropdown, setShowFillUserDropdown] = useState(false);
  const [publicUsers, setPublicUsers] = useState([]);
  const [mails, setMails] = useState([
    { id: 1, from: 'Sarah Wilson', subject: 'Project Update', time: '10:30 AM' },
    { id: 2, from: 'Mike Johnson', subject: 'New Design', time: 'Yesterday' },
    { id: 3, from: 'Emily Chen', subject: 'Meeting', time: '2 days ago' }
  ]);
  const accountTimeoutRef = useRef(null);
  const fillUserTimeoutRef = useRef(null);

  useEffect(() => {
    const fetchPublicUsers = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/users/public`);
        const data = await res.json();
        if (data.success) setPublicUsers(data.data);
      } catch (error) {
        console.error('Failed to fetch public users:', error);
      }
    };
    fetchPublicUsers();
  }, [isLoggedIn]);
  const [chartView, setChartView] = useState('monthly');

  const handleLogin = async (email, password) => {
    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('token', data.data.token);
        setUser(data.data);
        setIsLoggedIn(true);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Login failed:', error);
    }
  };
  const [darkMode, setDarkMode] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  const handleProfile = (e) => {
    e.preventDefault();
    setCurrentView('profile');
    setProfileDropdownShow(false);
  };

  const handleSettings = (e) => {
    e.preventDefault();
    setCurrentView('settings');
    setProfileDropdownShow(false);
  };

  const handleBilling = (e) => {
    e.preventDefault();
    setCurrentView('billing');
    setProfileDropdownShow(false);
  };

  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem('token');
    setUser(null);
    setIsLoggedIn(false);
    setCurrentView('dashboard');
  };

  const [overview, setOverview] = useState(null);
  const [activity, setActivity] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [orderStats, setOrderStats] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [user, setUser] = useState(null);
  const [currentView, setCurrentView] = useState('dashboard');

  const [users, setUsers] = useState([
    { _id: 'u1', name: 'Sarah Wilson', email: 'sarah@example.com', role: 'Admin', status: 'active', avatar: 'https://picsum.photos/seed/u1/40/40.jpg' },
    { _id: 'u2', name: 'Michael Brown', email: 'michael@example.com', role: 'Editor', status: 'active', avatar: 'https://picsum.photos/seed/u2/40/40.jpg' },
    { _id: 'u3', name: 'Emma Davis', email: 'emma@example.com', role: 'User', status: 'inactive', avatar: 'https://picsum.photos/seed/u3/40/40.jpg' },
    { _id: 'u4', name: 'David Smith', email: 'david@example.com', role: 'Editor', status: 'active', avatar: 'https://picsum.photos/seed/u4/40/40.jpg' },
    { _id: 'u5', name: 'Olivia Taylor', email: 'olivia@example.com', role: 'User', status: 'inactive', avatar: 'https://picsum.photos/seed/u5/40/40.jpg' }
  ]);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSaveProfile = async (e) => {
    if (e) e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/api/auth/profile`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          name: user?.name,
          avatar: user?.avatar 
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setUser(data.data);
        alert('Profile updated successfully!');
      } else {
        alert(data.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert('Failed to update profile: Network error');
    }
  };

  const handleSavePassword = async (e) => {
    if (e) e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      alert('Please fill in all password fields');
      return;
    }
    if (newPassword !== confirmPassword) {
      alert('New password and confirm password do not match');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/api/auth/password`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          currentPassword,
          newPassword
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        alert('Password changed successfully!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        alert(data.message || 'Failed to update password');
      }
    } catch (error) {
      console.error('Failed to update password:', error);
      alert('Failed to update password: Network error');
    }
  };

  const toggleUserStatus = async (userId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    const token = localStorage.getItem('token');
    
    try {
      const res = await fetch(`${API_BASE}/api/users/${userId}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setUsers(users.map(u => u._id === userId ? { ...u, status: newStatus } : u));
      } else {
        alert(data.message || 'Failed to update user status');
      }
    } catch (error) {
      console.error('Failed to update user status:', error);
      alert('Failed to update user status: Network error');
    }
  };
  const [products, setProducts] = useState([]);
  const [productModal, setProductModal] = useState({ isOpen: false, mode: 'add', product: null });

  const handleDeleteProduct = async (id) => {
    if(!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE}/api/products/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if(res.ok) setProducts(products.filter(p => p._id !== id));
    } catch(e) { console.error('Delete failed:', e); }
  };

  const toggleSidebar = () => {
    if (window.innerWidth < 1024) {
      setSidebarOpen(!sidebarOpen);
    } else {
      setSidebarCollapsed(!sidebarCollapsed);
      setSidebarOpen(false);
    }
  };

  const closeMobileSidebar = () => {
    setSidebarOpen(false);
  };

  const toggleProfile = () => {
    setProfileDropdownShow(!profileDropdownShow);
    setNotifDropdownShow(false);
  };

  const toggleNotifications = () => {
    setNotifDropdownShow(!notifDropdownShow);
    setProfileDropdownShow(false);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);

    const handleClickOutside = (e) => {
      if (!e.target.closest('#profileButton') && !e.target.closest('#profileDropdown')) {
        setProfileDropdownShow(false);
      }
      if (!e.target.closest('#notifButton') && !e.target.closest('#notifDropdown')) {
        setNotifDropdownShow(false);
      }
    };
    document.addEventListener('click', handleClickOutside);

    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  // Fetch Data from Backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const baseUrl = `${API_BASE}/api/dashboard`;
        const token = localStorage.getItem('token');
        const fetchOpts = token ? { headers: { 'Authorization': `Bearer ${token}` } } : {};
        
        const [ovRes, actRes, revRes, catRes, statRes, notifRes, userRes, usersRes, prodRes] = await Promise.all([
          fetch(`${baseUrl}/overview?period=${chartView}`, fetchOpts),
          fetch(`${baseUrl}/activity`, fetchOpts),
          fetch(`${baseUrl}/revenue-chart?period=${chartView}`, fetchOpts),
          fetch(`${baseUrl}/sales-by-category`, fetchOpts),
          fetch(`${baseUrl}/order-stats`, fetchOpts),
          fetch(`${API_BASE}/api/notifications`, fetchOpts),
          fetch(`${API_BASE}/api/auth/me`, fetchOpts),
          fetch(`${API_BASE}/api/users/public`, fetchOpts),
          fetch(`${API_BASE}/api/products`, fetchOpts)
        ]);

        const ov = await ovRes.json();
        const act = await actRes.json();
        const rev = await revRes.json();
        const cat = await catRes.json();
        const stat = await statRes.json();
        const notif = await notifRes.json();
        const userData = await userRes.json();
        const usersData = await usersRes.json();
        const prodData = await prodRes.json();

        if (ov.success) setOverview(ov.data);
        if (act.success) setActivity(act.data);
        if (rev.success) setRevenueData(rev.data);
        if (cat.success) setCategoryData(cat.data);
        if (stat.success) setOrderStats(stat.data);
        if (notif.success) setNotifications(notif.data);
        if (userData.success) setUser(userData.data);
        if (usersData.success) setUsers(usersData.data);
        if (prodData.success) setProducts(prodData.data);
      } catch (e) {
        console.error('Failed to fetch data from backend, using fallback data.', e);
      }
    };
    fetchData();
  }, [chartView, isLoggedIn]);

  useEffect(() => {
    if (typeof Chart === 'undefined') return;

    // Hardcoded Fallbacks
    const fallbackRevenue = {
        weekly: [4200, 3800, 5100, 4700, 6200, 5800, 7100],
        monthly: [18000, 22000, 19500, 27000, 24000, 32000, 29000, 35000, 31000, 38000, 42000, 48352],
        yearly: [120000, 185000, 240000, 320000, 410000, 483520]
    };
    const fallbackLabels = {
        weekly: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
        monthly: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
        yearly: ['2019','2020','2021','2022','2023','2024']
    };
    const fallbackLast = {
        weekly: [3500, 3200, 4300, 3900, 5100, 4800, 5900],
        monthly: [15000, 18000, 17000, 21000, 20000, 25000, 23000, 27000, 26000, 30000, 33000, 36000],
        yearly: [95000, 145000, 190000, 260000, 340000, 400000]
    };

    let revenueChart, donutChart, barChart, sp1, sp2, sp3;

    // Revenue Chart
    const revenueCanvas = document.getElementById('revenueChart');
    if (revenueCanvas) {
        const revenueCtx = revenueCanvas.getContext('2d');
        const revenueGradient = revenueCtx.createLinearGradient(0, 0, 0, 280);
        revenueGradient.addColorStop(0, 'rgba(34,197,94,0.15)');
        revenueGradient.addColorStop(1, 'rgba(34,197,94,0)');

        const revenueGradient2 = revenueCtx.createLinearGradient(0, 0, 0, 280);
        revenueGradient2.addColorStop(0, 'rgba(59,130,246,0.08)');
        revenueGradient2.addColorStop(1, 'rgba(59,130,246,0)');

        const labels = revenueData.length > 0 ? revenueData.map(i => i.date) : fallbackLabels[chartView];
        const data = revenueData.length > 0 ? revenueData.map(i => i.revenue) : fallbackRevenue[chartView];
        const lastData = fallbackLast[chartView];

        revenueChart = new Chart(revenueCtx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Revenue',
                    data: data,
                    borderColor: '#22c55e',
                    backgroundColor: revenueGradient,
                    fill: true,
                    tension: 0.4,
                    borderWidth: 2.5,
                    pointRadius: 0,
                    pointHoverRadius: 6,
                    pointHoverBackgroundColor: '#22c55e',
                    pointHoverBorderColor: '#fff',
                    pointHoverBorderWidth: 3,
                }, {
                    label: 'Last Year',
                    data: lastData,
                    borderColor: '#3b82f6',
                    backgroundColor: revenueGradient2,
                    fill: true,
                    tension: 0.4,
                    borderWidth: 2,
                    borderDash: [5, 5],
                    pointRadius: 0,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: '#3b82f6',
                    pointHoverBorderColor: '#fff',
                    pointHoverBorderWidth: 3,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: { mode: 'index', intersect: false },
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: '#0f172a',
                        titleColor: '#f8fafc',
                        bodyColor: '#cbd5e1',
                        borderColor: '#1e293b',
                        borderWidth: 1,
                        padding: 12,
                        cornerRadius: 8,
                        displayColors: true,
                        boxWidth: 8,
                        boxHeight: 8,
                        boxPadding: 4,
                        callbacks: {
                            label: (ctx) => `${ctx.dataset.label}: $${ctx.parsed.y.toLocaleString()}`
                        }
                    }
                },
                scales: {
                    x: { grid: { display: false }, border: { display: false }, ticks: { padding: 8 } },
                    y: { grid: { color: 'rgba(226,232,240,0.6)', drawBorder: false }, border: { display: false }, ticks: { padding: 12, callback: (v) => '$' + (v / 1000) + 'k' } }
                }
            }
        });
    }

    // Donut Chart
    const donutCanvas = document.getElementById('donutChart');
    if (donutCanvas) {
        const donutLabels = categoryData.length > 0 ? categoryData.map(i => i.category) : ['Electronics','Clothing','Home & Garden','Sports'];
        const donutData = categoryData.length > 0 ? categoryData.map(i => i.value) : [18420, 12680, 9240, 8012];
        const donutColors = categoryData.length > 0 ? categoryData.map(i => i.color) : ['#22c55e','#3b82f6','#8b5cf6','#f59e0b'];

        donutChart = new Chart(donutCanvas, {
            type: 'doughnut',
            data: {
                labels: donutLabels,
                datasets: [{
                    data: donutData,
                    backgroundColor: donutColors,
                    borderColor: '#fff',
                    borderWidth: 3,
                    hoverOffset: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '72%',
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: '#0f172a',
                        titleColor: '#f8fafc',
                        bodyColor: '#cbd5e1',
                        borderColor: '#1e293b',
                        borderWidth: 1,
                        padding: 12,
                        cornerRadius: 8,
                        callbacks: {
                            label: (ctx) => ` ${ctx.label}: $${ctx.parsed.toLocaleString()}`
                        }
                    }
                }
            }
        });
    }

    // Bar Chart
    const barCanvas = document.getElementById('barChart');
    if (barCanvas) {
        const barLabels = orderStats.length > 0 ? orderStats.map(i => i.date) : ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
        const barCompleted = orderStats.length > 0 ? orderStats.map(i => i.completed) : [120, 145, 132, 168, 155, 98, 87];
        const barPending = orderStats.length > 0 ? orderStats.map(i => i.pending) : [45, 52, 38, 62, 48, 32, 28];

        barChart = new Chart(barCanvas, {
            type: 'bar',
            data: {
                labels: barLabels,
                datasets: [{
                    label: 'Completed',
                    data: barCompleted,
                    backgroundColor: '#22c55e',
                    borderRadius: 6,
                    barPercentage: 0.6,
                    categoryPercentage: 0.7
                }, {
                    label: 'Pending',
                    data: barPending,
                    backgroundColor: '#e2e8f0',
                    borderRadius: 6,
                    barPercentage: 0.6,
                    categoryPercentage: 0.7
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: '#0f172a',
                        titleColor: '#f8fafc',
                        bodyColor: '#cbd5e1',
                        borderColor: '#1e293b',
                        borderWidth: 1,
                        padding: 12,
                        cornerRadius: 8,
                    }
                },
                scales: {
                    x: { grid: { display: false }, border: { display: false }, ticks: { padding: 8 } },
                    y: { grid: { color: 'rgba(226,232,240,0.6)', drawBorder: false }, border: { display: false }, ticks: { padding: 12 } }
                }
            }
        });
    }

    // Sparklines
    function createSparkline(id, data, color) {
        const canvas = document.getElementById(id);
        if (!canvas) return null;
        const ctx = canvas.getContext('2d');
        const gradient = ctx.createLinearGradient(0, 0, 0, 60);
        gradient.addColorStop(0, color.replace(')', ',0.15)').replace('rgb', 'rgba'));
        gradient.addColorStop(1, color.replace(')', ',0').replace('rgb', 'rgba'));
        return new Chart(ctx, {
            type: 'line',
            data: {
                labels: data.map((_, i) => i),
                datasets: [{
                    data: data,
                    borderColor: color,
                    backgroundColor: gradient,
                    fill: true,
                    tension: 0.4,
                    borderWidth: 2,
                    pointRadius: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false }, tooltip: { enabled: false } },
                scales: {
                    x: { display: false },
                    y: { display: false }
                }
            }
        });
    }

    sp1 = createSparkline('sparkline1', [18, 22, 19, 27, 24, 32, 29, 35, 31, 28, 34, 38], 'rgb(34,197,94)');
    sp2 = createSparkline('sparkline2', [2.1, 2.4, 2.2, 2.8, 2.6, 3.0, 2.9, 3.1, 2.8, 3.2, 3.0, 3.24], 'rgb(34,197,94)');
    sp3 = createSparkline('sparkline3', [320, 295, 310, 280, 275, 290, 285, 270, 288, 276, 290, 284.5], 'rgb(239,68,68)');

    return () => {
        if (revenueChart) revenueChart.destroy();
        if (donutChart) donutChart.destroy();
        if (barChart) barChart.destroy();
        if (sp1) sp1.destroy();
        if (sp2) sp2.destroy();
        if (sp3) sp3.destroy();
    };
  }, [revenueData, categoryData, orderStats, chartView, currentView]);

  return (
    <div className={darkMode ? 'dark' : ''}>
      {!isLoggedIn ? (
        <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-slate-50 to-pink-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
          {/* Animated Background Shapes */}
          <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 dark:bg-purple-700 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 dark:bg-yellow-700 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 dark:bg-pink-700 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>

          <style>{`
            @keyframes blob {
              0% { transform: translate(0px, 0px) scale(1); }
              33% { transform: translate(30px, -50px) scale(1.1); }
              66% { transform: translate(-20px, 20px) scale(0.9); }
              100% { transform: translate(0px, 0px) scale(1); }
            }
            .animate-blob {
              animation: blob 7s infinite;
            }
            .animation-delay-2000 {
              animation-delay: 2s;
            }
            .animation-delay-4000 {
              animation-delay: 4s;
            }
            .animate-fade-in-up {
              animation: fadeInUp 0.6s ease-out forwards;
            }
            @keyframes fadeInUp {
              from { opacity: 0; transform: translateY(20px); }
              to { opacity: 1; transform: translateY(0); }
            }
          `}</style>

          <div className="w-full max-w-md bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white dark:border-slate-700/50 p-8 space-y-6 relative z-10 animate-fade-in-up">
            <div className="text-center">
              <div className="w-12 h-12 rounded-xl bg-brand-500 flex items-center justify-center mx-auto mb-4">
                <iconify-icon icon="lucide:zap" width="24" className="text-white"></iconify-icon>
              </div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Welcome to Apex</h1>
              <p className="text-sm text-slate-500 mt-1">Please sign in to your account</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
                <input 
                  type="email" 
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="name@example.com" 
                  className="block w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Password</label>
                <input 
                  type="password" 
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••" 
                  className="block w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500" 
                />
              </div>

              <button 
                onClick={() => handleLogin(loginEmail, loginPassword)}
                className="w-full bg-brand-500 hover:bg-brand-600 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 mt-2"
              >
                Sign In
              </button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-2 bg-white dark:bg-slate-800 text-slate-500">Quick Fill</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => { setLoginEmail('admin@apex.io'); setLoginPassword('admin123'); handleLogin('admin@apex.io', 'admin123'); }}
                  className="bg-slate-50 dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-600 font-medium py-2 px-3 rounded-lg transition-colors flex items-center justify-center gap-1.5 text-xs"
                >
                  <iconify-icon icon="lucide:shield" width="14"></iconify-icon>
                  Fill & Login Admin
                </button>
                
                <div 
                  className="relative"
                  onMouseEnter={() => {
                    if (fillUserTimeoutRef.current) clearTimeout(fillUserTimeoutRef.current);
                    setShowFillUserDropdown(true);
                  }}
                  onMouseLeave={() => {
                    fillUserTimeoutRef.current = setTimeout(() => {
                      setShowFillUserDropdown(false);
                    }, 500); // 500ms delay for a slower feel
                  }}
                >
                  <button 
                    className="w-full h-full bg-slate-50 dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-600 font-medium py-2 px-3 rounded-lg transition-colors flex items-center justify-center gap-1.5 text-xs"
                  >
                    <iconify-icon icon="lucide:user" width="14"></iconify-icon>
                    Fill User
                    <iconify-icon icon="lucide:chevron-down" width="12" className="ml-auto"></iconify-icon>
                  </button>
                  
                  {/* Dropdown on Hover */}
                  <div className={`absolute left-0 bottom-full mb-2 w-56 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 py-1 z-50 ${showFillUserDropdown ? 'block' : 'hidden'}`}>
                    <div className="px-3 py-1.5 text-xs font-semibold text-slate-500 border-b border-slate-100 dark:border-slate-700 mb-1">Select a Real User</div>
                    
                    <div className="max-h-60 overflow-y-auto">
                      {publicUsers.map(u => (
                        <a href="#" key={u._id} onClick={(e) => { e.preventDefault(); setLoginEmail(u.email); setLoginPassword('password123'); handleLogin(u.email, 'password123'); }} className="flex items-center justify-between px-3 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                          <span>{u.name}</span>
                          <span className={`text-[10px] ${u.status === 'active' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'} px-1.5 py-0.5 rounded-full font-medium`}>{u.status === 'active' ? 'Active' : 'Inactive'}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Mobile Overlay */}
      <div id="mobileOverlay" className={`mobile-overlay ${sidebarOpen ? 'show' : ''}`} onClick={closeMobileSidebar}></div>

      {/* Sidebar */}
      <aside id="sidebar" className={`sidebar fixed top-0 left-0 h-screen bg-sidebar-bg flex flex-col z-50 ${sidebarCollapsed ? 'collapsed' : ''} ${sidebarOpen ? 'mobile-open' : ''}`}>
          {/* Logo */}
          <div className="flex items-center gap-3 px-5 h-16 border-b border-sidebar-border shrink-0">
              <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center shrink-0">
                  <iconify-icon icon="lucide:zap" width="18" className="text-white"></iconify-icon>
              </div>
              <span className="sidebar-logo-text text-white font-bold text-lg tracking-tight">Apex</span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
              <p className="sidebar-section-title text-[10px] uppercase tracking-widest text-sidebar-text/50 font-semibold px-3 mb-2">Main</p>

              <a href="#" onClick={() => setCurrentView('dashboard')} className={`sidebar-nav-item flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${currentView === 'dashboard' ? 'bg-sidebar-active text-sidebar-activetext' : 'text-sidebar-text hover:bg-sidebar-hover hover:text-sidebar-activetext'}`}>
                  <iconify-icon icon="lucide:layout-dashboard" width="18"></iconify-icon>
                  <span className="sidebar-label">Dashboard</span>
              </a>
              <a href="#" onClick={() => setCurrentView('ecommerce')} className={`sidebar-nav-item flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${currentView === 'ecommerce' ? 'bg-sidebar-active text-sidebar-activetext' : 'text-sidebar-text hover:bg-sidebar-hover hover:text-sidebar-activetext'}`}>
                  <iconify-icon icon="lucide:shopping-cart" width="18"></iconify-icon>
                  <span className="sidebar-label">E-Commerce</span>
                  <iconify-icon icon="lucide:chevron-right" width="14" className="sidebar-label ml-auto opacity-40"></iconify-icon>
              </a>
              {user?.role === 'admin' && (
                  <a href="#" onClick={() => setCurrentView('users')} className={`sidebar-nav-item flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${currentView === 'users' ? 'bg-sidebar-active text-sidebar-activetext' : 'text-sidebar-text hover:bg-sidebar-hover hover:text-sidebar-activetext'}`}>
                      <iconify-icon icon="lucide:users" width="18"></iconify-icon>
                      <span className="sidebar-label">Users</span>
                      <span className="sidebar-badge ml-auto text-[10px] bg-brand-500/20 text-brand-400 px-1.5 py-0.5 rounded-full font-semibold">{users.length}</span>
                  </a>
              )}
              <a href="#" onClick={() => setCurrentView('mail')} className={`sidebar-nav-item flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${currentView === 'mail' ? 'bg-sidebar-active text-sidebar-activetext' : 'text-sidebar-text hover:bg-sidebar-hover hover:text-sidebar-activetext'}`}>
                  <iconify-icon icon="lucide:mail" width="18"></iconify-icon>
                  <span className="sidebar-label">Mail</span>
                  <span className="sidebar-badge ml-auto text-[10px] bg-red-500/20 text-red-400 px-1.5 py-0.5 rounded-full font-semibold badge-pulse">{mails.length}</span>
              </a>

              <p className="sidebar-section-title text-[10px] uppercase tracking-widest text-sidebar-text/50 font-semibold px-3 mb-2 mt-6">Management</p>

              <a href="#" onClick={() => setCurrentView('calendar')} className={`sidebar-nav-item flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${currentView === 'calendar' ? 'bg-sidebar-active text-sidebar-activetext' : 'text-sidebar-text hover:bg-sidebar-hover hover:text-sidebar-activetext'}`}>
                  <iconify-icon icon="lucide:calendar" width="18"></iconify-icon>
                  <span className="sidebar-label">Calendar</span>
              </a>
              <a href="#" onClick={() => setCurrentView('invoices')} className={`sidebar-nav-item flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${currentView === 'invoices' ? 'bg-sidebar-active text-sidebar-activetext' : 'text-sidebar-text hover:bg-sidebar-hover hover:text-sidebar-activetext'}`}>
                  <iconify-icon icon="lucide:file-check" width="18"></iconify-icon>
                  <span className="sidebar-label">Invoices</span>
                  <iconify-icon icon="lucide:chevron-right" width="14" className="sidebar-label ml-auto opacity-40"></iconify-icon>
              </a>
              <a href="#" onClick={() => setCurrentView('analytics')} className={`sidebar-nav-item flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${currentView === 'analytics' ? 'bg-sidebar-active text-sidebar-activetext' : 'text-sidebar-text hover:bg-sidebar-hover hover:text-sidebar-activetext'}`}>
                  <iconify-icon icon="lucide:bar-chart-3" width="18"></iconify-icon>
                  <span className="sidebar-label">Analytics</span>
              </a>
              {user?.role === 'admin' && (
                  <a href="#" onClick={() => setCurrentView('campaigns')} className={`sidebar-nav-item flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${currentView === 'campaigns' ? 'bg-sidebar-active text-sidebar-activetext' : 'text-sidebar-text hover:bg-sidebar-hover hover:text-sidebar-activetext'}`}>
                      <iconify-icon icon="lucide:flag" width="18"></iconify-icon>
                      <span className="sidebar-label">Campaigns</span>
                  </a>
              )}

              <p className="sidebar-section-title text-[10px] uppercase tracking-widest text-sidebar-text/50 font-semibold px-3 mb-2 mt-6">Other</p>

              <a href="#" onClick={() => setCurrentView('account')} className={`sidebar-nav-item flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${currentView === 'account' ? 'bg-sidebar-active text-sidebar-activetext' : 'text-sidebar-text hover:bg-sidebar-hover hover:text-sidebar-activetext'}`}>
                  <iconify-icon icon="lucide:user" width="18"></iconify-icon>
                  <span className="sidebar-label">Account</span>
              </a>

              <a href="#" onClick={() => setCurrentView('settings')} className={`sidebar-nav-item flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${currentView === 'settings' ? 'bg-sidebar-active text-sidebar-activetext' : 'text-sidebar-text hover:bg-sidebar-hover hover:text-sidebar-activetext'}`}>
                  <iconify-icon icon="lucide:settings" width="18"></iconify-icon>
                  <span className="sidebar-label">Settings</span>
              </a>
              <a href="#" onClick={() => setCurrentView('help')} className={`sidebar-nav-item flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${currentView === 'help' ? 'bg-sidebar-active text-sidebar-activetext' : 'text-sidebar-text hover:bg-sidebar-hover hover:text-sidebar-activetext'}`}>
                  <iconify-icon icon="lucide:help-circle" width="18"></iconify-icon>
                  <span className="sidebar-label">Help Center</span>
              </a>
          </nav>

          {/* Sidebar Footer */}
          <div className="px-3 py-4 border-t border-sidebar-border shrink-0">
               <div 
                   onMouseEnter={() => {
                       if (accountTimeoutRef.current) clearTimeout(accountTimeoutRef.current);
                       setAccountDropdownShow(true);
                   }} 
                   onMouseLeave={() => {
                       accountTimeoutRef.current = setTimeout(() => {
                           setAccountDropdownShow(false);
                       }, 300);
                   }} 
                   className="sidebar-submenu flex items-center gap-3 px-3 py-2.5 rounded-lg bg-sidebar-hover cursor-pointer relative"
               >
                   <img src={user?.avatar || "https://picsum.photos/seed/admin-avatar/80/80.jpg"} className="w-8 h-8 rounded-full object-cover shrink-0" alt="avatar" />
                   <div className="min-w-0">
                       <p className="text-sm font-medium text-white truncate">{user?.name || 'John Doe'}</p>
                       <p className="text-[11px] text-sidebar-text truncate">{user?.email || 'admin@apex.io'}</p>
                   </div>
                   <iconify-icon icon="lucide:more-vertical" width="16" className="sidebar-label text-sidebar-text ml-auto shrink-0 cursor-pointer hover:text-white transition-colors"></iconify-icon>
                   
                   {/* Dropdown */}
                   {accountDropdownShow && (
                       <div className="absolute bottom-full left-0 mb-2 w-full bg-white dark:bg-slate-900 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 py-1 z-50">
                           <a href="#" onClick={(e) => { e.stopPropagation(); setCurrentView('account'); setAccountDropdownShow(false); }} className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                               <iconify-icon icon="lucide:user" width="16"></iconify-icon>
                               Profile
                           </a>
                           <a href="#" onClick={(e) => { e.stopPropagation(); setCurrentView('settings'); setAccountDropdownShow(false); }} className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                               <iconify-icon icon="lucide:settings" width="16"></iconify-icon>
                               Settings
                           </a>
                           <div className="border-t border-slate-100 dark:border-slate-800 my-1"></div>
                           <a href="#" onClick={(e) => { e.stopPropagation(); handleLogout(e); }} className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                               <iconify-icon icon="lucide:log-out" width="16"></iconify-icon>
                               Logout
                           </a>
                       </div>
                   )}
               </div>
          </div>
      </aside>

      {/* Main Content */}
      <div id="mainContent" className={`main-content min-h-screen ${sidebarCollapsed ? 'expanded' : ''}`}>
          {/* Header */}
          <header className="sticky top-0 z-30 bg-white dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700/80">
              <div className="flex items-center justify-between h-16 px-4 lg:px-6">
                  <div className="flex items-center gap-3">
                      <button onClick={toggleSidebar} className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 flex items-center justify-center transition-colors">
                          <iconify-icon icon="lucide:menu" width="18" className="text-slate-600"></iconify-icon>
                      </button>
                      <div className="hidden sm:flex items-center gap-2 bg-slate-100 dark:bg-slate-800 rounded-lg px-3 py-2 w-72">
                          <iconify-icon icon="lucide:search" width="16" className="text-slate-400"></iconify-icon>
                          <input type="text" placeholder="Search anything..." className="bg-transparent text-sm outline-none w-full text-slate-700 dark:text-slate-300 placeholder:text-slate-400" />
                          <kbd className="hidden md:inline text-[10px] font-medium text-slate-400 bg-white dark:bg-slate-900 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700">⌘K</kbd>
                      </div>
                  </div>
                  <div className="flex items-center gap-2">
                      <button className="sm:hidden w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 flex items-center justify-center transition-colors">
                          <iconify-icon icon="lucide:search" width="18" className="text-slate-600"></iconify-icon>
                      </button>
                      <div className="relative">
                          <button id="notifButton" className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 flex items-center justify-center transition-colors relative" onClick={toggleNotifications}>
                              <iconify-icon icon="lucide:bell" width="18" className="text-slate-600"></iconify-icon>
                              {notifications.length > 0 && <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">{notifications.length}</span>}
                          </button>
                          
                          {/* Notifications Dropdown */}
                          <div id="notifDropdown" className={`dropdown absolute right-0 top-full mt-2 w-72 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-lg shadow-slate-200/50 py-2 z-50 ${notifDropdownShow ? 'show' : ''}`}>
                              <div className="px-4 py-2 border-b border-slate-100">
                                  <p className="text-sm font-semibold text-slate-800">Notifications</p>
                              </div>
                              <div className="max-h-64 overflow-y-auto">
                                  {notifications.length > 0 ? notifications.map((notif, index) => (
                                      <a href="#" key={index} className="flex items-center gap-3 px-4 py-3 border-b border-slate-50 hover:bg-slate-50 transition-colors">
                                          <div className={`w-8 h-8 rounded-full bg-${notif.color}-50 flex items-center justify-center shrink-0`}>
                                              <iconify-icon icon={notif.icon} width="16" className={`text-${notif.color}-600`}></iconify-icon>
                                          </div>
                                          <div>
                                              <p className="text-sm text-slate-700 dark:text-slate-300"><span className="font-medium">{notif.title}</span> — {notif.message}</p>
                                              <p className="text-xs text-slate-400 mt-0.5">{new Date(notif.createdAt).toLocaleTimeString()}</p>
                                          </div>
                                      </a>
                                  )) : (
                                      <div className="px-4 py-3 text-sm text-slate-500 text-center">No notifications</div>
                                  )}
                              </div>
                              <div className="px-4 py-2 text-center border-t border-slate-100">
                                  <a href="#" onClick={() => { setCurrentView('notifications'); setNotifDropdownShow(false); }} className="text-xs font-medium text-brand-600 hover:text-brand-700 transition-colors">View all notifications</a>
                              </div>
                          </div>
                      </div>
                      <button onClick={toggleDarkMode} className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 flex items-center justify-center transition-colors">
                          <iconify-icon icon={darkMode ? "lucide:sun" : "lucide:moon"} width="18" className="text-slate-600"></iconify-icon>
                      </button>
                      <div className="relative" onMouseEnter={() => setProfileDropdownShow(true)} onMouseLeave={() => setProfileDropdownShow(false)}>
                          <button id="profileButton" className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-lg hover:bg-slate-100 dark:bg-slate-800 transition-colors">
                              <img src={user?.avatar || "https://picsum.photos/seed/admin-avatar/80/80.jpg"} className="w-8 h-8 rounded-full object-cover" alt="avatar" />
                              <span className="hidden md:block text-sm font-medium text-slate-700 dark:text-slate-300">{user?.name || 'John Doe'}</span>
                              <iconify-icon icon="lucide:chevron-down" width="14" className="hidden md:block text-slate-400"></iconify-icon>
                          </button>

                          {/* Profile Dropdown */}
                          <div id="profileDropdown" className={`dropdown absolute right-0 top-full mt-2 w-56 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-lg shadow-slate-200/50 py-2 z-50 ${profileDropdownShow ? 'show' : ''}`}>
                              <div className="px-4 py-2 border-b border-slate-100">
                                  <p className="text-sm font-semibold text-slate-800">{user?.name || 'John Doe'}</p>
                                  <p className="text-xs text-slate-500">{user?.email || 'admin@apex.io'}</p>
                              </div>
                              <a href="#" onClick={handleProfile} className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 transition-colors">
                                  <iconify-icon icon="lucide:user" width="16"></iconify-icon> My Profile
                              </a>
                              <a href="#" onClick={handleSettings} className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 transition-colors">
                                  <iconify-icon icon="lucide:settings" width="16"></iconify-icon> Settings
                              </a>
                              <a href="#" onClick={handleBilling} className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 transition-colors">
                                  <iconify-icon icon="lucide:credit-card" width="16"></iconify-icon> Billing
                              </a>
                              <div className="border-t border-slate-100 mt-1 pt-1">
                                  <a href="#" onClick={handleLogout} className="flex items-center gap-2.5 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">
                                      <iconify-icon icon="lucide:log-out" width="16"></iconify-icon> Log out
                                  </a>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </header>

          {/* Page Content */}
          <main className="p-4 lg:p-6 space-y-6">
              {currentView === 'dashboard' && (
                  <>
                      {/* Page Title */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                          <div>
                              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
                              <p className="text-sm text-slate-500 mt-0.5">Welcome back, John! Here's what's happening.</p>
                          </div>
                          <div className="flex items-center gap-2">
                              <select onChange={(e) => setChartView(e.target.value.toLowerCase().replace(' ', ''))} value={chartView} className="text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-600 outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 cursor-pointer">
                                  <option value="monthly">This Month</option>
                                  <option value="weekly">This Week</option>
                                  <option value="yearly">This Year</option>
                              </select>
                              <button className="flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
                                  <iconify-icon icon="lucide:download" width="16"></iconify-icon>
                                  <span className="hidden sm:inline">Export</span>
                              </button>
                          </div>
                      </div>

                      {/* Stat Cards */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                          {/* Revenue */}
                          <div className="stat-card bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
                              <div className="flex items-center justify-between mb-4">
                                  <div className="w-10 h-10 rounded-lg bg-brand-50 flex items-center justify-center">
                                      <iconify-icon icon="lucide:dollar-sign" width="20" className="text-brand-600"></iconify-icon>
                                  </div>
                                  <span className={`flex items-center gap-1 text-xs font-semibold ${overview?.revenue?.growth >= 0 ? 'text-brand-600 bg-brand-50' : 'text-red-600 bg-red-50'} px-2 py-1 rounded-full`}>
                                      <iconify-icon icon={overview?.revenue?.growth >= 0 ? "lucide:trending-up" : "lucide:trending-down"} width="12"></iconify-icon> {overview?.revenue?.growth >= 0 ? '+' : ''}{overview?.revenue?.growth}%
                                  </span>
                              </div>
                              <p className="text-2xl font-bold text-slate-900 dark:text-white">${overview?.revenue?.value?.toLocaleString() || '48,352'}</p>
                              <p className="text-sm text-slate-500 mt-1">Total Revenue</p>
                              <div className="mt-3 flex items-center gap-2">
                                  <div className="flex-1 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                      <div className="h-full bg-brand-500 rounded-full" style={{width:'75%'}}></div>
                                  </div>
                                  <span className="text-[11px] text-slate-400 font-medium">75%</span>
                              </div>
                          </div>

                          {/* Orders */}
                          <div className="stat-card bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
                              <div className="flex items-center justify-between mb-4">
                                  <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                                      <iconify-icon icon="lucide:shopping-bag" width="20" className="text-blue-600"></iconify-icon>
                                  </div>
                                  <span className={`flex items-center gap-1 text-xs font-semibold ${overview?.orders?.growth >= 0 ? 'text-brand-600 bg-brand-50' : 'text-red-600 bg-red-50'} px-2 py-1 rounded-full`}>
                                      <iconify-icon icon={overview?.orders?.growth >= 0 ? "lucide:trending-up" : "lucide:trending-down"} width="12"></iconify-icon> {overview?.orders?.growth >= 0 ? '+' : ''}{overview?.orders?.growth}%
                                  </span>
                              </div>
                              <p className="text-2xl font-bold text-slate-900 dark:text-white">{overview?.orders?.value?.toLocaleString() || '3,847'}</p>
                              <p className="text-sm text-slate-500 mt-1">Total Orders</p>
                              <div className="mt-3 flex items-center gap-2">
                                  <div className="flex-1 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                      <div className="h-full bg-blue-500 rounded-full" style={{width:'62%'}}></div>
                                  </div>
                                  <span className="text-[11px] text-slate-400 font-medium">62%</span>
                              </div>
                          </div>

                          {/* Customers */}
                          <div className="stat-card bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
                              <div className="flex items-center justify-between mb-4">
                                  <div className="w-10 h-10 rounded-lg bg-violet-50 flex items-center justify-center">
                                      <iconify-icon icon="lucide:users" width="20" className="text-violet-600"></iconify-icon>
                                  </div>
                                  <span className={`flex items-center gap-1 text-xs font-semibold ${overview?.customers?.growth >= 0 ? 'text-brand-600 bg-brand-50' : 'text-red-600 bg-red-50'} px-2 py-1 rounded-full`}>
                                      <iconify-icon icon={overview?.customers?.growth >= 0 ? "lucide:trending-up" : "lucide:trending-down"} width="12"></iconify-icon> {overview?.customers?.growth >= 0 ? '+' : ''}{overview?.customers?.growth}%
                                  </span>
                              </div>
                              <p className="text-2xl font-bold text-slate-900 dark:text-white">{overview?.customers?.value?.toLocaleString() || '18,294'}</p>
                              <p className="text-sm text-slate-500 mt-1">Total Customers</p>
                              <div className="mt-3 flex items-center gap-2">
                                  <div className="flex-1 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                      <div className="h-full bg-violet-500 rounded-full" style={{width:'85%'}}></div>
                                  </div>
                                  <span className="text-[11px] text-slate-400 font-medium">85%</span>
                              </div>
                          </div>

                          {/* Growth */}
                          <div className="stat-card bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
                              <div className="flex items-center justify-between mb-4">
                                  <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
                                      <iconify-icon icon="lucide:trending-up" width="20" className="text-amber-600"></iconify-icon>
                                  </div>
                                  <span className="flex items-center gap-1 text-xs font-semibold text-brand-600 bg-brand-50 px-2 py-1 rounded-full">
                                      <iconify-icon icon="lucide:trending-up" width="12"></iconify-icon> +18.7%
                                  </span>
                              </div>
                              <p className="text-2xl font-bold text-slate-900 dark:text-white">{overview?.avgOrderValue?.value ? `$${overview.avgOrderValue.value}` : '$284.50'}</p>
                              <p className="text-sm text-slate-500 mt-1">Avg. Order Value</p>
                              <div className="mt-3 flex items-center gap-2">
                                  <div className="flex-1 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                      <div className="h-full bg-amber-500 rounded-full" style={{width:'48%'}}></div>
                                  </div>
                                  <span className="text-[11px] text-slate-400 font-medium">48%</span>
                              </div>
                          </div>
                      </div>

                      {/* Charts Row */}
                      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                          {/* Revenue Chart */}
                          <div className="xl:col-span-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
                              <div className="flex items-center justify-between mb-6">
                                  <div>
                                      <h3 className="text-base font-semibold text-slate-900 dark:text-white">Revenue Overview</h3>
                                      <p className="text-sm text-slate-500 mt-0.5">Monthly revenue performance</p>
                                  </div>
                                  <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 rounded-lg p-0.5">
                                      <button onClick={() => setChartView('weekly')} className={`text-xs font-medium px-3 py-1.5 rounded-md transition-colors ${chartView === 'weekly' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:text-slate-300'}`}>Weekly</button>
                                      <button onClick={() => setChartView('monthly')} className={`text-xs font-medium px-3 py-1.5 rounded-md transition-colors ${chartView === 'monthly' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:text-slate-300'}`}>Monthly</button>
                                      <button onClick={() => setChartView('yearly')} className={`text-xs font-medium px-3 py-1.5 rounded-md transition-colors ${chartView === 'yearly' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:text-slate-300'}`}>Yearly</button>
                                  </div>
                              </div>
                              <div className="h-[280px]">
                                  <canvas id="revenueChart"></canvas>
                              </div>
                          </div>

                          {/* Donut Chart */}
                          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
                              <div className="mb-6">
                                  <h3 className="text-base font-semibold text-slate-900 dark:text-white">Sales by Category</h3>
                                  <p className="text-sm text-slate-500 mt-0.5">Revenue distribution</p>
                              </div>
                              <div className="h-[200px] flex items-center justify-center">
                                  <canvas id="donutChart"></canvas>
                              </div>
                              <div className="mt-4 space-y-2.5">
                                  {categoryData.length > 0 ? categoryData.map((item, index) => (
                                      <div key={index} className="flex items-center justify-between">
                                          <div className="flex items-center gap-2">
                                              <span className="w-2.5 h-2.5 rounded-full" style={{backgroundColor: item.color}}></span>
                                              <span className="text-sm text-slate-600">{item.category}</span>
                                          </div>
                                          <span className="text-sm font-semibold text-slate-800">${item.value.toLocaleString()}</span>
                                      </div>
                                  )) : (
                                      <>
                                          <div className="flex items-center justify-between">
                                              <div className="flex items-center gap-2">
                                                  <span className="w-2.5 h-2.5 rounded-full bg-brand-500"></span>
                                                  <span className="text-sm text-slate-600">Electronics</span>
                                              </div>
                                              <span className="text-sm font-semibold text-slate-800">$18,420</span>
                                          </div>
                                          <div className="flex items-center justify-between">
                                              <div className="flex items-center gap-2">
                                                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                                                  <span className="text-sm text-slate-600">Clothing</span>
                                              </div>
                                              <span className="text-sm font-semibold text-slate-800">$12,680</span>
                                          </div>
                                      </>
                                  )}
                              </div>
                          </div>
                      </div>

                      {/* Bottom Row */}
                      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                          {/* Recent Orders Table */}
                          <div className="xl:col-span-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
                              <div className="flex items-center justify-between p-5 border-b border-slate-100">
                                  <div>
                                      <h3 className="text-base font-semibold text-slate-900 dark:text-white">Recent Orders</h3>
                                      <p className="text-sm text-slate-500 mt-0.5">Latest transactions</p>
                                  </div>
                                  <a href="#" className="text-sm font-medium text-brand-600 hover:text-brand-700 transition-colors flex items-center gap-1">
                                      View All <iconify-icon icon="lucide:arrow-right" width="14"></iconify-icon>
                                  </a>
                              </div>
                              <div className="overflow-x-auto">
                                  <table className="w-full">
                                      <thead>
                                          <tr className="border-b border-slate-100">
                                              <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">Order ID</th>
                                              <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">Customer</th>
                                              <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">Product</th>
                                              <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">Amount</th>
                                              <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">Status</th>
                                          </tr>
                                      </thead>
                                      <tbody>
                                          {activity.filter(a => a.type === 'order').slice(0, 5).map((order, index) => (
                                              <tr key={index} className="table-row border-b border-slate-50">
                                                  <td className="px-5 py-3.5 text-sm font-medium text-slate-800">{order.title}</td>
                                                  <td className="px-5 py-3.5">
                                                      <div className="flex items-center gap-2.5">
                                                          <img src={`https://picsum.photos/seed/${order.title}/64/64.jpg`} className="w-7 h-7 rounded-full object-cover" alt="" />
                                                          <span className="text-sm text-slate-700 dark:text-slate-300">{order.message.split('by ')[1]}</span>
                                                      </div>
                                                  </td>
                                                  <td className="px-5 py-3.5 text-sm text-slate-600">Product</td>
                                                  <td className="px-5 py-3.5 text-sm font-semibold text-slate-800">$1,000</td>
                                                  <td className="px-5 py-3.5"><span className={`text-xs font-medium bg-${order.color}-50 text-${order.color}-700 px-2.5 py-1 rounded-full`}>{order.message.split(' by')[0]}</span></td>
                                              </tr>
                                          ))}
                                          {activity.filter(a => a.type === 'order').length === 0 && (
                                              <>
                                                  <tr className="table-row border-b border-slate-50">
                                                      <td className="px-5 py-3.5 text-sm font-medium text-slate-800">#ORD-7821</td>
                                                      <td className="px-5 py-3.5">
                                                          <div className="flex items-center gap-2.5">
                                                              <img src="https://picsum.photos/seed/user1/64/64.jpg" className="w-7 h-7 rounded-full object-cover" alt="" />
                                                              <span className="text-sm text-slate-700 dark:text-slate-300">Sarah Wilson</span>
                                                          </div>
                                                      </td>
                                                      <td className="px-5 py-3.5 text-sm text-slate-600">MacBook Pro 16"</td>
                                                      <td className="px-5 py-3.5 text-sm font-semibold text-slate-800">$2,499</td>
                                                      <td className="px-5 py-3.5"><span className="text-xs font-medium bg-brand-50 text-brand-700 px-2.5 py-1 rounded-full">Completed</span></td>
                                                  </tr>
                                              </>
                                          )}
                                                   <tr className="table-row border-b border-slate-50">
                                                       <td className="px-5 py-3.5 text-sm font-medium text-slate-800">#ORD-7822</td>
                                                       <td className="px-5 py-3.5">
                                                           <div className="flex items-center gap-2.5">
                                                               <img src="https://picsum.photos/seed/u4/64/64.jpg" className="w-7 h-7 rounded-full object-cover" alt="" />
                                                               <span className="text-sm text-slate-700 dark:text-slate-300">Michael Brown</span>
                                                           </div>
                                                       </td>
                                                       <td className="px-5 py-3.5 text-sm text-slate-600">Smart Watch Series 7</td>
                                                       <td className="px-5 py-3.5 text-sm font-semibold text-slate-800">$399</td>
                                                       <td className="px-5 py-3.5"><span className="text-xs font-medium bg-yellow-50 text-yellow-700 px-2.5 py-1 rounded-full">Pending</span></td>
                                                   </tr>
                                                   <tr className="table-row border-b border-slate-50">
                                                       <td className="px-5 py-3.5 text-sm font-medium text-slate-800">#ORD-7823</td>
                                                       <td className="px-5 py-3.5">
                                                           <div className="flex items-center gap-2.5">
                                                               <img src="https://picsum.photos/seed/u3/64/64.jpg" className="w-7 h-7 rounded-full object-cover" alt="" />
                                                               <span className="text-sm text-slate-700 dark:text-slate-300">Emma Davis</span>
                                                           </div>
                                                       </td>
                                                       <td className="px-5 py-3.5 text-sm text-slate-600">Minimalist Leather Backpack</td>
                                                       <td className="px-5 py-3.5 text-sm font-semibold text-slate-800">$149</td>
                                                       <td className="px-5 py-3.5"><span className="text-xs font-medium bg-brand-50 text-brand-700 px-2.5 py-1 rounded-full">Completed</span></td>
                                                   </tr>
                                      </tbody>
                                  </table>
                              </div>
                          </div>

                          {/* Right Column */}
                          <div className="space-y-4">
                              {/* Top Products */}
                              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
                                  <div className="flex items-center justify-between mb-5">
                                      <div>
                                          <h3 className="text-base font-semibold text-slate-900 dark:text-white">Top Products</h3>
                                          <p className="text-sm text-slate-500 mt-0.5">Best sellers this month</p>
                                      </div>
                                  </div>
                                  <div className="space-y-4">
                                      <div className="flex items-center gap-3">
                                          <img src="https://picsum.photos/seed/product1/80/80.jpg" className="w-11 h-11 rounded-lg object-cover" alt="" />
                                          <div className="flex-1 min-w-0">
                                              <p className="text-sm font-medium text-slate-800 truncate">MacBook Pro 16"</p>
                                              <p className="text-xs text-slate-500">Electronics</p>
                                          </div>
                                          <div className="text-right">
                                              <p className="text-sm font-semibold text-slate-800">$2,499</p>
                                              <p className="text-xs text-brand-600 font-medium">+12%</p>
                                          </div>
                                      </div>
                                  </div>
                              </div>

                              {/* Activity Feed */}
                              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
                                  <div className="flex items-center justify-between mb-5">
                                      <div>
                                          <h3 className="text-base font-semibold text-slate-900 dark:text-white">Recent Activity</h3>
                                          <p className="text-sm text-slate-500 mt-0.5">What's happening</p>
                                      </div>
                                  </div>
                                  <div className="space-y-4 relative">
                                      <div className="absolute left-[15px] top-4 bottom-4 w-px bg-slate-200"></div>

                                      {activity.length > 0 ? activity.map((act, index) => (
                                          <div key={index} className="flex gap-3 relative">
                                              <div className={`w-8 h-8 rounded-full bg-${act.color}-100 flex items-center justify-center shrink-0 z-10 border-2 border-white`}>
                                                  <iconify-icon icon={act.icon} width="14" className={`text-${act.color}-600`}></iconify-icon>
                                              </div>
                                              <div>
                                                  <p className="text-sm text-slate-700 dark:text-slate-300"><span className="font-medium">{act.title}</span> — {act.message}</p>
                                                  <p className="text-xs text-slate-400 mt-0.5">{new Date(act.time).toLocaleTimeString()}</p>
                                              </div>
                                          </div>
                                      )) : (
                                          <div className="flex gap-3 relative">
                                              <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center shrink-0 z-10 border-2 border-white">
                                                  <iconify-icon icon="lucide:shopping-cart" width="14" className="text-brand-600"></iconify-icon>
                                              </div>
                                              <div>
                                                  <p className="text-sm text-slate-700 dark:text-slate-300"><span className="font-medium">New order</span> placed by Sarah W.</p>
                                                  <p className="text-xs text-slate-400 mt-0.5">2 minutes ago</p>
                                              </div>
                                          </div>
                                      )}
                                  </div>
                              </div>
                          </div>
                      </div>
                  </>
              )}

              {currentView === 'profile' && (
                  <div className="space-y-6">
                      <div className="flex items-center justify-between">
                          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">My Profile</h1>
                          <button 
                              onClick={handleSaveProfile}
                              className="bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                          >
                              Save Changes
                          </button>
                      </div>
                      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-6 space-y-6">
                          <div className="flex flex-col sm:flex-row items-center gap-4">
                              <img src={user?.avatar || "https://picsum.photos/seed/admin-avatar/80/80.jpg"} className="w-20 h-20 rounded-full object-cover border-4 border-slate-100 dark:border-slate-800" alt="avatar" />
                              <div className="text-center sm:text-left">
                                  <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{user?.name || 'John Doe'}</h2>
                                  <p className="text-sm text-slate-500">{user?.email || 'admin@apex.io'}</p>
                                  <div className="mt-2 flex gap-2 justify-center sm:justify-start">
                                      <button className="text-xs font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300">Change Avatar</button>
                                      <span className="text-slate-300">|</span>
                                      <button className="text-xs font-medium text-red-600 hover:text-red-700">Remove</button>
                                  </div>
                              </div>
                          </div>
                          
                          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                              <div>
                                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                                  <input 
                                      type="text" 
                                      value={user?.name || ''} 
                                      onChange={(e) => setUser({...user, name: e.target.value})}
                                      className="block w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500" 
                                  />
                              </div>
                              <div>
                                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
                                  <input 
                                      type="email" 
                                      value={user?.email || ''} 
                                      readOnly
                                      disabled
                                      className="block w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 px-4 py-2.5 text-sm outline-none cursor-not-allowed" 
                                  />
                              </div>
                              <div className="sm:col-span-2">
                                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Bio</label>
                                  <textarea rows="4" placeholder="Tell us a bit about yourself..." className="block w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"></textarea>
                              </div>
                          </div>

                          <div className="border-t border-slate-100 dark:border-slate-800 pt-6">
                              <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-4">Social Links</h3>
                              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                  <div className="flex items-center gap-2">
                                      <iconify-icon icon="lucide:twitter" width="20" className="text-slate-400"></iconify-icon>
                                      <input type="text" placeholder="Twitter URL" className="block w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500" />
                                  </div>
                                  <div className="flex items-center gap-2">
                                      <iconify-icon icon="lucide:linkedin" width="20" className="text-slate-400"></iconify-icon>
                                      <input type="text" placeholder="LinkedIn URL" className="block w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500" />
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
              )}

               {currentView === 'account' && (
                   <div className="space-y-6">
                       <div className="flex items-center justify-between">
                           <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Account</h1>
                           <button 
                               onClick={handleSaveProfile}
                               className="bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                           >
                               Save Changes
                           </button>
                       </div>
                       
                       <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-6 space-y-6">
                           {/* Profile Header */}
                           <div className="flex items-center gap-6 pb-6 border-b border-slate-100 dark:border-slate-800">
                               <div className="relative">
                                   <img src={user?.avatar || "https://picsum.photos/seed/admin-avatar/80/80.jpg"} className="w-20 h-20 rounded-full object-cover" alt="Avatar" />
                                   <button className="absolute bottom-0 right-0 bg-brand-500 text-white p-1.5 rounded-full hover:bg-brand-600 transition-colors">
                                       <iconify-icon icon="lucide:camera" width="14"></iconify-icon>
                                   </button>
                               </div>
                               <div>
                                   <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{user?.name || 'John Doe'}</h3>
                                   <p className="text-sm text-slate-500">{user?.email || 'admin@apex.io'}</p>
                                   <span className="text-xs font-medium bg-brand-50 text-brand-700 px-2.5 py-1 rounded-full mt-2 inline-block">Administrator</span>
                               </div>
                           </div>

                           {/* Profile Form */}
                           <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                               <div>
                                   <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">First Name</label>
                                   <input 
                                       type="text" 
                                       value={user?.name ? user.name.split(' ')[0] || '' : ''} 
                                       onChange={(e) => { const rest = (user?.name || '').split(' ').slice(1).join(' '); setUser({...user, name: (e.target.value + ' ' + rest).trim()}); }}
                                       className="block w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500" 
                                   />
                               </div>
                               <div>
                                   <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Last Name</label>
                                   <input 
                                       type="text" 
                                       value={user?.name ? user.name.split(' ').slice(1).join(' ') || '' : ''} 
                                       onChange={(e) => { const first = (user?.name || '').split(' ')[0] || ''; setUser({...user, name: (first + ' ' + e.target.value).trim()}); }}
                                       className="block w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500" 
                                   />
                               </div>
                               <div>
                                   <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
                                   <input 
                                       type="email" 
                                       value={user?.email || ''} 
                                       readOnly 
                                       disabled
                                       className="block w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 px-4 py-2.5 text-sm outline-none cursor-not-allowed" 
                                   />
                               </div>
                               <div>
                                   <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Phone Number</label>
                                   <input type="text" defaultValue="+1 (555) 000-0000" className="block w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500" />
                               </div>
                           </div>
                       </div>
                   </div>
               )}

              {currentView === 'settings' && (
                  <div className="space-y-6">
                      <div className="flex items-center justify-between">
                           <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Settings</h1>
                           <button 
                               onClick={handleSavePassword}
                               className="bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                           >
                               Save Settings
                           </button>
                       </div>
                       
                       <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-6 space-y-6">
                           <div>
                               <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-4">Password & Security</h3>
                               <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                                   <div>
                                       <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Current Password</label>
                                       <input 
                                           type="password" 
                                           value={currentPassword}
                                           onChange={(e) => setCurrentPassword(e.target.value)}
                                           placeholder="••••••••" 
                                           className="block w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500" 
                                       />
                                   </div>
                                   <div>
                                       <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">New Password</label>
                                       <input 
                                           type="password" 
                                           value={newPassword}
                                           onChange={(e) => setNewPassword(e.target.value)}
                                           placeholder="••••••••" 
                                           className="block w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500" 
                                       />
                                   </div>
                                   <div>
                                       <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Confirm Password</label>
                                       <input 
                                           type="password" 
                                           value={confirmPassword}
                                           onChange={(e) => setConfirmPassword(e.target.value)}
                                           placeholder="••••••••" 
                                           className="block w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500" 
                                       />
                                   </div>
                               </div>
                           </div>

                          <div className="border-t border-slate-100 dark:border-slate-800 pt-6">
                              <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-4">Notification Preferences</h3>
                              <div className="space-y-4">
                                  <div className="flex items-center justify-between">
                                      <div>
                                          <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Email Notifications</p>
                                          <p className="text-xs text-slate-500">Receive emails about account activity and updates.</p>
                                      </div>
                                      <button className="w-11 h-6 bg-brand-500 rounded-full p-0.5 transition-colors focus:outline-none">
                                          <div className="w-5 h-5 bg-white rounded-full shadow-sm transform translate-x-5"></div>
                                      </button>
                                  </div>
                                  <div className="flex items-center justify-between">
                                      <div>
                                          <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Push Notifications</p>
                                          <p className="text-xs text-slate-500">Receive real-time notifications in the browser.</p>
                                      </div>
                                      <button className="w-11 h-6 bg-slate-200 dark:bg-slate-700 rounded-full p-0.5 transition-colors focus:outline-none">
                                          <div className="w-5 h-5 bg-white rounded-full shadow-sm transform translate-x-0"></div>
                                      </button>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
              )}

              {currentView === 'billing' && (
                  <div className="space-y-6">
                      <div className="flex items-center justify-between">
                          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Billing</h1>
                          <button className="bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
                              Upgrade Plan
                          </button>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          {/* Current Plan */}
                          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
                              <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-4">Current Plan</h3>
                              <div className="flex items-center justify-between mb-4">
                                  <div>
                                      <p className="text-lg font-bold text-brand-600">Pro Plan</p>
                                      <p className="text-sm text-slate-500">$49/month</p>
                                  </div>
                                  <span className="text-xs font-medium bg-brand-50 text-brand-700 px-2.5 py-1 rounded-full">Active</span>
                              </div>
                              <div className="space-y-2">
                                  <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                                      <span>Projects</span>
                                      <span>5 of 10</span>
                                  </div>
                                  <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                      <div className="h-full bg-brand-500 rounded-full" style={{width:'50%'}}></div>
                                  </div>
                              </div>
                          </div>

                          {/* Payment Method */}
                          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
                              <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-4">Payment Method</h3>
                              <div className="flex items-center gap-4 p-4 border border-slate-100 dark:border-slate-800 rounded-lg">
                                  <div className="w-12 h-8 bg-slate-100 dark:bg-slate-800 rounded flex items-center justify-center font-bold text-slate-600 dark:text-slate-400">VISA</div>
                                  <div className="flex-1">
                                      <p className="text-sm font-medium text-slate-700 dark:text-slate-300">•••• •••• •••• 4242</p>
                                      <p className="text-xs text-slate-500">Expires 12/28</p>
                                  </div>
                                  <button className="text-sm font-medium text-brand-600 hover:text-brand-700">Edit</button>
                              </div>
                          </div>
                      </div>

                      {/* Billing History */}
                      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
                          <div className="p-5 border-b border-slate-100 dark:border-slate-800">
                              <h3 className="text-base font-semibold text-slate-900 dark:text-white">Billing History</h3>
                              <p className="text-sm text-slate-500 mt-0.5">Download past invoices</p>
                          </div>
                          <div className="overflow-x-auto">
                              <table className="w-full">
                                  <thead>
                                      <tr className="border-b border-slate-100 dark:border-slate-800">
                                          <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">Date</th>
                                          <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">Amount</th>
                                          <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">Status</th>
                                          <th className="text-right text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">Action</th>
                                      </tr>
                                  </thead>
                                  <tbody>
                                      <tr className="border-b border-slate-50 dark:border-slate-800/50">
                                          <td className="px-5 py-3.5 text-sm text-slate-700 dark:text-slate-300">May 01, 2026</td>
                                          <td className="px-5 py-3.5 text-sm font-medium text-slate-800 dark:text-white">$49.00</td>
                                          <td className="px-5 py-3.5"><span className="text-xs font-medium bg-green-50 text-green-700 px-2.5 py-1 rounded-full">Paid</span></td>
                                          <td className="px-5 py-3.5 text-right"><button className="text-sm font-medium text-brand-600 hover:text-brand-700">Download</button></td>
                                      </tr>
                                      <tr className="border-b border-slate-50 dark:border-slate-800/50">
                                          <td className="px-5 py-3.5 text-sm text-slate-700 dark:text-slate-300">Apr 01, 2026</td>
                                          <td className="px-5 py-3.5 text-sm font-medium text-slate-800 dark:text-white">$49.00</td>
                                          <td className="px-5 py-3.5"><span className="text-xs font-medium bg-green-50 text-green-700 px-2.5 py-1 rounded-full">Paid</span></td>
                                          <td className="px-5 py-3.5 text-right"><button className="text-sm font-medium text-brand-600 hover:text-brand-700">Download</button></td>
                                      </tr>
                                  </tbody>
                              </table>
                          </div>
                      </div>
                  </div>
              )}

              {currentView === 'ecommerce' && (
                  <div className="space-y-6">
                      <div className="flex items-center justify-between">
                          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">E-Commerce</h1>
                          <button onClick={() => setProductModal({ isOpen: true, mode: 'add', product: null })} className="bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
                              Add Product
                          </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {products.map(product => (
                              <div key={product._id} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden group">
                                  <div className="relative h-48 bg-slate-100 dark:bg-slate-800">
                                      <img src={product.thumbnail || "https://images.unsplash.com/photo-1517336712603-45727202421a?auto=format&fit=crop&w=400&h=300"} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" alt="Product" />
                                      <span className={`absolute top-3 right-3 text-xs font-medium ${product.stock > 10 ? 'bg-green-500' : 'bg-red-500'} text-white px-2 py-1 rounded`}>
                                          {product.stock > 10 ? 'In Stock' : 'Low Stock'}
                                      </span>
                                  </div>
                                  <div className="p-5">
                                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{product.name}</h3>
                                      <p className="text-sm text-slate-500 mt-1 capitalize">{product.category}</p>
                                      <div className="mt-4 flex items-center justify-between">
                                          <span className="text-xl font-bold text-slate-900 dark:text-white">${product.price?.toFixed(2)}</span>
                                          <div className="flex gap-2">
                                              <button onClick={() => setProductModal({ isOpen: true, mode: 'edit', product })} className="text-sm font-medium text-brand-600 hover:text-brand-700 dark:text-brand-400">Edit</button>
                                              <button onClick={() => handleDeleteProduct(product._id)} className="text-sm font-medium text-red-600 hover:text-red-700 dark:text-red-400">Remove</button>
                                          </div>
                                      </div>
                                  </div>
                              </div>
                          ))}
                      </div>

                  {productModal.isOpen && (
                      <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                          <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-700">
                              <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
                                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">{productModal.mode === 'add' ? 'Add Product' : 'Edit Product'}</h3>
                                  <button onClick={() => setProductModal({ isOpen: false, mode: 'add', product: null })} className="text-slate-400 hover:text-slate-500 dark:hover:text-slate-300">
                                      <iconify-icon icon="lucide:x" width="20"></iconify-icon>
                                  </button>
                              </div>
                              <form onSubmit={async (e) => {
                                  e.preventDefault();
                                  const formData = new FormData(e.target);
                                  const payload = {
                                      name: formData.get('name'),
                                      category: formData.get('category'),
                                      price: Number(formData.get('price')),
                                      stock: Number(formData.get('stock')),
                                  };
                                  try {
                                      const token = localStorage.getItem('token');
                                      const method = productModal.mode === 'add' ? 'POST' : 'PUT';
                                      const url = productModal.mode === 'add' 
                                          ? `${API_BASE}/api/products` 
                                          : `${API_BASE}/api/products/${productModal.product._id}`;
                                      
                                      const res = await fetch(url, {
                                          method,
                                          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                                          body: JSON.stringify(payload)
                                      });
                                      if(res.ok) {
                                          const data = await res.json();
                                          if(productModal.mode === 'add') {
                                              setProducts([...products, data.data]);
                                          } else {
                                              setProducts(products.map(p => p._id === data.data._id ? data.data : p));
                                          }
                                          setProductModal({ isOpen: false, mode: 'add', product: null });
                                      } else {
                                          const errorData = await res.json();
                                          alert(errorData.message || 'Error saving product');
                                      }
                                  } catch (err) {
                                      console.error(err);
                                      alert('Error saving product');
                                  }
                              }}>
                                  <div className="p-6 space-y-4">
                                      <div>
                                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Name</label>
                                          <input name="name" required defaultValue={productModal.product?.name || ''} className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-transparent text-slate-900 dark:text-white focus:outline-none focus:border-brand-500" />
                                      </div>
                                      <div>
                                          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Category</label>
                                          <select name="category" required defaultValue={productModal.product?.category || 'electronics'} className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-transparent text-slate-900 dark:text-white focus:outline-none focus:border-brand-500 [&>option]:text-slate-900">
                                              <option value="electronics">Electronics</option>
                                              <option value="clothing">Clothing</option>
                                              <option value="home_garden">Home & Garden</option>
                                              <option value="sports">Sports</option>
                                              <option value="books">Books</option>
                                              <option value="toys">Toys</option>
                                              <option value="food">Food</option>
                                              <option value="other">Other</option>
                                          </select>
                                      </div>
                                      <div className="grid grid-cols-2 gap-4">
                                          <div>
                                              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Price ($)</label>
                                              <input name="price" type="number" step="0.01" required defaultValue={productModal.product?.price || ''} className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-transparent text-slate-900 dark:text-white focus:outline-none focus:border-brand-500" />
                                          </div>
                                          <div>
                                              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Stock</label>
                                              <input name="stock" type="number" required defaultValue={productModal.product?.stock || ''} className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-transparent text-slate-900 dark:text-white focus:outline-none focus:border-brand-500" />
                                          </div>
                                      </div>
                                  </div>
                                  <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-700 flex justify-end gap-3">
                                      <button type="button" onClick={() => setProductModal({ isOpen: false, mode: 'add', product: null })} className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">Cancel</button>
                                      <button type="submit" className="bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">Save Product</button>
                                  </div>
                              </form>
                          </div>
                      </div>
                  )}
                  </div>
              )}

              {currentView === 'users' && (
                  <div className="space-y-6">
                      <div className="flex items-center justify-between">
                          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Users</h1>
                          <button className="bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
                              Add User
                          </button>
                      </div>
                      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                          <table className="w-full">
                              <thead>
                                  <tr className="border-b border-slate-100 dark:border-slate-800">
                                      <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">User</th>
                                      <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">Role</th>
                                      <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">Status</th>
                                      <th className="text-right text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">Actions</th>
                                  </tr>
                              </thead>
                              <tbody>
                                   {users.map(user => (
                                       <tr key={user._id} className="border-b border-slate-50 dark:border-slate-800/50">
                                           <td className="px-5 py-3.5 flex items-center gap-3">
                                               <img src={user.avatar || `https://picsum.photos/seed/${user._id}/40/40.jpg`} className="w-10 h-10 rounded-full" alt="" />
                                               <div>
                                                   <p className="text-sm font-medium text-slate-900 dark:text-white">{user.name}</p>
                                                   <p className="text-xs text-slate-500">{user.email}</p>
                                               </div>
                                           </td>
                                           <td className="px-5 py-3.5 text-sm text-slate-700 dark:text-slate-300">{user.role}</td>
                                           <td className="px-5 py-3.5">
                                               <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${user.status === 'active' ? 'bg-green-50 text-green-700' : 'bg-slate-100 text-slate-700'}`}>
                                                   {user.status === 'active' ? 'Active' : 'Inactive'}
                                               </span>
                                           </td>
                                           <td className="px-5 py-3.5 text-right">
                                               <button 
                                                   onClick={() => toggleUserStatus(user._id, user.status)}
                                                   className={`text-sm font-medium ${user.status === 'active' ? 'text-red-600 hover:text-red-700' : 'text-green-600 hover:text-green-700'}`}
                                               >
                                                   {user.status === 'active' ? 'Deactivate' : 'Activate'}
                                               </button>
                                           </td>
                                       </tr>
                                   ))}
                              </tbody>
                          </table>
                      </div>
                  </div>
              )}

              {currentView === 'mail' && (
                  <div className="space-y-6">
                      <div className="flex items-center justify-between">
                          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Mail</h1>
                          <button className="bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
                              Compose
                          </button>
                      </div>
                      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                          {/* Email 1 */}
                          <div className="p-4 border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer flex items-center gap-4">
                              <div className="w-10 h-10 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center font-bold">S</div>
                              <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between">
                                      <p className="text-sm font-semibold text-slate-900 dark:text-white">Sarah Wilson</p>
                                      <p className="text-xs text-slate-500">10:30 AM</p>
                                  </div>
                                  <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">Project Update: Phase 2 Completed</p>
                                  <p className="text-xs text-slate-500 truncate">Hi team, I'm happy to announce that we have completed phase 2...</p>
                              </div>
                          </div>
                          {/* Email 2 */}
                          <div className="p-4 border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer flex items-center gap-4">
                              <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">S</div>
                              <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between">
                                      <p className="text-sm font-semibold text-slate-900 dark:text-white">Support Team</p>
                                      <p className="text-xs text-slate-500">Yesterday</p>
                                  </div>
                                  <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">Ticket #1024 has been resolved</p>
                                  <p className="text-xs text-slate-500 truncate">Your support ticket regarding the billing issue has been resolved...</p>
                              </div>
                          </div>
                          {/* Email 3 */}
                          <div className="p-4 border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer flex items-center gap-4">
                              <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-bold">A</div>
                              <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between">
                                      <p className="text-sm font-semibold text-slate-900 dark:text-white">Alex Reed</p>
                                      <p className="text-xs text-slate-500">2 days ago</p>
                                  </div>
                                  <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">Meeting Invitation: Design Review</p>
                                  <p className="text-xs text-slate-500 truncate">Let's meet tomorrow to review the new designs for the app...</p>
                              </div>
                          </div>
                           {/* Email 4 */}
                           <div className="p-4 border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer flex items-center gap-4">
                               <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold">D</div>
                               <div className="flex-1 min-w-0">
                                   <div className="flex items-center justify-between">
                                       <p className="text-sm font-semibold text-slate-900 dark:text-white">David Smith</p>
                                       <p className="text-xs text-slate-500">3 days ago</p>
                                   </div>
                                   <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">Feedback on new feature</p>
                                   <p className="text-xs text-slate-500 truncate">I really like the new dashboard layout! Great job...</p>
                               </div>
                           </div>
                           {/* Email 5 */}
                           <div className="p-4 border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer flex items-center gap-4">
                               <div className="w-10 h-10 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center font-bold">E</div>
                               <div className="flex-1 min-w-0">
                                   <div className="flex items-center justify-between">
                                       <p className="text-sm font-semibold text-slate-900 dark:text-white">Emma Davis</p>
                                       <p className="text-xs text-slate-500">4 days ago</p>
                                   </div>
                                   <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">Vacation request</p>
                                   <p className="text-xs text-slate-500 truncate">Hi, I'd like to request time off from next Monday...</p>
                               </div>
                           </div>
                       </div>
                  </div>
              )}

              {currentView === 'calendar' && (
                  <div className="space-y-6">
                      <div className="flex items-center justify-between">
                          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Calendar</h1>
                          <button className="bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
                              Add Event
                          </button>
                      </div>
                      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
                          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Upcoming Events</h3>
                          <div className="space-y-4">
                              <div className="flex items-center gap-4 p-4 border border-slate-100 dark:border-slate-800 rounded-lg">
                                  <div className="w-12 h-12 bg-brand-50 text-brand-600 rounded-lg flex flex-col items-center justify-center text-xs font-bold">
                                      <span>MAY</span>
                                      <span className="text-lg">12</span>
                                  </div>
                                  <div>
                                      <p className="text-sm font-semibold text-slate-900 dark:text-white">Team Sync & Standup</p>
                                      <p className="text-xs text-slate-500">09:00 AM - 10:00 AM</p>
                                  </div>
                              </div>
                              <div className="flex items-center gap-4 p-4 border border-slate-100 dark:border-slate-800 rounded-lg">
                                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex flex-col items-center justify-center text-xs font-bold">
                                      <span>MAY</span>
                                      <span className="text-lg">15</span>
                                  </div>
                                  <div>
                                      <p className="text-sm font-semibold text-slate-900 dark:text-white">Design Review with Client</p>
                                      <p className="text-xs text-slate-500">02:00 PM - 03:30 PM</p>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
              )}

              {currentView === 'invoices' && (
                  <div className="space-y-6">
                      <div className="flex items-center justify-between">
                          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Invoices</h1>
                          <button className="bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
                              New Invoice
                          </button>
                      </div>
                      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                          <table className="w-full">
                              <thead>
                                  <tr className="border-b border-slate-100 dark:border-slate-800">
                                      <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">Invoice</th>
                                      <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">Client</th>
                                      <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">Amount</th>
                                      <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">Status</th>
                                      <th className="text-right text-xs font-semibold text-slate-500 uppercase tracking-wider px-5 py-3">Action</th>
                                  </tr>
                              </thead>
                              <tbody>
                                  <tr className="border-b border-slate-50 dark:border-slate-800/50">
                                      <td className="px-5 py-3.5 text-sm font-medium text-slate-900 dark:text-white">#INV-7821</td>
                                      <td className="px-5 py-3.5 text-sm text-slate-700 dark:text-slate-300">Sarah Wilson</td>
                                      <td className="px-5 py-3.5 text-sm font-medium text-slate-800 dark:text-white">$2,499.00</td>
                                      <td className="px-5 py-3.5"><span className="text-xs font-medium bg-green-50 text-green-700 px-2.5 py-1 rounded-full">Paid</span></td>
                                      <td className="px-5 py-3.5 text-right"><button className="text-sm font-medium text-brand-600 hover:text-brand-700">Download</button></td>
                                  </tr>
                                  <tr className="border-b border-slate-50 dark:border-slate-800/50">
                                      <td className="px-5 py-3.5 text-sm font-medium text-slate-900 dark:text-white">#INV-002</td>
                                      <td className="px-5 py-3.5 text-sm text-slate-700 dark:text-slate-300">Dexter Labs</td>
                                      <td className="px-5 py-3.5 text-sm font-medium text-slate-800 dark:text-white">$850.00</td>
                                      <td className="px-5 py-3.5"><span className="text-xs font-medium bg-yellow-50 text-yellow-700 px-2.5 py-1 rounded-full">Pending</span></td>
                                      <td className="px-5 py-3.5 text-right"><button className="text-sm font-medium text-brand-600 hover:text-brand-700">Download</button></td>
                                  </tr>
                                   <tr className="border-b border-slate-50 dark:border-slate-800/50">
                                       <td className="px-5 py-3.5 text-sm font-medium text-slate-900 dark:text-white">#INV-003</td>
                                       <td className="px-5 py-3.5 text-sm text-slate-700 dark:text-slate-300">Michael Brown</td>
                                       <td className="px-5 py-3.5 text-sm font-medium text-slate-800 dark:text-white">$450.00</td>
                                       <td className="px-5 py-3.5"><span className="text-xs font-medium bg-green-50 text-green-700 px-2.5 py-1 rounded-full">Paid</span></td>
                                       <td className="px-5 py-3.5 text-right"><button className="text-sm font-medium text-brand-600 hover:text-brand-700">Download</button></td>
                                   </tr>
                                   <tr className="border-b border-slate-50 dark:border-slate-800/50">
                                       <td className="px-5 py-3.5 text-sm font-medium text-slate-900 dark:text-white">#INV-004</td>
                                       <td className="px-5 py-3.5 text-sm text-slate-700 dark:text-slate-300">Emma Davis</td>
                                       <td className="px-5 py-3.5 text-sm font-medium text-slate-800 dark:text-white">$120.00</td>
                                       <td className="px-5 py-3.5"><span className="text-xs font-medium bg-yellow-50 text-yellow-700 px-2.5 py-1 rounded-full">Pending</span></td>
                                       <td className="px-5 py-3.5 text-right"><button className="text-sm font-medium text-brand-600 hover:text-brand-700">Download</button></td>
                                   </tr>
                              </tbody>
                          </table>
                      </div>
                  </div>
              )}

              {currentView === 'analytics' && (
                  <div className="space-y-6">
                      <div className="flex items-center justify-between">
                          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Analytics</h1>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
                              <p className="text-sm text-slate-500">Total Visits</p>
                              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">124,500</h3>
                              <p className="text-xs text-green-600 mt-1">+12% from last month</p>
                          </div>
                          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
                              <p className="text-sm text-slate-500">Conversion Rate</p>
                              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">3.2%</h3>
                              <p className="text-xs text-green-600 mt-1">+0.5% from last month</p>
                          </div>
                          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
                              <p className="text-sm text-slate-500">Bounce Rate</p>
                              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">42.1%</h3>
                              <p className="text-xs text-red-600 mt-1">-2% from last month</p>
                          </div>
                      </div>

                      {/* Traffic Sources */}
                      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
                          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Top Traffic Sources</h3>
                          <div className="overflow-hidden">
                              <table className="w-full">
                                  <thead>
                                      <tr className="border-b border-slate-100 dark:border-slate-800">
                                          <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider py-3">Source</th>
                                          <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider py-3">Visitors</th>
                                          <th className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider py-3">Percentage</th>
                                      </tr>
                                  </thead>
                                  <tbody>
                                      <tr className="border-b border-slate-50 dark:border-slate-800/50">
                                          <td className="py-3.5 text-sm text-slate-700 dark:text-slate-300">Organic Search (Google)</td>
                                          <td className="py-3.5 text-sm font-medium text-slate-900 dark:text-white">54,200</td>
                                          <td className="py-3.5 text-sm text-slate-500">43.5%</td>
                                      </tr>
                                      <tr className="border-b border-slate-50 dark:border-slate-800/50">
                                          <td className="py-3.5 text-sm text-slate-700 dark:text-slate-300">Direct Traffic</td>
                                          <td className="py-3.5 text-sm font-medium text-slate-900 dark:text-white">32,100</td>
                                          <td className="py-3.5 text-sm text-slate-500">25.8%</td>
                                      </tr>
                                      <tr className="border-b border-slate-50 dark:border-slate-800/50">
                                          <td className="py-3.5 text-sm text-slate-700 dark:text-slate-300">Social Media</td>
                                          <td className="py-3.5 text-sm font-medium text-slate-900 dark:text-white">18,500</td>
                                          <td className="py-3.5 text-sm text-slate-500">14.8%</td>
                                      </tr>
                                  </tbody>
                              </table>
                          </div>
                      </div>

                      {/* Device Breakdown */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
                              <div className="flex items-center justify-between">
                                  <p className="text-sm text-slate-500">Mobile</p>
                                  <span className="text-sm font-semibold text-slate-900 dark:text-white">58%</span>
                              </div>
                              <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full mt-2 overflow-hidden">
                                  <div className="h-full bg-brand-500 rounded-full" style={{width:'58%'}}></div>
                              </div>
                          </div>
                          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
                              <div className="flex items-center justify-between">
                                  <p className="text-sm text-slate-500">Desktop</p>
                                  <span className="text-sm font-semibold text-slate-900 dark:text-white">35%</span>
                              </div>
                              <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full mt-2 overflow-hidden">
                                  <div className="h-full bg-blue-500 rounded-full" style={{width:'35%'}}></div>
                              </div>
                          </div>
                          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
                              <div className="flex items-center justify-between">
                                  <p className="text-sm text-slate-500">Tablet</p>
                                  <span className="text-sm font-semibold text-slate-900 dark:text-white">7%</span>
                              </div>
                              <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full mt-2 overflow-hidden">
                                  <div className="h-full bg-yellow-500 rounded-full" style={{width:'7%'}}></div>
                              </div>
                          </div>
                      </div>
                  </div>
              )}

              {currentView === 'campaigns' && (
                  <div className="space-y-6">
                      <div className="flex items-center justify-between">
                          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Campaigns</h1>
                          <button className="bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
                              New Campaign
                          </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Campaign 1 */}
                          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-5 flex flex-col justify-between">
                              <div>
                                  <div className="flex items-center justify-between mb-2">
                                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Summer Sale 2026</h3>
                                      <span className="text-xs font-medium bg-green-50 text-green-700 px-2.5 py-1 rounded-full">Active</span>
                                  </div>
                                  <p className="text-sm text-slate-500 mb-4">Email marketing campaign for summer products.</p>
                              </div>
                              <div className="space-y-4">
                                  <div className="flex items-center justify-between text-sm">
                                      <div>
                                          <p className="text-xs text-slate-400">Reach</p>
                                          <p className="font-semibold text-slate-800 dark:text-white">45,000</p>
                                      </div>
                                      <div>
                                          <p className="text-xs text-slate-400">Conversions</p>
                                          <p className="font-semibold text-slate-800 dark:text-white">1,200</p>
                                      </div>
                                  </div>
                                  <div className="space-y-2">
                                      <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                                          <span>Progress</span>
                                          <span>75%</span>
                                      </div>
                                      <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                          <div className="h-full bg-brand-500 rounded-full" style={{width:'75%'}}></div>
                                      </div>
                                  </div>
                              </div>
                          </div>
                          {/* Campaign 2 */}
                          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-5 flex flex-col justify-between">
                              <div>
                                  <div className="flex items-center justify-between mb-2">
                                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Black Friday Teaser</h3>
                                      <span className="text-xs font-medium bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full">Draft</span>
                                  </div>
                                  <p className="text-sm text-slate-500 mb-4">Social media teaser for Black Friday.</p>
                              </div>
                              <div className="space-y-4">
                                  <div className="flex items-center justify-between text-sm">
                                      <div>
                                          <p className="text-xs text-slate-400">Reach</p>
                                          <p className="font-semibold text-slate-800 dark:text-white">0</p>
                                      </div>
                                      <div>
                                          <p className="text-xs text-slate-400">Conversions</p>
                                          <p className="font-semibold text-slate-800 dark:text-white">0</p>
                                      </div>
                                  </div>
                                  <div className="space-y-2">
                                      <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                                          <span>Progress</span>
                                          <span>0%</span>
                                      </div>
                                      <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                          <div className="h-full bg-brand-500 rounded-full" style={{width:'0%'}}></div>
                                      </div>
                                  </div>
                              </div>
                          </div>
                          {/* Campaign 3 */}
                          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-5 flex flex-col justify-between">
                              <div>
                                  <div className="flex items-center justify-between mb-2">
                                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Product Launch</h3>
                                      <span className="text-xs font-medium bg-green-50 text-green-700 px-2.5 py-1 rounded-full">Completed</span>
                                  </div>
                                  <p className="text-sm text-slate-500 mb-4">Launch campaign for the new app version.</p>
                              </div>
                              <div className="space-y-4">
                                  <div className="flex items-center justify-between text-sm">
                                      <div>
                                          <p className="text-xs text-slate-400">Reach</p>
                                          <p className="font-semibold text-slate-800 dark:text-white">120,000</p>
                                      </div>
                                      <div>
                                          <p className="text-xs text-slate-400">Conversions</p>
                                          <p className="font-semibold text-slate-800 dark:text-white">5,400</p>
                                      </div>
                                  </div>
                                  <div className="space-y-2">
                                      <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                                          <span>Progress</span>
                                          <span>100%</span>
                                      </div>
                                      <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                          <div className="h-full bg-brand-500 rounded-full" style={{width:'100%'}}></div>
                                      </div>
                                  </div>
                              </div>
                          </div>
                          {/* Campaign 4 */}
                          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-5 flex flex-col justify-between">
                              <div>
                                  <div className="flex items-center justify-between mb-2">
                                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Holiday Giveaway</h3>
                                      <span className="text-xs font-medium bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full">Scheduled</span>
                                  </div>
                                  <p className="text-sm text-slate-500 mb-4">Giveaway campaign for the holiday season.</p>
                              </div>
                              <div className="space-y-4">
                                  <div className="flex items-center justify-between text-sm">
                                      <div>
                                          <p className="text-xs text-slate-400">Reach</p>
                                          <p className="font-semibold text-slate-800 dark:text-white">25,000</p>
                                      </div>
                                      <div>
                                          <p className="text-xs text-slate-400">Conversions</p>
                                          <p className="font-semibold text-slate-800 dark:text-white">0</p>
                                      </div>
                                  </div>
                                  <div className="space-y-2">
                                      <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                                          <span>Progress</span>
                                          <span>20%</span>
                                      </div>
                                      <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                          <div className="h-full bg-brand-500 rounded-full" style={{width:'20%'}}></div>
                                      </div>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
              )}

              {currentView === 'help' && (
                  <div className="space-y-6">
                      <div className="flex items-center justify-between">
                          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Help Center</h1>
                      </div>
                      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
                          <div className="mb-6">
                              <input type="text" placeholder="Search for help..." className="block w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500" />
                          </div>
                          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Popular Topics</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="p-4 border border-slate-100 dark:border-slate-800 rounded-lg hover:border-brand-500 cursor-pointer transition-colors">
                                  <h4 className="font-medium text-slate-900 dark:text-white">Getting Started</h4>
                                  <p className="text-sm text-slate-500 mt-1">Learn the basics of using our platform.</p>
                              </div>
                              <div className="p-4 border border-slate-100 dark:border-slate-800 rounded-lg hover:border-brand-500 cursor-pointer transition-colors">
                                  <h4 className="font-medium text-slate-900 dark:text-white">Billing & Subscriptions</h4>
                                  <p className="text-sm text-slate-500 mt-1">Manage your plan and invoices.</p>
                              </div>
                          </div>
                      </div>
                  </div>
              )}

              {currentView === 'notifications' && (
                  <div className="space-y-6">
                      <div className="flex items-center justify-between">
                          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Notifications</h1>
                          <button className="text-sm font-medium text-brand-600 hover:text-brand-700">Mark all as read</button>
                      </div>
                      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                          {/* Notification 1 */}
                          <div className="p-4 border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer flex items-center gap-4">
                              <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                                  <iconify-icon icon="lucide:shopping-cart" width="20"></iconify-icon>
                              </div>
                              <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between">
                                      <p className="text-sm font-semibold text-slate-900 dark:text-white">New Order Placed</p>
                                      <p className="text-xs text-slate-500">2 min ago</p>
                                  </div>
                                  <p className="text-sm text-slate-600 dark:text-slate-400">Sarah Wilson placed a new order for MacBook Pro 16".</p>
                              </div>
                          </div>
                          {/* Notification 2 */}
                          <div className="p-4 border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer flex items-center gap-4">
                              <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                                  <iconify-icon icon="lucide:user" width="20"></iconify-icon>
                              </div>
                              <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between">
                                      <p className="text-sm font-semibold text-slate-900 dark:text-white">New User Registered</p>
                                      <p className="text-xs text-slate-500">1 hour ago</p>
                                  </div>
                                  <p className="text-sm text-slate-600 dark:text-slate-400">Michael Brown registered as a new editor.</p>
                              </div>
                          </div>
                          {/* Notification 3 */}
                          <div className="p-4 border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer flex items-center gap-4">
                              <div className="w-10 h-10 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center">
                                  <iconify-icon icon="lucide:alert-triangle" width="20"></iconify-icon>
                              </div>
                              <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between">
                                      <p className="text-sm font-semibold text-slate-900 dark:text-white">Storage Almost Full</p>
                                      <p className="text-xs text-slate-500">2 hours ago</p>
                                  </div>
                                  <p className="text-sm text-slate-600 dark:text-slate-400">Your storage usage is at 85%. Consider upgrading your plan.</p>
                              </div>
                          </div>
                      </div>
                  </div>
              )}
          </main>
      </div>
        </>
      )}

      {/* GitHub Floating Button */}
      <a 
        href="https://github.com/Ramjianonmyous" 
        target="_blank" 
        rel="noopener noreferrer" 
        className="fixed bottom-6 right-6 z-[100] group flex items-center bg-slate-900 dark:bg-white text-white dark:text-slate-900 p-3 rounded-full shadow-2xl transition-all duration-300 animate-float hover:shadow-brand-500/20"
      >
        <iconify-icon icon="mdi:github" width="28" className="shrink-0"></iconify-icon>
        <div className="grid grid-cols-[0fr] group-hover:grid-cols-[1fr] transition-all duration-300 ease-in-out">
          <span className="overflow-hidden whitespace-nowrap font-medium text-sm">
             <span className="pl-3 pr-1">Made by Ram Kaithwas</span>
          </span>
        </div>
      </a>
    </div>
  );
}

export default App;
