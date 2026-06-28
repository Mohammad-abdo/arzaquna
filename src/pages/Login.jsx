import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../contexts/AuthContext'
import { FiMail, FiLock, FiEye, FiEyeOff, FiShield } from 'react-icons/fi'

const Login = () => {
  const { i18n } = useTranslation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()
  const isRTL = i18n.language === 'ar'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const result = await login(email, password)
    setLoading(false)
    if (result.success) navigate('/dashboard')
  }

  const features = [
    isRTL ? 'إدارة المستخدمين والبائعين' : 'Manage users & vendors',
    isRTL ? 'اعتماد المنتجات والطلبات' : 'Approve products & orders',
    isRTL ? 'تقارير وإحصائيات شاملة' : 'Comprehensive analytics',
  ]

  return (
    <div className="min-h-screen flex" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Brand panel */}
      <div className="hidden lg:flex lg:w-[45%] xl:w-1/2 bg-sidebar flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-brand-900/40 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/20 to-transparent" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-brand-600/10 rounded-full blur-3xl" />

        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 flex items-center gap-3"
        >
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-lg">أ</span>
          </div>
          <div>
            <h1 className="text-lg font-bold text-white">أرزقنا</h1>
            <p className="text-xs text-slate-400">{isRTL ? 'منصة الماشية' : 'Livestock Platform'}</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="relative z-10"
        >
          <h2 className="text-3xl xl:text-4xl font-bold text-white leading-tight text-balance mb-4">
            {isRTL ? 'لوحة إدارة رسمية لمنصة أرزقنا' : 'Official Admin Console for Arzaquna'}
          </h2>
          <p className="text-slate-400 text-base leading-relaxed max-w-md mb-10">
            {isRTL
              ? 'منصة متكاملة لإدارة البائعين والمنتجات والطلبات والمحتوى بكل احترافية وأمان.'
              : 'A complete platform to manage vendors, products, orders, and content with professionalism and security.'}
          </p>
          <div className="space-y-4">
            {features.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="flex items-center gap-3"
              >
                <div className="w-8 h-8 rounded-lg bg-brand-500/20 border border-brand-500/30 flex items-center justify-center flex-shrink-0">
                  <FiShield size={14} className="text-brand-400" />
                </div>
                <span className="text-sm text-slate-300">{item}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <p className="relative z-10 text-xs text-slate-500">
          © {new Date().getFullYear()} Arzaquna. {isRTL ? 'جميع الحقوق محفوظة' : 'All rights reserved.'}
        </p>
      </div>

      {/* Form */}
      <div className="flex-1 flex items-center justify-center bg-surface-subtle px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-[420px]"
        >
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-600 to-brand-800 flex items-center justify-center">
              <span className="text-white font-bold text-xl">أ</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">أرزقنا</h1>
              <p className="text-xs text-slate-500">{isRTL ? 'لوحة الإدارة' : 'Admin Panel'}</p>
            </div>
          </div>

          <div className="card p-8">
            <div className="mb-7">
              <h2 className="text-xl font-bold text-slate-900">
                {isRTL ? 'تسجيل الدخول' : 'Sign in'}
              </h2>
              <p className="text-slate-500 text-sm mt-1">
                {isRTL ? 'أدخل بيانات حساب الإدارة' : 'Enter your admin credentials'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-1.5">
                  {isRTL ? 'البريد الإلكتروني' : 'Email address'}
                </label>
                <div className="relative">
                  <FiMail className={`absolute top-1/2 -translate-y-1/2 text-slate-400 ${isRTL ? 'right-3' : 'left-3'}`} size={17} />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className={`input-field ${isRTL ? 'pr-10' : 'pl-10'}`}
                    placeholder="admin@arzaquna.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-slate-700 mb-1.5">
                  {isRTL ? 'كلمة المرور' : 'Password'}
                </label>
                <div className="relative">
                  <FiLock className={`absolute top-1/2 -translate-y-1/2 text-slate-400 ${isRTL ? 'right-3' : 'left-3'}`} size={17} />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className={`input-field ${isRTL ? 'pr-10 pl-10' : 'pl-10 pr-10'}`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 ${isRTL ? 'left-3' : 'right-3'}`}
                  >
                    {showPassword ? <FiEyeOff size={17} /> : <FiEye size={17} />}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading} className="btn-primary w-full !py-3 mt-2">
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    {isRTL ? 'جاري الدخول...' : 'Signing in...'}
                  </span>
                ) : (isRTL ? 'دخول لوحة الإدارة' : 'Sign in to dashboard')}
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-slate-100">
              <p className="text-xs text-slate-400 text-center">
                {isRTL ? 'الافتراضي:' : 'Default:'} admin@arzaquna.com / admin123
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default Login
