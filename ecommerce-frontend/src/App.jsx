import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { SettingsProvider } from './context/SettingsContext.jsx'; 
import ProtectedRoute from './components/ProtectedRoute.jsx';

// Components
import NavigationBar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import ScrollToTop from './components/ScrollToTop.jsx';
import AdminLayout from './components/AdminLayout.jsx';

// Pages publiques
import LandingPage from './pages/LandingPage.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import ForgotPassword from './pages/ForgotPassword.jsx';
import Contact from './pages/Contact.jsx';
import Products from './pages/Products.jsx';
import ProductDetail from './pages/ProductDetail.jsx';

// Pages client
import Cart from './pages/Cart.jsx';
import Checkout from './pages/Checkout.jsx';
import MyOrders from './pages/MyOrders.jsx';
import Profile from './pages/Profile.jsx';

// Pages admin
import Dashboard from './admin/Dashboard.jsx';
import ProductsManagement from './admin/ProductsManagement.jsx';
import CategoriesManagement from './admin/CategoriesManagement.jsx';
import OrdersManagement from './admin/OrdersManagement.jsx';
import UsersManagement from './admin/UsersManagement.jsx';
import MessagesManagement from './admin/MessagesManagement.jsx';
import EventsManagement from './admin/EventsManagement.jsx';
import CertificationsManagement from './admin/CertificationsManagement.jsx';
import SiteSettings from './admin/SiteSettings.jsx';

function App() {
  return (
    <AuthProvider>
      <SettingsProvider> 
      <Router>
        <div className="d-flex flex-column min-vh-100">
          <NavigationBar />
          <main className="flex-grow-1">
            <Routes>
              {/* Routes publiques */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/produits" element={<Products />} />
              <Route path="/produits/:id" element={<ProductDetail />} />

              {/* Routes protégées client */}
              <Route 
                path="/panier" 
                element={
                  <ProtectedRoute>
                    <Cart />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/checkout" 
                element={
                  <ProtectedRoute>
                    <Checkout />
                  </ProtectedRoute>
                } 
              />
              <Route
                path="/mes-commandes"
                element={
                  <ProtectedRoute>
                    <MyOrders />
                  </ProtectedRoute>
                }
              />
              <Route 
                path="/profil" 
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } 
              />

              {/* Routes admin */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute adminOnly={true}>
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Dashboard />} />
                <Route path="produits" element={<ProductsManagement />} />
                <Route path="categories" element={<CategoriesManagement />} />
                <Route path="commandes" element={<OrdersManagement />} />
                <Route path="utilisateurs" element={<UsersManagement />} />
                <Route path="messages" element={<MessagesManagement />} />
                <Route path="evenements" element={<EventsManagement />} />
                <Route path="certifications" element={<CertificationsManagement />} />
                <Route path="parametres" element={<SiteSettings />} />
              </Route>
            </Routes>
          </main>
          <Footer />
          <ScrollToTop />
        </div>
      </Router>
      </SettingsProvider>
    </AuthProvider>
  );
}

export default App;