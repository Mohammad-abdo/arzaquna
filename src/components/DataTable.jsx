import { motion } from 'framer-motion'
import { 
  FiEdit, 
  FiTrash2, 
  FiEye, 
  FiChevronLeft, 
  FiChevronRight,
  FiUserCheck,
  FiUserX,
  FiLock,
  FiCheckCircle,
  FiXCircle,
  FiMoreVertical
} from 'react-icons/fi'
import { useState } from 'react'

const DataTable = ({
  columns,
  data,
  loading = false,
  onEdit,
  onDelete,
  onView,
  onBlock,
  onUnblock,
  onApprove,
  onReject,
  pagination = null,
  onPageChange,
  actions = true,
  emptyMessage = 'No data available',
  actionMenu = false
}) => {
  const [openMenu, setOpenMenu] = useState(null)

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="p-12 text-center">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-3 border-gray-300 border-t-gray-600"></div>
          <p className="mt-4 text-gray-600 text-sm font-medium">Loading data...</p>
        </div>
      </div>
    )
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-16 text-center">
        <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-gray-100 flex items-center justify-center">
          <FiEye className="text-gray-600" size={20} />
        </div>
        <p className="text-gray-600 text-base font-medium">{emptyMessage}</p>
      </div>
    )
  }

  const getActionButtons = (row) => {
    const buttons = []
    
    if (onView) {
      buttons.push({
        icon: FiEye,
        label: 'View',
        color: 'text-blue-600 hover:bg-blue-50 hover:text-blue-700',
        action: () => onView(row)
      })
    }
    
    if (onEdit) {
      buttons.push({
        icon: FiEdit,
        label: 'Edit',
        color: 'text-green-600 hover:bg-green-50 hover:text-green-700',
        action: () => onEdit(row)
      })
    }
    
    // Delete button - prioritize it by placing it earlier
    if (onDelete) {
      buttons.push({
        icon: FiTrash2,
        label: 'Delete',
        color: 'text-red-600 hover:bg-red-50 hover:text-red-700',
        action: () => onDelete(row)
      })
    }
    
    if (onApprove && !row.isApproved) {
      buttons.push({
        icon: FiCheckCircle,
        label: 'Approve',
        color: 'text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700',
        action: () => onApprove(row)
      })
    }
    
    if (onReject && row.isApproved) {
      buttons.push({
        icon: FiXCircle,
        label: 'Reject',
        color: 'text-orange-600 hover:bg-orange-50 hover:text-orange-700',
        action: () => onReject(row)
      })
    }
    
    if (onBlock && !row.isBlocked && row.isActive !== false) {
      buttons.push({
        icon: FiLock,
        label: 'Block',
        color: 'text-yellow-600 hover:bg-yellow-50 hover:text-yellow-700',
        action: () => onBlock(row)
      })
    }
    
    if (onUnblock && (row.isBlocked || row.isActive === false)) {
      buttons.push({
        icon: FiUserCheck,
        label: 'Unblock',
        color: 'text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700',
        action: () => onUnblock(row)
      })
    }
    
    return buttons
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              {columns.map((column, index) => (
                <th
                  key={index}
                  className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                >
                  <div className="flex items-center gap-2">
                    {column.icon && <column.icon size={16} className="text-gray-600" />}
                    {column.header}
                  </div>
                </th>
              ))}
              {actions && (
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider sticky right-0 bg-gray-50">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.map((row, rowIndex) => {
              const actionButtons = getActionButtons(row)
              return (
                <motion.tr
                  key={row.id || rowIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: rowIndex * 0.03 }}
                  className="hover:bg-gray-50 transition-colors duration-150"
                >
                  {columns.map((column, colIndex) => (
                    <td key={colIndex} className="px-6 py-4 whitespace-nowrap text-gray-700">
                      {column.render ? column.render(row) : row[column.accessor]}
                    </td>
                  ))}
                  {actions && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium sticky right-0 bg-white group-hover:bg-gray-50">
                      {actionMenu && actionButtons.length > 3 ? (
                        <div className="relative flex justify-end">
                          <button
                            onClick={() => setOpenMenu(openMenu === row.id ? null : row.id)}
                            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            <FiMoreVertical size={18} />
                          </button>
                          {openMenu === row.id && (
                            <div className="absolute right-0 top-10 z-50 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2">
                              {actionButtons.map((btn, idx) => {
                                const Icon = btn.icon
                                return (
                                  <button
                                    key={idx}
                                    onClick={() => {
                                      btn.action()
                                      setOpenMenu(null)
                                    }}
                                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm ${btn.color} transition-colors`}
                                  >
                                    <Icon size={16} />
                                    {btn.label}
                                  </button>
                                )
                              })}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 justify-end flex-wrap">
                          {actionButtons.slice(0, 6).map((btn, idx) => {
                            const Icon = btn.icon
                            return (
                              <button
                                key={idx}
                                onClick={btn.action}
                                className={`p-2.5 rounded-lg transition-all duration-200 ${btn.color} shadow-sm hover:shadow-md`}
                                title={btn.label}
                              >
                                <Icon size={18} />
                              </button>
                            )
                          })}
                        </div>
                      )}
                    </td>
                  )}
                </motion.tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {pagination && pagination.pages > 1 && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-600 font-medium">
            Showing page <span className="font-semibold text-gray-900">{pagination.page}</span> of{' '}
            <span className="font-semibold text-gray-900">{pagination.pages}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
            >
              <FiChevronLeft size={18} className="text-gray-700" />
            </button>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                let pageNum
                if (pagination.pages <= 5) {
                  pageNum = i + 1
                } else if (pagination.page <= 3) {
                  pageNum = i + 1
                } else if (pagination.page >= pagination.pages - 2) {
                  pageNum = pagination.pages - 4 + i
                } else {
                  pageNum = pagination.page - 2 + i
                }
                return (
                  <button
                    key={pageNum}
                    onClick={() => onPageChange(pageNum)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors duration-150 ${
                      pagination.page === pageNum
                        ? 'bg-gray-900 text-white'
                        : 'text-gray-700 hover:bg-gray-100 border border-gray-200'
                    }`}
                  >
                    {pageNum}
                  </button>
                )
              })}
            </div>
            <button
              onClick={() => onPageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.pages}
              className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
            >
              <FiChevronRight size={18} className="text-gray-700" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default DataTable
