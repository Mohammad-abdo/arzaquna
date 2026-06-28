import { useTranslation } from 'react-i18next'

const FormActions = ({ onCancel, submitLabel, loading, loadingLabel, cancelLabel }) => {
  const { t } = useTranslation()
  return (
    <div className="flex gap-3 justify-end pt-6 mt-6 border-t border-slate-200">
      <button type="button" onClick={onCancel} className="btn-secondary">
        {cancelLabel || t('common.cancel')}
      </button>
      <button type="submit" disabled={loading} className="btn-primary">
        {loading ? (loadingLabel || t('common.loading')) : submitLabel}
      </button>
    </div>
  )
}

export default FormActions
