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
import { LoginPage } from '../modules/auth/pages/LoginPage';
import { RegisterPage } from '../modules/auth/pages/RegisterPage';
import { ProfilePage } from '../modules/users/pages/ProfilePage';
import { TenantSelectionPage } from '../modules/tenants/pages/TenantSelectionPage';
import { ProtectedRoute } from '../modules/access/components/ProtectedRoute';
import { TenantRoute } from '../modules/access/components/TenantRoute';
import { SuperAdminRoute } from '../modules/access/components/SuperAdminRoute';
import { PermissionRoute } from '../modules/access/components/PermissionRoute';
import { UserRole } from '../types/enums';

export const AppRouter: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/tenants/select" element={<TenantSelectionPage />} />

        {/* Tenant Protected Routes */}
        <Route element={<TenantRoute />}>
          <Route
            path="/*"
            element={
              <MainLayout userRole={UserRole.SUPER_ADMIN}>
                <Routes>
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route
                    path="/admin"
                    element={
                      <SuperAdminRoute>
                        <SuperAdminDashboardPage />
                      </SuperAdminRoute>
                    }
                  />
                  <Route path="/ai-chat" element={<AIChatPage />} />
                  <Route
                    path="/customers"
                    element={
                      <PermissionRoute permission="customer.view">
                        <CustomerListPage />
                      </PermissionRoute>
                    }
                  />
                  <Route
                    path="/products"
                    element={
                      <PermissionRoute permission="product.view">
                        <ProductListPage />
                      </PermissionRoute>
                    }
                  />
                  <Route path="/orders" element={<OrderListPage />} />
                  <Route path="/support" element={<SupportTicketListPage />} />
                  <Route path="/sales" element={<SalesLeadListPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
              </MainLayout>
            }
          />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};
