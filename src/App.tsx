import { useState } from 'react';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from './components/ui/tooltip';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { Toaster } from './components/ui/sonner';
import { Toaster as Sonner } from "./components/ui/sonner";
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import ProtectedRoute from './components/ProtectedRoute';

import Addresses from './pages/Addresses';
import AdminDashboard from './pages/admin/Dashboard';
import Auth from './pages/Auth';
import Cart from './pages/Cart';
import ChangePassword from './pages/ChangePassword';
import Explore from './pages/Explore';
import Favorites from './pages/Favorites';
import FoodDetail from './pages/FoodDetail';
import Index from './pages/Index';
import DeliveryDashboard from './pages/livreur/Delivery';
import NotFound from './pages/NotFound';
import Notifications from './pages/Notifications';
import Orders from './pages/Orders';
import KitchenDashboard from './pages/personnel/Kitchen';
import Profile from './pages/Profile';
import ProfileEdit from './pages/ProfileEdit';
import Restaurant from './pages/Restaurant';
import Reviews from './pages/Reviews';
import Settings from './pages/Settings';
import Support from './pages/Support';
import Tracking from './pages/Tracking';
import Welcome from './pages/Welcome';



const queryClient = new QueryClient();


const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light">
      <AuthProvider>
        <CartProvider>
          <TooltipProvider>
            <Toaster></Toaster>
            <Sonner></Sonner>
            <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
              <Routes>
                <Route path="/welcome" element={<Welcome />} />
                <Route path="/auth" element={<Auth />} />

                <Route path="/" element={<ProtectedRoute allowedRoles={["client"]}><Index /></ProtectedRoute>} />
                <Route path="/cart" element={<ProtectedRoute allowedRoles={["client"]}><Cart /></ProtectedRoute>} />
                <Route path="/explore" element={<ProtectedRoute allowedRoles={["client"]}><Explore /></ProtectedRoute>} />
                <Route path="/favorites" element={<ProtectedRoute allowedRoles={["client"]}><Favorites /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="/orders" element={<ProtectedRoute allowedRoles={["client"]}><Orders /></ProtectedRoute>} />
                <Route path="/restaurant" element={<ProtectedRoute><Restaurant /></ProtectedRoute>} />
                <Route path="/restaurant/:id" element={<ProtectedRoute><Restaurant /></ProtectedRoute>} />
                <Route path="/food/:id" element={<ProtectedRoute><FoodDetail /></ProtectedRoute>} />
                <Route path="/tracking/:id" element={<ProtectedRoute><Tracking /></ProtectedRoute>} />
                <Route path="/reviews" element={<ProtectedRoute><Reviews /></ProtectedRoute>} />
                <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
                <Route path="/support" element={<ProtectedRoute><Support /></ProtectedRoute>} />
                <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
                <Route path="/change-password" element={<ProtectedRoute><ChangePassword /></ProtectedRoute>} />
                <Route path="/profile/edit" element={<ProtectedRoute><ProfileEdit /></ProtectedRoute>} />
                <Route path="/addresses" element={<ProtectedRoute><Addresses /></ProtectedRoute>} />

                <Route path="/admin" element={<ProtectedRoute allowedRoles={["admin"]}><AdminDashboard /></ProtectedRoute>} />
                <Route path="/kitchen" element={<ProtectedRoute allowedRoles={["personnel"]}><KitchenDashboard /></ProtectedRoute>} />
                <Route path="/delivery" element={<ProtectedRoute allowedRoles={["livreur"]}><DeliveryDashboard /></ProtectedRoute>} />

                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
)

export default App
