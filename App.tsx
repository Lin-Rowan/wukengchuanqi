
import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import FeatureSection from './components/FeatureSection';
import ActionCards from './components/ActionCards';
import GameList from './components/GameList';
import Footer from './components/Footer';
import ComplaintPage from './pages/ComplaintPage';

// Admin Components
import AdminLayout from './layouts/AdminLayout';
import LoginPage from './pages/admin/Login';
import Dashboard from './pages/admin/Dashboard';
import CarouselManager from './pages/admin/CarouselManager';
import GameManager from './pages/admin/GameManager';
import CardManager from './pages/admin/CardManager';
import ComplianceManager from './pages/admin/Complaints';
import Settings from './pages/admin/Settings';

// 保护路由组件
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const token = localStorage.getItem('admin_token');
  const location = useLocation();

  if (!token) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
};

// 前台布局
const FrontLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <Hero />
      <main className="max-w-[1200px] mx-auto px-4 py-16 space-y-24">
        <FeatureSection />
        <ActionCards />
        <GameList />

        <div className="flex flex-col md:flex-row justify-between items-center text-[13px] text-gray-600 py-10 border-t border-white/5 gap-4">
          <div>喜欢玩快餐服、生态服的玩家都可以收藏本站</div>
          <div className="tracking-widest text-center md:text-right">无坑无托、透明公平、良心厚道、不肝不氪的生态服将于未来上线，敬请期待...</div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* 前台路由 */}
        <Route path="/" element={<FrontLayout />} />
        <Route path="/complaint" element={<ComplaintPage />} />

        {/* 后台路由 */}
        <Route path="/admin/login" element={<LoginPage />} />

        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="carousel" element={<CarouselManager />} />
          <Route path="cards" element={<CardManager />} />
          <Route path="games" element={<GameManager />} />
          <Route path="complaints" element={<ComplianceManager />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
