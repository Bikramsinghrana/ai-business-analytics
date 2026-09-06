import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from '../components/layout/MainLayout';
import { DashboardPage } from '../modules/dashboard/pages/DashboardPage';
import { SuperAdminDashboardPage } from '../modules/super-admin/pages/SuperAdminDashboardPage';
import { SuperAdminTenantsPage } from '../modules/super-admin/pages/SuperAdminTenantsPage';
import { SuperAdminUsersPage } from '../modules/super-admin/pages/SuperAdminUsersPage';
import { SuperAdminRolesPage } from '../modules/super-admin/pages/SuperAdminRolesPage';
import { SuperAdminSettingsPage } from '../modules/super-admin/pages/SuperAdminSettingsPage';
import { SuperAdminInfrastructurePage } from '../modules/super-admin/pages/SuperAdminInfrastructurePage';
import { SuperAdminAiProvidersPage } from '../modules/super-admin/pages/SuperAdminAiProvidersPage';
import { SuperAdminFeatureFlagsPage } from '../modules/super-admin/pages/SuperAdminFeatureFlagsPage';
import { SuperAdminPromptsPage } from '../modules/super-admin/pages/SuperAdminPromptsPage';
import { AIChatPage } from '../modules/ai/pages/AIChatPage';
import { KnowledgeBasePage } from '../modules/documents/pages/KnowledgeBasePage';
import { CustomerListPage } from '../modules/customers/pages/CustomerListPage';
import { ProductListPage } from '../modules/products/pages/ProductListPage';
import { OrderListPage } from '../modules/orders/pages/OrderListPage';
import { CustomerSupportPage } from '../modules/support/pages/CustomerSupportPage';
import { SalesEcommercePage } from '../modules/sales/pages/SalesEcommercePage';
import { SQLAnalystPage } from '../modules/bi/pages/SQLAnalystPage';
import { MultiAgentStudioPage } from '../modules/multi-agent/pages/MultiAgentStudioPage';
import { AutomationWorkflowsPage } from '../modules/automation/pages/AutomationWorkflowsPage';
import { DynamicCmsPage } from '../modules/cms/pages/DynamicCmsPage';
import { SaaSManagementPage } from '../modules/billing/pages/SaaSManagementPage';
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
                  <Route
                    path="/admin/tenants"
                    element={
                      <SuperAdminRoute>
                        <SuperAdminTenantsPage />
                      </SuperAdminRoute>
                    }
                  />
                  <Route
                    path="/admin/users"
                    element={
                      <SuperAdminRoute>
                        <SuperAdminUsersPage />
                      </SuperAdminRoute>
                    }
                  />
                  <Route
                    path="/admin/roles"
                    element={
                      <SuperAdminRoute>
                        <SuperAdminRolesPage />
                      </SuperAdminRoute>
                    }
                  />
                  <Route
                    path="/admin/settings"
                    element={
                      <SuperAdminRoute>
                        <SuperAdminSettingsPage />
                      </SuperAdminRoute>
                    }
                  />
                  <Route
                    path="/admin/infrastructure"
                    element={
                      <SuperAdminRoute>
                        <SuperAdminInfrastructurePage />
                      </SuperAdminRoute>
                    }
                  />
                  <Route
                    path="/admin/ai-providers"
                    element={
                      <SuperAdminRoute>
                        <SuperAdminAiProvidersPage />
                      </SuperAdminRoute>
                    }
                  />
                  <Route
                    path="/admin/feature-flags"
                    element={
                      <SuperAdminRoute>
                        <SuperAdminFeatureFlagsPage />
                      </SuperAdminRoute>
                    }
                  />
                  <Route
                    path="/admin/prompts"
                    element={
                      <SuperAdminRoute>
                        <SuperAdminPromptsPage />
                      </SuperAdminRoute>
                    }
                  />
                  <Route path="/ai-chat" element={<AIChatPage />} />
                  <Route path="/chat" element={<AIChatPage />} />
                  <Route path="/ai" element={<AIChatPage />} />
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
                  <Route path="/support" element={<CustomerSupportPage />} />
                  <Route path="/sales" element={<SalesEcommercePage />} />
                  <Route path="/sql-analyst" element={<SQLAnalystPage />} />
                  <Route path="/analytics" element={<SQLAnalystPage />} />
                  <Route path="/bi" element={<SQLAnalystPage />} />
                  <Route path="/documents" element={<KnowledgeBasePage />} />
                  <Route path="/knowledge" element={<KnowledgeBasePage />} />
                  <Route path="/multi-agent" element={<MultiAgentStudioPage />} />
                  <Route path="/developer-agent" element={<MultiAgentStudioPage />} />
                  <Route path="/automation" element={<AutomationWorkflowsPage />} />
                  <Route path="/automation/workflows" element={<AutomationWorkflowsPage />} />
                  <Route path="/automation/notifications" element={<AutomationWorkflowsPage />} />
                  <Route path="/cms" element={<DynamicCmsPage />} />
                  <Route path="/cms/pages" element={<DynamicCmsPage />} />
                  <Route path="/cms/menus" element={<DynamicCmsPage />} />
                  <Route path="/cms/media" element={<DynamicCmsPage />} />
                  <Route path="/billing" element={<SaaSManagementPage />} />
                  <Route path="/subscription" element={<SaaSManagementPage />} />
                  <Route path="/saas" element={<SaaSManagementPage />} />
                  <Route path="/plans" element={<SaaSManagementPage />} />
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
