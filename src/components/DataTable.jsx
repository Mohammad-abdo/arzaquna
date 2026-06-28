import { motion } from 'framer-motion'
import {
  FiEdit, FiTrash2, FiEye, FiChevronLeft, FiChevronRight,
  FiUserCheck, FiLock, FiCheckCircle, FiXCircle, FiMoreVertical, FiInbox,
} from 'react-icons/fi'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

const DataTable = ({
  columns, data, loading = false,
  onEdit, onDelete, onView, onBlock, onUnblock, onApprove, onReject,
  pagination = null, onPageChange,
  actions = true, emptyMessage = 'No data available', actionMenu = false,
}) => {
  const { t, i18n } = useTranslation()
  const [openMenu, setOpenMenu] = useState(null)
  const isRTL = i18n.language === 'ar'

  if (loading) {
    return (
      <div className="card overflow-hidden">
        <div className="p-16 text-center">
          <div className="inline-block animate-spin rounded-full h-9 w-9 border-2 border-slate-200 border-t-brand-600" />
          <p className="mt-4 text-slate-500 text-sm">{t('common.loading')}</p>
        </div>
      </div>
    )
  }

  if (!data || data.length === 0) {
    return (
      <div className="card p-16 text-center">
        <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-slate-100 flex items-center justify-center">
          <FiInbox className="text-slate-400" size={24} />
        </div>
        <p className="text-slate-600 font-medium">{emptyMessage}</p>
      </div>
    )
  }

  const getActionButtons = (row) => {
    const buttons = []
    if (onView) buttons.push({ icon: FiEye, label: t('common.view'), color: 'text-slate-600 hover:bg-slate-100', action: () => onView(row) })
    if (onEdit) buttons.push({ icon: FiEdit, label: t('common.edit'), color: 'text-brand-700 hover:bg-brand-50', action: () => onEdit(row) })
    if (onDelete) buttons.push({ icon: FiTrash2, label: t('common.delete'), color: 'text-red-600 hover:bg-red-50', action: () => onDelete(row) })
    if (onApprove && !row.isApproved) buttons.push({ icon: FiCheckCircle, label: t('common.approved'), color: 'text-emerald-600 hover:bg-emerald-50', action: () => onApprove(row) })
    if (onReject && row.isApproved) buttons.push({ icon: FiXCircle, label: t('common.rejected'), color: 'text-amber-600 hover:bg-amber-50', action: () => onReject(row) })
    if (onBlock && !row.isBlocked && row.isActive !== false) buttons.push({ icon: FiLock, label: 'Block', color: 'text-amber-600 hover:bg-amber-50', action: () => onBlock(row) })
    if (onUnblock && (row.isBlocked || row.isActive === false)) buttons.push({ icon: FiUserCheck, label: 'Unblock', color: 'text-brand-700 hover:bg-brand-50', action: () => onUnblock(row) })
    return buttons
  }

  const PrevIcon = isRTL ? FiChevronRight : FiChevronLeft
  const NextIcon = isRTL ? FiChevronLeft : FiChevronRight

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto scrollbar-thin">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200">
              {columns.map((column, index) => (
                <th key={index} className="px-5 py-3.5 text-start text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    {column.icon && <column.icon size={14} className="text-slate-400" />}
                    {column.header}
                  </div>
                </th>
              ))}
              {actions && (
                <th className="px-5 py-3.5 text-end text-[11px] font-bold text-slate-500 uppercase tracking-wider sticky end-0 bg-slate-50/95 backdrop-blur-sm">
                  {t('common.actions')}
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.map((row, rowIndex) => {
              const actionButtons = getActionButtons(row)
              return (
                <motion.tr
                  key={row.id || rowIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: Math.min(rowIndex * 0.02, 0.2) }}
                  className="hover:bg-slate-50/60 transition-colors"
                >
                  {columns.map((column, colIndex) => (
                    <td key={colIndex} className="px-5 py-4 text-sm text-slate-700">
                      {column.render ? column.render(row) : row[column.accessor]}
                    </td>
                  ))}
                  {actions && (
                    <td className="px-5 py-4 text-sm sticky end-0 bg-white">
                      {actionMenu && actionButtons.length > 3 ? (
                        <div className="relative flex justify-end">
                          <button onClick={() => setOpenMenu(openMenu === row.id ? null : row.id)} className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg">
                            <FiMoreVertical size={16} />
                          </button>
                          {openMenu === row.id && (
                            <div className="absolute end-0 top-10 z-50 w-44 card py-1 shadow-lg">
                              {actionButtons.map((btn, idx) => {
                                const Icon = btn.icon
                                return (
                                  <button key={idx} onClick={() => { btn.action(); setOpenMenu(null) }} className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm ${btn.color}`}>
                                    <Icon size={15} /> {btn.label}
                                  </button>
                                )
                              })}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="flex items-center gap-0.5 justify-end">
                          {actionButtons.slice(0, 6).map((btn, idx) => {
                            const Icon = btn.icon
                            return (
                              <button key={idx} onClick={btn.action} className={`p-2 rounded-lg transition-colors ${btn.color}`} title={btn.label}>
                                <Icon size={16} />
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
        <div className="px-5 py-3.5 bg-slate-50/50 border-t border-slate-200 flex items-center justify-between gap-4">
          <p className="text-sm text-slate-500">
            {t('common.page')} <span className="font-semibold text-slate-800">{pagination.page}</span> {t('common.of')} <span className="font-semibold text-slate-800">{pagination.pages}</span>
          </p>
          <div className="flex items-center gap-1.5">
            <button onClick={() => onPageChange(pagination.page - 1)} disabled={pagination.page === 1} className="btn-secondary !p-2 disabled:opacity-40">
              <PrevIcon size={16} />
            </button>
            {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
              let pageNum
              if (pagination.pages <= 5) pageNum = i + 1
              else if (pagination.page <= 3) pageNum = i + 1
              else if (pagination.page >= pagination.pages - 2) pageNum = pagination.pages - 4 + i
              else pageNum = pagination.page - 2 + i
              return (
                <button
                  key={pageNum}
                  onClick={() => onPageChange(pageNum)}
                  className={`min-w-[36px] h-9 px-2 rounded-lg text-sm font-semibold transition-colors ${
                    pagination.page === pageNum ? 'bg-brand-700 text-white' : 'text-slate-600 hover:bg-white border border-slate-200'
                  }`}
                >
                  {pageNum}
                </button>
              )
            })}
            <button onClick={() => onPageChange(pagination.page + 1)} disabled={pagination.page === pagination.pages} className="btn-secondary !p-2 disabled:opacity-40">
              <NextIcon size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default DataTable
