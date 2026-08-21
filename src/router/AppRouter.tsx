import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from '../components/layout/MainLayout';
import { DashboardPage } from '../modules/dashboard/pages/DashboardPage';
import { SuperAdminDashboardPage } from '../modules/super-admin/pages/SuperAdminDashboardPage';
import { AIChatPage } from '../modules/ai/pages/AIChatPage';
import { CustomerListPage } from '../modules/customers/pages/CustomerListPage';
import { ProductListPage } from '../modules/products/pages/ProductListPage';
import { OrderListPage } from '../modules/orders/pages/OrderListPage';
import { SupportTicketListPage } from '../modules/support/pages/SupportTicketListPage';
import { SalesLeadListPage } from '../modules/sales/pages/SalesLeadListPage';
import { UserRole } from '../types/enums';

export const AppRouter: React.FC = () => {
  const currentRole = UserRole.SUPER_ADMIN;

  return (
    <MainLayout userRole={currentRole}>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/admin" element={<SuperAdminDashboardPage />} />
        <Route path="/ai-chat" element={<AIChatPage />} />
        <Route path="/customers" element={<CustomerListPage />} />
        <Route path="/products" element={<ProductListPage />} />
        <Route path="/orders" element={<OrderListPage />} />
        <Route path="/support" element={<SupportTicketListPage />} />
        <Route path="/sales" element={<SalesLeadListPage />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </MainLayout>
  );
};
