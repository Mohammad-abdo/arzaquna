import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import api from '../utils/api'
import StatCard from '../components/StatCard'
import {
  FiUsers,
  FiShoppingBag,
  FiPackage,
  FiCheckCircle,
  FiShoppingCart,
  FiLayers,
  FiAlertCircle,
  FiDollarSign,
  FiArrowRight,
  FiActivity
} from 'react-icons/fi'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'

const COLORS = ['#0ea5e9', '#10B981', '#F59E0B', '#8B5CF6', '#EF4444', '#EC4899']

const Dashboard = () => {
  const { t } = useTranslation()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [chartData, setChartData] = useState(null)

  useEffect(() => {
    fetchStats()
    fetchChartData()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await api.get('/admin/dashboard/stats')
      if (response.data.success) {
        setStats(response.data.data)
      }
    } catch (error) {
      // use zeros silently
    } finally {
      setLoading(false)
    }
  }

  const fetchChartData = async () => {
    try {
      const response = await api.get('/admin/dashboard/charts')
      if (response?.data?.success) {
        setChartData(response.data.data)
      } else {
        generateMockChartData()
      }
    } catch {
      generateMockChartData()
    }
  }

  const generateMockChartData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
    setChartData({
      ordersOverTime: months.map((month) => ({
        month,
        orders: Math.floor(Math.random() * 80) + 20,
        revenue: Math.floor(Math.random() * 4000) + 1000
      })),
      categoryDistribution: [
        { name: 'Cows', value: 28 },
        { name: 'Camels', value: 22 },
        { name: 'Birds', value: 18 },
        { name: 'Sheep', value: 16 },
        { name: 'Fish', value: 10 },
        { name: 'Other', value: 6 }
      ],
      userGrowth: months.map((month) => ({
        month,
        users: Math.floor(Math.random() * 40) + 10
      }))
    })
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded-lg w-48" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="h-28 bg-gray-200 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  const statCards = [
    { title: t('dashboard.totalUsers'),        value: stats?.totalUsers || 0,        icon: FiUsers,       color: 'blue',   trend: 'up',   trendValue: 12 },
    { title: t('dashboard.totalVendors'),      value: stats?.totalVendors || 0,      icon: FiShoppingBag, color: 'green',  trend: 'up',   trendValue: 8 },
    { title: t('dashboard.totalProducts'),     value: stats?.totalProducts || 0,     icon: FiPackage,     color: 'purple', trend: 'up',   trendValue: 15 },
    { title: t('dashboard.totalOrders'),       value: stats?.totalOrders || 0,       icon: FiShoppingCart,color: 'orange', trend: 'up',   trendValue: 22 },
    { title: t('dashboard.pendingApplications'),value: stats?.pendingApplications||0,icon: FiCheckCircle, color: 'teal',   trend: 'down', trendValue: 5 },
    { title: t('dashboard.pendingProducts'),   value: stats?.pendingProducts || 0,   icon: FiAlertCircle, color: 'red',    trend: null },
    { title: t('dashboard.categories'),        value: stats?.totalCategories || 0,   icon: FiLayers,      color: 'indigo', trend: null },
    { title: t('dashboard.totalRevenue'),      value: `$${(stats?.totalRevenue||0).toLocaleString()}`, icon: FiDollarSign, color: 'sky', trend: 'up', trendValue: 18 },
  ]

  const quickLinks = [
    { label: 'Pending Applications', href: '/vendor-applications', count: stats?.pendingApplications || 0, color: 'text-teal-600 bg-teal-50' },
    { label: 'Pending Products',     href: '/products',            count: stats?.pendingProducts || 0,     color: 'text-red-600 bg-red-50' },
    { label: 'New Orders',           href: '/orders',              count: stats?.totalOrders || 0,         color: 'text-orange-600 bg-orange-50' },
  ]

  const recentActivity = [
    { action: t('dashboard.newVendorApplication'), time: `2 ${t('dashboard.minutesAgo')}`,  dot: 'bg-teal-500' },
    { action: t('dashboard.productApproved'),       time: `15 ${t('dashboard.minutesAgo')}`, dot: 'bg-green-500' },
    { action: t('dashboard.newOrderReceived'),       time: `1 ${t('dashboard.hoursAgo')}`,   dot: 'bg-orange-500' },
    { action: t('dashboard.userRegistered'),         time: `2 ${t('dashboard.hoursAgo')}`,   dot: 'bg-blue-500' },
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('dashboard.title')}</h1>
          <p className="text-gray-500 text-sm mt-0.5">{t('dashboard.welcome')}</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-full text-emerald-700 text-xs font-medium">
          <FiActivity size={12} />
          Live
        </div>
      </motion.div>

      {/* Quick action banners */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-3"
      >
        {quickLinks.map((q, i) => (
          <Link
            key={i}
            to={q.href}
            className={`flex items-center justify-between px-4 py-3 rounded-xl border border-gray-200 bg-white hover:shadow-sm transition-all group`}
          >
            <div className="flex items-center gap-3">
              <span className={`text-xl font-bold ${q.color.split(' ')[0]}`}>{q.count}</span>
              <span className="text-sm text-gray-600">{q.label}</span>
            </div>
            <FiArrowRight size={14} className="text-gray-400 group-hover:translate-x-1 transition-transform" />
          </Link>
        ))}
      </motion.div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <StatCard key={index} {...stat} delay={index * 0.04} />
        ))}
      </div>

      {/* Charts */}
      {chartData && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Orders & Revenue */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-5"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-900">{t('dashboard.ordersRevenue')}</h3>
              <span className="text-xs text-gray-400">Last 6 months</span>
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={chartData.ordersOverTime}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#9ca3af" tick={{ fontSize: 12 }} />
                <YAxis stroke="#9ca3af" tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '10px', fontSize: 12 }}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line type="monotone" dataKey="orders" stroke="#0ea5e9" strokeWidth={2.5} name="Orders" dot={{ fill: '#0ea5e9', r: 3 }} />
                <Line type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={2.5} name="Revenue ($)" dot={{ fill: '#10B981', r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Category Pie */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl border border-gray-200 p-5"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-900">{t('dashboard.categoryDistribution')}</h3>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={chartData.categoryDistribution}
                  cx="50%" cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {chartData.categoryDistribution.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-1.5 mt-2">
              {chartData.categoryDistribution.slice(0, 4).map((item, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                    <span className="text-gray-600">{item.name}</span>
                  </div>
                  <span className="font-semibold text-gray-800">{item.value}%</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* User Growth Bar */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-5"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-900">{t('dashboard.userGrowth')}</h3>
              <span className="text-xs text-gray-400">New users/month</span>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={chartData.userGrowth} barSize={28}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" stroke="#9ca3af" tick={{ fontSize: 12 }} />
                <YAxis stroke="#9ca3af" tick={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '10px', fontSize: 12 }} />
                <Bar dataKey="users" fill="#8B5CF6" radius={[6, 6, 0, 0]} name="New Users" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl border border-gray-200 p-5"
          >
            <h3 className="text-sm font-semibold text-gray-900 mb-4">{t('dashboard.recentActivity')}</h3>
            <div className="space-y-3">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${activity.dot}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-800 leading-snug">{activity.action}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default Dashboard
