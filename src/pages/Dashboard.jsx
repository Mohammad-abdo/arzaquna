import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import api from '../utils/api'
import StatCard from '../components/StatCard'
import PageHeader from '../components/PageHeader'
import Badge from '../components/Badge'
import {
  FiUsers, FiShoppingBag, FiPackage, FiCheckCircle,
  FiShoppingCart, FiLayers, FiAlertCircle, FiDollarSign,
  FiArrowRight, FiActivity, FiClock,
} from 'react-icons/fi'
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts'

const COLORS = ['#059669', '#0ea5e9', '#f59e0b', '#8b5cf6', '#ef4444', '#ec4899']

const chartTooltipStyle = {
  backgroundColor: '#fff',
  border: '1px solid #e2e8f0',
  borderRadius: '8px',
  fontSize: 12,
  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.08)',
}

const Dashboard = () => {
  const { t, i18n } = useTranslation()
  const isRTL = i18n.language === 'ar'
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
      if (response.data.success) setStats(response.data.data)
    } catch { /* silent */ } finally { setLoading(false) }
  }

  const fetchChartData = async () => {
    try {
      const response = await api.get('/admin/dashboard/charts')
      if (response?.data?.success) setChartData(response.data.data)
      else generateMockChartData()
    } catch { generateMockChartData() }
  }

  const generateMockChartData = () => {
    const months = isRTL
      ? ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو']
      : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
    setChartData({
      ordersOverTime: months.map((month) => ({
        month, orders: Math.floor(Math.random() * 80) + 20, revenue: Math.floor(Math.random() * 4000) + 1000,
      })),
      categoryDistribution: [
        { name: isRTL ? 'أبقار' : 'Cows', value: 28 },
        { name: isRTL ? 'إبل' : 'Camels', value: 22 },
        { name: isRTL ? 'طيور' : 'Birds', value: 18 },
        { name: isRTL ? 'أغنام' : 'Sheep', value: 16 },
        { name: isRTL ? 'أسماك' : 'Fish', value: 10 },
        { name: isRTL ? 'أخرى' : 'Other', value: 6 },
      ],
      userGrowth: months.map((month) => ({ month, users: Math.floor(Math.random() * 40) + 10 })),
    })
  }

  if (loading) {
    return (
      <div className="page-shell">
        <div className="animate-pulse space-y-6">
          <div className="h-10 bg-slate-200 rounded-lg w-64" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="h-28 bg-slate-200 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  const statCards = [
    { title: t('dashboard.totalUsers'), value: stats?.totalUsers || 0, icon: FiUsers, color: 'blue', trend: 'up', trendValue: 12 },
    { title: t('dashboard.totalVendors'), value: stats?.totalVendors || 0, icon: FiShoppingBag, color: 'green', trend: 'up', trendValue: 8 },
    { title: t('dashboard.totalProducts'), value: stats?.totalProducts || 0, icon: FiPackage, color: 'purple', trend: 'up', trendValue: 15 },
    { title: t('dashboard.totalOrders'), value: stats?.totalOrders || 0, icon: FiShoppingCart, color: 'orange', trend: 'up', trendValue: 22 },
    { title: t('dashboard.pendingApplications'), value: stats?.pendingApplications || 0, icon: FiCheckCircle, color: 'teal', trend: 'down', trendValue: 5 },
    { title: t('dashboard.pendingProducts'), value: stats?.pendingProducts || 0, icon: FiAlertCircle, color: 'red' },
    { title: t('dashboard.categories'), value: stats?.totalCategories || 0, icon: FiLayers, color: 'indigo' },
    { title: t('dashboard.totalRevenue'), value: `${(stats?.totalRevenue || 0).toLocaleString()} SAR`, icon: FiDollarSign, color: 'sky', trend: 'up', trendValue: 18 },
  ]

  const quickLinks = [
    { label: t('sidebar.vendorApplications'), href: '/vendor-applications', count: stats?.pendingApplications || 0, variant: 'brand' },
    { label: t('sidebar.products'), href: '/products', count: stats?.pendingProducts || 0, variant: 'danger' },
    { label: t('sidebar.orders'), href: '/orders', count: stats?.totalOrders || 0, variant: 'warning' },
  ]

  const recentActivity = [
    { action: t('dashboard.newVendorApplication'), time: `2 ${t('dashboard.minutesAgo')}`, variant: 'brand' },
    { action: t('dashboard.productApproved'), time: `15 ${t('dashboard.minutesAgo')}`, variant: 'success' },
    { action: t('dashboard.newOrderReceived'), time: `1 ${t('dashboard.hoursAgo')}`, variant: 'warning' },
    { action: t('dashboard.userRegistered'), time: `2 ${t('dashboard.hoursAgo')}`, variant: 'info' },
  ]

  const ArrowIcon = isRTL ? FiArrowRight : FiArrowRight

  return (
    <div className="page-shell space-y-6">
      <PageHeader
        title={t('dashboard.title')}
        subtitle={t('dashboard.welcome')}
        badge={<Badge variant="success" dot>{isRTL ? 'متصل' : 'Live'}</Badge>}
      />

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {quickLinks.map((q, i) => (
          <Link key={i} to={q.href} className="card p-4 hover:shadow-card-hover transition-all group flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold text-slate-900">{q.count}</span>
              <span className="text-sm text-slate-600">{q.label}</span>
            </div>
            <ArrowIcon size={16} className={`text-slate-400 group-hover:text-brand-600 transition-all ${isRTL ? 'rotate-180 group-hover:-translate-x-0.5' : 'group-hover:translate-x-0.5'}`} />
          </Link>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => (
          <StatCard key={index} {...stat} delay={index * 0.04} />
        ))}
      </div>

      {/* Charts */}
      {chartData && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-2 card">
            <div className="card-header">
              <h3 className="text-sm font-bold text-slate-900">{t('dashboard.ordersRevenue')}</h3>
              <span className="text-xs text-slate-400">{isRTL ? 'آخر 6 أشهر' : 'Last 6 months'}</span>
            </div>
            <div className="card-body pt-2">
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={chartData.ordersOverTime}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" stroke="#94a3b8" tick={{ fontSize: 11 }} />
                  <YAxis stroke="#94a3b8" tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={chartTooltipStyle} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Line type="monotone" dataKey="orders" stroke="#059669" strokeWidth={2} name={isRTL ? 'الطلبات' : 'Orders'} dot={{ fill: '#059669', r: 3 }} />
                  <Line type="monotone" dataKey="revenue" stroke="#0ea5e9" strokeWidth={2} name={isRTL ? 'الإيرادات' : 'Revenue'} dot={{ fill: '#0ea5e9', r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card">
            <div className="card-header">
              <h3 className="text-sm font-bold text-slate-900">{t('dashboard.categoryDistribution')}</h3>
            </div>
            <div className="card-body">
              <ResponsiveContainer width="100%" height={190}>
                <PieChart>
                  <Pie data={chartData.categoryDistribution} cx="50%" cy="50%" innerRadius={48} outerRadius={76} paddingAngle={3} dataKey="value">
                    {chartData.categoryDistribution.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={chartTooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-2">
                {chartData.categoryDistribution.slice(0, 4).map((item, i) => (
                  <div key={i} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                      <span className="text-slate-600">{item.name}</span>
                    </div>
                    <span className="font-bold text-slate-800">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="lg:col-span-2 card">
            <div className="card-header">
              <h3 className="text-sm font-bold text-slate-900">{t('dashboard.userGrowth')}</h3>
              <span className="text-xs text-slate-400">{isRTL ? 'مستخدمون جدد/شهر' : 'New users/month'}</span>
            </div>
            <div className="card-body pt-2">
              <ResponsiveContainer width="100%" height={210}>
                <BarChart data={chartData.userGrowth} barSize={32}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" stroke="#94a3b8" tick={{ fontSize: 11 }} />
                  <YAxis stroke="#94a3b8" tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={chartTooltipStyle} />
                  <Bar dataKey="users" fill="#059669" radius={[6, 6, 0, 0]} name={isRTL ? 'مستخدمون' : 'Users'} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card">
            <div className="card-header">
              <h3 className="text-sm font-bold text-slate-900">{t('dashboard.recentActivity')}</h3>
              <FiActivity size={16} className="text-slate-400" />
            </div>
            <div className="card-body space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                    <FiClock size={14} className="text-slate-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 leading-snug">{activity.action}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{activity.time}</p>
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
