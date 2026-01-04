import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import api from '../utils/api'
import toast from 'react-hot-toast'
import StatCard from '../components/StatCard'
import {
  FiUsers,
  FiShoppingBag,
  FiPackage,
  FiCheckCircle,
  FiShoppingCart,
  FiLayers,
  FiAlertCircle,
  FiDollarSign
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

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899']

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
      toast.error('Failed to load dashboard stats')
    } finally {
      setLoading(false)
    }
  }

  const fetchChartData = async () => {
    try {
      // Try to fetch real chart data from API
      const response = await api.get('/admin/dashboard/charts')
      
      if (response?.data?.success) {
        setChartData(response.data.data)
      } else {
        // Fallback to mock data
        generateMockChartData()
      }
    } catch (error) {
      // Use mock data on error
      console.warn('Failed to fetch chart data, using mock data:', error)
      generateMockChartData()
    }
  }

  const generateMockChartData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
    setChartData({
      ordersOverTime: months.map((month, i) => ({
        month,
        orders: Math.floor(Math.random() * 100) + 20,
        revenue: Math.floor(Math.random() * 5000) + 1000
      })),
      categoryDistribution: [
        { name: 'Cows', value: 25 },
        { name: 'Camels', value: 20 },
        { name: 'Birds', value: 18 },
        { name: 'Sheep', value: 15 },
        { name: 'Fish', value: 12 },
        { name: 'Other', value: 10 }
      ],
      userGrowth: months.map((month, i) => ({
        month,
        users: Math.floor(Math.random() * 50) + 10
      }))
    })
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const statCards = [
    {
      title: t('dashboard.totalUsers'),
      value: stats?.totalUsers || 0,
      icon: FiUsers,
      color: 'bg-gradient-to-br from-blue-500 to-blue-600',
      trend: 'up',
      trendValue: 12
    },
    {
      title: t('dashboard.totalVendors'),
      value: stats?.totalVendors || 0,
      icon: FiShoppingBag,
      color: 'bg-gradient-to-br from-green-500 to-green-600',
      trend: 'up',
      trendValue: 8
    },
    {
      title: t('dashboard.totalProducts'),
      value: stats?.totalProducts || 0,
      icon: FiPackage,
      color: 'bg-gradient-to-br from-purple-500 to-purple-600',
      trend: 'up',
      trendValue: 15
    },
    {
      title: t('dashboard.totalOrders'),
      value: stats?.totalOrders || 0,
      icon: FiShoppingCart,
      color: 'bg-gradient-to-br from-orange-500 to-orange-600',
      trend: 'up',
      trendValue: 22
    },
    {
      title: t('dashboard.pendingApplications'),
      value: stats?.pendingApplications || 0,
      icon: FiCheckCircle,
      color: 'bg-gradient-to-br from-yellow-500 to-yellow-600',
      trend: 'down',
      trendValue: 5
    },
    {
      title: t('dashboard.pendingProducts'),
      value: stats?.pendingProducts || 0,
      icon: FiAlertCircle,
      color: 'bg-gradient-to-br from-red-500 to-red-600',
      trend: null
    },
    {
      title: t('dashboard.categories'),
      value: stats?.totalCategories || 0,
      icon: FiLayers,
      color: 'bg-gradient-to-br from-indigo-500 to-indigo-600',
      trend: null
    },
    {
      title: t('dashboard.totalRevenue'),
      value: `$${(stats?.totalRevenue || 0).toLocaleString()}`,
      icon: FiDollarSign,
      color: 'bg-gradient-to-br from-emerald-500 to-emerald-600',
      trend: 'up',
      trendValue: 18
    }
  ]

  return (
    <div className="p-8 min-h-screen relative">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 relative z-10"
      >
        <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2">{t('dashboard.title')}</h1>
        <p className="text-gray-600 text-lg">{t('dashboard.welcome')}</p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <StatCard key={index} {...stat} delay={index * 0.1} />
        ))}
      </div>

      {/* Charts Section */}
      {chartData && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Orders & Revenue Over Time */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card rounded-2xl p-6 backdrop-blur-xl"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4">{t('dashboard.ordersRevenue')}</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData.ordersOverTime}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="orders"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  name="Orders"
                  dot={{ fill: '#3B82F6', r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#10B981"
                  strokeWidth={2}
                  name="Revenue ($)"
                  dot={{ fill: '#10B981', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Category Distribution */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card rounded-2xl p-6 backdrop-blur-xl"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4">{t('dashboard.categoryDistribution')}</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData.categoryDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.categoryDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>

          {/* User Growth */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="glass-card rounded-2xl p-6 backdrop-blur-xl lg:col-span-2"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4">{t('dashboard.userGrowth')}</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData.userGrowth}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="users" fill="#8B5CF6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>
      )}

      {/* Recent Activity Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="glass-card rounded-2xl p-6 backdrop-blur-xl relative z-10"
      >
        <h3 className="text-lg font-semibold text-gray-800 mb-4">{t('dashboard.recentActivity')}</h3>
        <div className="space-y-3">
          {[
            { action: t('dashboard.newVendorApplication'), time: `2 ${t('dashboard.minutesAgo')}`, type: 'info' },
            { action: t('dashboard.productApproved'), time: `15 ${t('dashboard.minutesAgo')}`, type: 'success' },
            { action: t('dashboard.newOrderReceived'), time: `1 ${t('dashboard.hoursAgo')}`, type: 'info' },
            { action: t('dashboard.userRegistered'), time: `2 ${t('dashboard.hoursAgo')}`, type: 'info' }
          ].map((activity, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 + index * 0.1 }}
              className="flex items-center justify-between p-4 glass-gradient rounded-xl hover:bg-white/40 transition-all duration-300 backdrop-blur-sm"
            >
              <div>
                <p className="text-sm font-medium text-gray-800">{activity.action}</p>
                <p className="text-xs text-gray-600 mt-1">{activity.time}</p>
              </div>
              <span
                className={`px-3 py-1.5 text-xs font-semibold rounded-full backdrop-blur-sm ${
                  activity.type === 'success'
                    ? 'bg-green-500/20 text-green-700 border border-green-500/30'
                    : 'bg-blue-500/20 text-blue-700 border border-blue-500/30'
                }`}
              >
                {activity.type}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

export default Dashboard
