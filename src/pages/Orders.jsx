import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import api from '../utils/api'
import toast from 'react-hot-toast'
import { FiShoppingCart, FiSearch, FiX, FiUser, FiPackage, FiClock } from 'react-icons/fi'
import PageHeader from '../components/PageHeader'
import Badge from '../components/Badge'
import FilterTabs from '../components/FilterTabs'

const STATUS_CONFIG = {
  PENDING:     { label: 'Pending',     ar: 'قيد الانتظار', color: 'bg-amber-100 text-amber-700 border-amber-200' },
  CONFIRMED:   { label: 'Confirmed',   ar: 'مؤكد',         color: 'bg-blue-100 text-blue-700 border-blue-200' },
  IN_PROGRESS: { label: 'In Progress', ar: 'قيد التنفيذ',  color: 'bg-purple-100 text-purple-700 border-purple-200' },
  COMPLETED:   { label: 'Completed',   ar: 'مكتمل',        color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  CANCELLED:   { label: 'Cancelled',   ar: 'ملغي',         color: 'bg-red-100 text-red-700 border-red-200' },
}

const StatusBadge = ({ status }) => {
  const variantMap = {
    PENDING: 'warning', CONFIRMED: 'info', IN_PROGRESS: 'purple',
    COMPLETED: 'success', CANCELLED: 'danger',
  }
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.PENDING
  return <Badge variant={variantMap[status] || 'warning'} dot>{cfg.label}</Badge>
}

const OrderDetailModal = ({ order, onClose, onStatusChange }) => {
  const [updating, setUpdating] = useState(false)
  const total = order.items?.reduce((sum, i) => sum + i.price * i.quantity, 0) || 0

  const updateStatus = async (newStatus) => {
    setUpdating(true)
    try {
      const res = await api.put(`/admin/orders/${order.id}/status`, { status: newStatus })
      if (res.data.success) {
        toast.success(`Status updated to ${STATUS_CONFIG[newStatus].label}`)
        onStatusChange(order.id, newStatus)
      }
    } catch {
      toast.error('Failed to update status')
    } finally {
      setUpdating(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        onClick={e => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div>
            <h2 className="font-bold text-gray-900 text-lg">Order Details</h2>
            <p className="text-xs text-gray-400 font-mono mt-0.5">{order.id}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-colors"><FiX size={18} /></button>
        </div>

        <div className="p-5 space-y-4">
          {/* Status */}
          <div className="flex items-center justify-between">
            <StatusBadge status={order.status} />
            <div className="flex gap-1.5">
              {Object.entries(STATUS_CONFIG).map(([key, cfg]) =>
                key !== order.status ? (
                  <button
                    key={key}
                    onClick={() => updateStatus(key)}
                    disabled={updating}
                    className="px-2.5 py-1 text-xs border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 transition-colors disabled:opacity-50"
                  >
                    → {cfg.label}
                  </button>
                ) : null
              )}
            </div>
          </div>

          {/* Customer & Vendor */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs text-gray-400 mb-1 flex items-center gap-1"><FiUser size={12} /> Customer</p>
              <p className="font-semibold text-gray-900 text-sm">{order.user?.fullName}</p>
              <p className="text-xs text-gray-500">{order.user?.phone}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs text-gray-400 mb-1 flex items-center gap-1"><FiPackage size={12} /> Vendor</p>
              <p className="font-semibold text-gray-900 text-sm">{order.vendor?.storeName || order.vendor?.user?.fullName}</p>
              <p className="text-xs text-gray-500">{order.vendor?.user?.phone}</p>
            </div>
          </div>

          {/* Items */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Items ({order.items?.length || 0})</p>
            <div className="space-y-2">
              {order.items?.map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div>
                    <p className="text-sm font-medium text-gray-800">{item.product?.nameEn}</p>
                    <p className="text-xs text-gray-500">{item.product?.nameAr}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-900">{(item.price * item.quantity).toLocaleString()} SAR</p>
                    <p className="text-xs text-gray-400">× {item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="flex items-center justify-between bg-gray-900 text-white p-4 rounded-xl">
            <span className="text-sm font-medium">Total Amount</span>
            <span className="text-lg font-bold">{total.toLocaleString()} SAR</span>
          </div>

          {/* Notes */}
          {order.notes && (
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-3">
              <p className="text-xs font-semibold text-amber-600 mb-1">Customer Notes</p>
              <p className="text-sm text-gray-700">{order.notes}</p>
            </div>
          )}

          {/* Date */}
          <p className="text-xs text-gray-400 flex items-center gap-1">
            <FiClock size={12} />
            {new Date(order.createdAt).toLocaleString('en-SA', { dateStyle: 'medium', timeStyle: 'short' })}
          </p>
        </div>
      </motion.div>
    </div>
  )
}

const Orders = () => {
  const { t } = useTranslation()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [statusFilter, setStatusFilter] = useState('')
  const [search, setSearch] = useState('')
  const [selectedOrder, setSelectedOrder] = useState(null)

  useEffect(() => { fetchOrders() }, [page, statusFilter])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const params = { page, limit: 15 }
      if (statusFilter) params.status = statusFilter
      const res = await api.get('/admin/orders', { params })
      if (res.data.success) {
        setOrders(res.data.data.orders)
        setTotalPages(res.data.data.pagination.pages)
        setTotal(res.data.data.pagination.total)
      }
    } catch {
      toast.error('Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = (orderId, newStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o))
    if (selectedOrder?.id === orderId) setSelectedOrder(prev => ({ ...prev, status: newStatus }))
  }

  const filtered = search
    ? orders.filter(o =>
        o.user?.fullName?.toLowerCase().includes(search.toLowerCase()) ||
        o.vendor?.storeName?.toLowerCase().includes(search.toLowerCase()) ||
        o.id.includes(search)
      )
    : orders

  const orderTotal = (order) => order.items?.reduce((s, i) => s + i.price * i.quantity, 0) || 0

  const tabs = [
    { label: 'All', value: '' },
    ...Object.entries(STATUS_CONFIG).map(([k, v]) => ({ label: v.label, value: k }))
  ]

  return (
    <div className="page-shell space-y-5">
      <PageHeader
        title={t('sidebar.orders')}
        subtitle={`${total} ${t('common.results')}`}
        breadcrumbs={[{ label: t('sidebar.orders') }]}
      />

      <div className="card p-4">
        <div className="flex flex-wrap gap-3 items-center">
          <FilterTabs tabs={tabs} value={statusFilter} onChange={(v) => { setStatusFilter(v); setPage(1) }} />
          <div className="relative ms-auto w-full sm:w-64">
            <FiSearch className="absolute start-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Search customer or vendor..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="input-field ps-9"
            />
          </div>
        </div>
      </div>

      <div className="card overflow-hidden">
        {loading ? (
          <div className="p-16 text-center">
            <div className="w-8 h-8 border-2 border-brand-600 border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-16 text-center">
            <FiShoppingCart size={40} className="text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 font-medium">No orders found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200">
                  <th className="px-4 py-3 text-start text-[11px] font-bold text-slate-500 uppercase tracking-wide">Order</th>
                  <th className="px-4 py-3 text-start text-[11px] font-bold text-slate-500 uppercase tracking-wide">Customer</th>
                  <th className="px-4 py-3 text-start text-[11px] font-bold text-slate-500 uppercase tracking-wide">Vendor</th>
                  <th className="px-4 py-3 text-start text-[11px] font-bold text-slate-500 uppercase tracking-wide">Items</th>
                  <th className="px-4 py-3 text-start text-[11px] font-bold text-slate-500 uppercase tracking-wide">Total</th>
                  <th className="px-4 py-3 text-start text-[11px] font-bold text-slate-500 uppercase tracking-wide">Status</th>
                  <th className="px-4 py-3 text-start text-[11px] font-bold text-slate-500 uppercase tracking-wide">Date</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((order, idx) => (
                  <motion.tr
                    key={order.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.02 }}
                    onClick={() => setSelectedOrder(order)}
                    className="border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <td className="px-4 py-3.5">
                      <span className="font-mono text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded">#{order.id.slice(0, 8)}</span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs flex-shrink-0">
                          {order.user?.fullName?.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{order.user?.fullName}</p>
                          <p className="text-xs text-gray-400">{order.user?.phone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-sm text-gray-700">{order.vendor?.storeName || order.vendor?.user?.fullName || 'N/A'}</td>
                    <td className="px-4 py-3.5 text-sm text-gray-600">{order.items?.length || 0} item{order.items?.length !== 1 ? 's' : ''}</td>
                    <td className="px-4 py-3.5">
                      <span className="text-sm font-semibold text-gray-900">{orderTotal(order).toLocaleString()} SAR</span>
                    </td>
                    <td className="px-4 py-3.5"><StatusBadge status={order.status} /></td>
                    <td className="px-4 py-3.5 text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString('en-SA')}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
            <p className="text-sm text-gray-500">Page {page} of {totalPages}</p>
            <div className="flex gap-2">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm disabled:opacity-40 hover:bg-gray-50">Previous</button>
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm disabled:opacity-40 hover:bg-gray-50">Next</button>
            </div>
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedOrder && (
          <OrderDetailModal
            order={selectedOrder}
            onClose={() => setSelectedOrder(null)}
            onStatusChange={handleStatusChange}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

export default Orders
