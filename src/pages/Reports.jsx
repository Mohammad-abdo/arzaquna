import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import api from '../utils/api'
import toast from 'react-hot-toast'
import { FiDownload, FiFileText, FiFile, FiCalendar, FiFilter, FiBarChart2 } from 'react-icons/fi'
import jsPDF from 'jspdf'
import 'jspdf-autotable'

const Reports = () => {
  const { t } = useTranslation()
  const [loading, setLoading] = useState(false)
  const [reportType, setReportType] = useState('all')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [reportData, setReportData] = useState(null)

  useEffect(() => {
    // Set default date range (last 30 days)
    const end = new Date()
    const start = new Date()
    start.setDate(start.getDate() - 30)
    setStartDate(start.toISOString().split('T')[0])
    setEndDate(end.toISOString().split('T')[0])
  }, [])

  const generateReport = async () => {
    try {
      setLoading(true)
      const params = { type: reportType === 'all' ? '' : reportType }
      if (startDate) params.startDate = startDate
      if (endDate) params.endDate = endDate

      const response = await api.get('/admin/reports', { params })
      if (response.data.success) {
        setReportData(response.data.data)
        toast.success('Report generated successfully')
      }
    } catch (error) {
      toast.error('Failed to generate report')
    } finally {
      setLoading(false)
    }
  }

  const exportToPDF = () => {
    if (!reportData) {
      toast.error('Please generate a report first')
      return
    }

    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()

    // Title
    doc.setFontSize(20)
    doc.text('Arzaquna Reports', pageWidth / 2, 20, { align: 'center' })
    
    doc.setFontSize(12)
    doc.text(`Report Type: ${reportType === 'all' ? 'All Reports' : reportType}`, 14, 30)
    doc.text(`Date Range: ${startDate} to ${endDate}`, 14, 37)
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 44)

    let yPos = 55

    // Summary
    if (reportData.summary) {
      doc.setFontSize(16)
      doc.text('Summary Statistics', 14, yPos)
      yPos += 10

      doc.setFontSize(11)
      const summaryData = [
        ['Total Users', reportData.summary.totalUsers],
        ['Total Vendors', reportData.summary.totalVendors],
        ['Total Products', reportData.summary.totalProducts],
        ['Total Orders', reportData.summary.totalOrders],
        ['Total Revenue', `$${reportData.summary.totalRevenue.toFixed(2)}`]
      ]

      doc.autoTable({
        startY: yPos,
        head: [['Metric', 'Value']],
        body: summaryData,
        theme: 'striped',
        headStyles: { fillColor: [59, 130, 246] }
      })
      yPos = doc.lastAutoTable.finalY + 15
    }

    // Users Report
    if (reportData.users && reportData.users.length > 0) {
      if (yPos > pageHeight - 50) {
        doc.addPage()
        yPos = 20
      }

      doc.setFontSize(16)
      doc.text('Users Report', 14, yPos)
      yPos += 10

      const usersData = reportData.users.map(user => [
        user.fullName,
        user.email,
        user.phone,
        user.role,
        user.isActive ? 'Active' : 'Inactive',
        new Date(user.createdAt).toLocaleDateString()
      ])

      doc.autoTable({
        startY: yPos,
        head: [['Name', 'Email', 'Phone', 'Role', 'Status', 'Created']],
        body: usersData,
        theme: 'striped',
        headStyles: { fillColor: [59, 130, 246] }
      })
      yPos = doc.lastAutoTable.finalY + 15
    }

    // Vendors Report
    if (reportData.vendors && reportData.vendors.length > 0) {
      if (yPos > pageHeight - 50) {
        doc.addPage()
        yPos = 20
      }

      doc.setFontSize(16)
      doc.text('Vendors Report', 14, yPos)
      yPos += 10

      const vendorsData = reportData.vendors.map(vendor => [
        vendor.storeName,
        vendor.user?.fullName || 'N/A',
        vendor.city,
        vendor.region,
        vendor.isApproved ? 'Approved' : 'Pending',
        vendor._count?.products || 0,
        new Date(vendor.createdAt).toLocaleDateString()
      ])

      doc.autoTable({
        startY: yPos,
        head: [['Store Name', 'Owner', 'City', 'Region', 'Status', 'Products', 'Created']],
        body: vendorsData,
        theme: 'striped',
        headStyles: { fillColor: [59, 130, 246] }
      })
      yPos = doc.lastAutoTable.finalY + 15
    }

    // Products Report
    if (reportData.products && reportData.products.length > 0) {
      if (yPos > pageHeight - 50) {
        doc.addPage()
        yPos = 20
      }

      doc.setFontSize(16)
      doc.text('Products Report', 14, yPos)
      yPos += 10

      const productsData = reportData.products.map(product => [
        product.nameEn,
        product.category?.nameEn || 'N/A',
        product.vendor?.user?.fullName || 'N/A',
        `$${product.price}`,
        product.isApproved ? 'Approved' : 'Pending',
        new Date(product.createdAt).toLocaleDateString()
      ])

      doc.autoTable({
        startY: yPos,
        head: [['Name', 'Category', 'Vendor', 'Price', 'Status', 'Created']],
        body: productsData,
        theme: 'striped',
        headStyles: { fillColor: [59, 130, 246] }
      })
      yPos = doc.lastAutoTable.finalY + 15
    }

    // Orders Report
    if (reportData.orders && reportData.orders.length > 0) {
      if (yPos > pageHeight - 50) {
        doc.addPage()
        yPos = 20
      }

      doc.setFontSize(16)
      doc.text('Orders Report', 14, yPos)
      yPos += 10

      const ordersData = reportData.orders.map(order => [
        order.id.substring(0, 8),
        order.user?.fullName || 'N/A',
        order.vendor?.user?.fullName || 'N/A',
        order.status,
        `$${order.totalAmount}`,
        new Date(order.createdAt).toLocaleDateString()
      ])

      doc.autoTable({
        startY: yPos,
        head: [['Order ID', 'Customer', 'Vendor', 'Status', 'Amount', 'Date']],
        body: ordersData,
        theme: 'striped',
        headStyles: { fillColor: [59, 130, 246] }
      })
    }

    // Save PDF
    const fileName = `arzaquna-report-${reportType}-${new Date().toISOString().split('T')[0]}.pdf`
    doc.save(fileName)
    toast.success('PDF exported successfully')
  }

  const exportToCSV = () => {
    if (!reportData) {
      toast.error('Please generate a report first')
      return
    }

    let csvContent = ''

    // Summary
    if (reportData.summary) {
      csvContent += 'Summary Statistics\n'
      csvContent += 'Metric,Value\n'
      csvContent += `Total Users,${reportData.summary.totalUsers}\n`
      csvContent += `Total Vendors,${reportData.summary.totalVendors}\n`
      csvContent += `Total Products,${reportData.summary.totalProducts}\n`
      csvContent += `Total Orders,${reportData.summary.totalOrders}\n`
      csvContent += `Total Revenue,$${reportData.summary.totalRevenue.toFixed(2)}\n\n`
    }

    // Users
    if (reportData.users && reportData.users.length > 0) {
      csvContent += 'Users Report\n'
      csvContent += 'Name,Email,Phone,Role,Status,Created\n'
      reportData.users.forEach(user => {
        csvContent += `"${user.fullName}","${user.email}","${user.phone}","${user.role}","${user.isActive ? 'Active' : 'Inactive'}","${new Date(user.createdAt).toLocaleDateString()}"\n`
      })
      csvContent += '\n'
    }

    // Vendors
    if (reportData.vendors && reportData.vendors.length > 0) {
      csvContent += 'Vendors Report\n'
      csvContent += 'Store Name,Owner,City,Region,Status,Products,Created\n'
      reportData.vendors.forEach(vendor => {
        csvContent += `"${vendor.storeName}","${vendor.user?.fullName || 'N/A'}","${vendor.city}","${vendor.region}","${vendor.isApproved ? 'Approved' : 'Pending'}","${vendor._count?.products || 0}","${new Date(vendor.createdAt).toLocaleDateString()}"\n`
      })
      csvContent += '\n'
    }

    // Products
    if (reportData.products && reportData.products.length > 0) {
      csvContent += 'Products Report\n'
      csvContent += 'Name,Category,Vendor,Price,Status,Created\n'
      reportData.products.forEach(product => {
        csvContent += `"${product.nameEn}","${product.category?.nameEn || 'N/A'}","${product.vendor?.user?.fullName || 'N/A'}","$${product.price}","${product.isApproved ? 'Approved' : 'Pending'}","${new Date(product.createdAt).toLocaleDateString()}"\n`
      })
      csvContent += '\n'
    }

    // Orders
    if (reportData.orders && reportData.orders.length > 0) {
      csvContent += 'Orders Report\n'
      csvContent += 'Order ID,Customer,Vendor,Status,Amount,Date\n'
      reportData.orders.forEach(order => {
        csvContent += `"${order.id.substring(0, 8)}","${order.user?.fullName || 'N/A'}","${order.vendor?.user?.fullName || 'N/A'}","${order.status}","$${order.totalAmount}","${new Date(order.createdAt).toLocaleDateString()}"\n`
      })
    }

    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `arzaquna-report-${reportType}-${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success('CSV exported successfully')
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-gray-800 flex items-center gap-3">
            <FiBarChart2 className="text-primary-600" size={40} />
            Reports
          </h1>
          <p className="text-gray-600 mt-1">Generate and export detailed reports</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <FiFilter size={16} />
                Report Type
              </label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
              >
                <option value="all">All Reports</option>
                <option value="users">Users</option>
                <option value="vendors">Vendors</option>
                <option value="products">Products</option>
                <option value="orders">Orders</option>
              </select>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <FiCalendar size={16} />
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <FiCalendar size={16} />
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-2.5 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
              />
            </div>

            <div className="flex items-end">
              <button
                onClick={generateReport}
                disabled={loading}
                className="w-full px-6 py-2.5 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl hover:from-primary-700 hover:to-primary-800 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 font-semibold flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    Generating...
                  </>
                ) : (
                  <>
                    <FiBarChart2 size={18} />
                    Generate Report
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Export Buttons */}
        {reportData && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-800">Export Report</h2>
                <p className="text-gray-600 text-sm mt-1">Download report in PDF or CSV format</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={exportToPDF}
                  className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all shadow-lg hover:shadow-xl font-semibold"
                >
                  <FiFileText size={20} />
                  Export PDF
                </button>
                <button
                  onClick={exportToCSV}
                  className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all shadow-lg hover:shadow-xl font-semibold"
                >
                  <FiFile size={20} />
                  Export CSV
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Report Preview */}
        {reportData && (
          <div className="space-y-6">
            {/* Summary */}
            {reportData.summary && (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Summary Statistics</h2>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
                    <div className="text-sm font-semibold text-blue-600 mb-1">Total Users</div>
                    <div className="text-2xl font-bold text-blue-800">{reportData.summary.totalUsers}</div>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
                    <div className="text-sm font-semibold text-purple-600 mb-1">Total Vendors</div>
                    <div className="text-2xl font-bold text-purple-800">{reportData.summary.totalVendors}</div>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
                    <div className="text-sm font-semibold text-green-600 mb-1">Total Products</div>
                    <div className="text-2xl font-bold text-green-800">{reportData.summary.totalProducts}</div>
                  </div>
                  <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-4 border border-yellow-200">
                    <div className="text-sm font-semibold text-yellow-600 mb-1">Total Orders</div>
                    <div className="text-2xl font-bold text-yellow-800">{reportData.summary.totalOrders}</div>
                  </div>
                  <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-4 border border-emerald-200">
                    <div className="text-sm font-semibold text-emerald-600 mb-1">Total Revenue</div>
                    <div className="text-2xl font-bold text-emerald-800">${reportData.summary.totalRevenue.toFixed(2)}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Users Table */}
            {reportData.users && reportData.users.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Users ({reportData.users.length})</h2>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Name</th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Email</th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Phone</th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Role</th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Status</th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Created</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {reportData.users.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">{user.fullName}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{user.email}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{user.phone}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{user.role}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                              {user.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">{new Date(user.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Vendors Table */}
            {reportData.vendors && reportData.vendors.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Vendors ({reportData.vendors.length})</h2>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Store Name</th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Owner</th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">City</th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Region</th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Status</th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Products</th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Created</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {reportData.vendors.map((vendor) => (
                        <tr key={vendor.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">{vendor.storeName}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{vendor.user?.fullName || 'N/A'}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{vendor.city}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{vendor.region}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${vendor.isApproved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                              {vendor.isApproved ? 'Approved' : 'Pending'}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">{vendor._count?.products || 0}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{new Date(vendor.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Products Table */}
            {reportData.products && reportData.products.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Products ({reportData.products.length})</h2>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Name</th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Category</th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Vendor</th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Price</th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Status</th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Created</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {reportData.products.map((product) => (
                        <tr key={product.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">{product.nameEn}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{product.category?.nameEn || 'N/A'}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{product.vendor?.user?.fullName || 'N/A'}</td>
                          <td className="px-4 py-3 text-sm font-semibold text-gray-900">${product.price}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${product.isApproved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                              {product.isApproved ? 'Approved' : 'Pending'}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">{new Date(product.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Orders Table */}
            {reportData.orders && reportData.orders.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Orders ({reportData.orders.length})</h2>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Order ID</th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Customer</th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Vendor</th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Status</th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Amount</th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {reportData.orders.map((order) => (
                        <tr key={order.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">{order.id.substring(0, 8)}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{order.user?.fullName || 'N/A'}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{order.vendor?.user?.fullName || 'N/A'}</td>
                          <td className="px-4 py-3">
                            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                              {order.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm font-semibold text-gray-900">${order.totalAmount}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{new Date(order.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {!reportData && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-12 text-center">
            <FiBarChart2 size={64} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500 text-lg">Generate a report to view data</p>
          </div>
        )}
      </motion.div>
    </div>
  )
}

export default Reports

