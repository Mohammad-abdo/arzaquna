import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './contexts/AuthContext'
import PrivateRoute from './components/PrivateRoute'
import Layout from './components/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Users from './pages/Users'
import UserCreate from './pages/UserCreate'
import UserEdit from './pages/UserEdit'
import UserView from './pages/UserView'
import Vendors from './pages/Vendors'
import VendorView from './pages/VendorView'
import VendorApplications from './pages/VendorApplications'
import Products from './pages/Products'
import ProductCreate from './pages/ProductCreate'
import ProductEdit from './pages/ProductEdit'
import ProductView from './pages/ProductView'
import Categories from './pages/Categories'
import CategoryCreate from './pages/CategoryCreate'
import CategoryView from './pages/CategoryView'
import Sliders from './pages/Sliders'
import Orders from './pages/Orders'
import Messages from './pages/Messages'
import AppContent from './pages/AppContent'
import Statuses from './pages/Statuses'
import AdminUsers from './pages/AdminUsers'
import Notifications from './pages/Notifications'
import Reports from './pages/Reports'
import Settings from './pages/Settings'

function App() {
  return (
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true
      }}
    >
      <AuthProvider>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Layout />
              </PrivateRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="users" element={<Users />} />
            <Route path="users/create" element={<UserCreate />} />
            <Route path="users/:id" element={<UserView />} />
            <Route path="users/:id/edit" element={<UserEdit />} />
            <Route path="vendors" element={<Vendors />} />
            <Route path="vendors/:id" element={<VendorView />} />
            <Route path="vendor-applications" element={<VendorApplications />} />
            <Route path="products" element={<Products />} />
            <Route path="products/create" element={<ProductCreate />} />
            <Route path="products/:id" element={<ProductView />} />
            <Route path="products/:id/edit" element={<ProductEdit />} />
            <Route path="categories" element={<Categories />} />
            <Route path="categories/create" element={<CategoryCreate />} />
            <Route path="categories/:id" element={<CategoryView />} />
            <Route path="categories/:id/edit" element={<CategoryCreate />} />
            <Route path="sliders" element={<Sliders />} />
            <Route path="orders" element={<Orders />} />
            <Route path="messages" element={<Messages />} />
            <Route path="app-content" element={<AppContent />} />
            <Route path="statuses" element={<Statuses />} />
            <Route path="admin-users" element={<AdminUsers />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="reports" element={<Reports />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  )
}

export default App

