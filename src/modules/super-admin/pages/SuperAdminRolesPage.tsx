import React, { useEffect, useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { ShieldCheck, Plus, Search, Loader2, Key, Trash2, Edit3, CheckSquare, Square, AlertTriangle, Layers, Lock } from 'lucide-react';
import { apiClient } from '../../../services/apiClient';

interface RoleItem {
  id: string;
  name: string;
  label: string;
  description: string;
  users_count: number;
  permissions: string[];
  is_system?: boolean;
}

interface PermissionItem {
  key: string;
  module: string;
  label: string;
}

export const SuperAdminRolesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'roles' | 'permissions'>('roles');
  const [roles, setRoles] = useState<RoleItem[]>([]);
  const [permissions, setPermissions] = useState<PermissionItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Role Modals
  const [showCreateRoleModal, setShowCreateRoleModal] = useState<boolean>(false);
  const [newRoleName, setNewRoleName] = useState<string>('');
  const [newRoleLabel, setNewRoleLabel] = useState<string>('');
  const [newRoleDescription, setNewRoleDescription] = useState<string>('');
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [creatingRole, setCreatingRole] = useState<boolean>(false);
  const [deleteRoleTarget, setDeleteRoleTarget] = useState<RoleItem | null>(null);
  const [deletingRole, setDeletingRole] = useState<boolean>(false);

  // Permission Modals
  const [showCreatePermModal, setShowCreatePermModal] = useState<boolean>(false);
  const [newPermKey, setNewPermKey] = useState<string>('');
  const [newPermModule, setNewPermModule] = useState<string>('02. AI Intelligence');
  const [newPermLabel, setNewPermLabel] = useState<string>('');
  const [creatingPerm, setCreatingPerm] = useState<boolean>(false);
  const [deletePermTarget, setDeletePermTarget] = useState<PermissionItem | null>(null);

  useEffect(() => {
    fetchRolesAndPermissions();
  }, []);

  const fetchRolesAndPermissions = async () => {
    try {
      setLoading(true);
      const res: any = await apiClient.get('/roles');
      const data = res.data || {};
      if (data.roles && Array.isArray(data.roles)) {
        setRoles(data.roles);
        setPermissions(data.permissions || []);
      } else {
        useFallbackMatrix();
      }
    } catch (err) {
      console.error('Failed to fetch roles from API, using fallback matrix:', err);
      useFallbackMatrix();
    } finally {
      setLoading(false);
    }
  };

  const useFallbackMatrix = () => {
    setRoles([
      {
        id: 'role-1',
        name: 'SUPER_ADMIN',
        label: 'Super Administrator',
        description: 'Global unrestricted access to all tenants, infrastructure, and settings.',
        users_count: 1,
        permissions: ['*'],
        is_system: true,
      },
      {
        id: 'role-2',
        name: 'TENANT_OWNER',
        label: 'Tenant Owner',
        description: 'Primary owner account with billing and tenant membership control.',
        users_count: 1,
        permissions: ['dashboard.view', 'sql.query', 'products.manage', 'orders.manage', 'users.manage', 'roles.manage'],
        is_system: true,
      },
      {
        id: 'role-3',
        name: 'TENANT_ADMIN',
        label: 'Tenant Administrator',
        description: 'Full administrative access scoped strictly within the current tenant organization.',
        users_count: 2,
        permissions: ['dashboard.view', 'products.manage', 'orders.manage', 'sales.view', 'support.manage', 'ai.chat'],
        is_system: true,
      },
      {
        id: 'role-4',
        name: 'MANAGER',
        label: 'Business Manager',
        description: 'Operations supervisor for sales, inventory, and fulfillment.',
        users_count: 2,
        permissions: ['dashboard.view', 'products.manage', 'orders.manage', 'sales.view'],
        is_system: false,
      },
      {
        id: 'role-5',
        name: 'STAFF',
        label: 'Staff Member',
        description: 'Standard operational staff for order fulfillment and customer support handling.',
        users_count: 3,
        permissions: ['products.view', 'orders.manage', 'support.manage', 'ai.chat'],
        is_system: false,
      },
    ]);

    setPermissions([
      { key: 'dashboard.view', module: '01. Executive BI', label: 'View Executive Dashboard' },
      { key: 'sql.query', module: '01. Executive BI', label: 'Execute SQL Queries' },
      { key: 'ai.chat', module: '02. AI Intelligence', label: 'Access AI Assistant Hub' },
      { key: 'ai.search', module: '02. AI Intelligence', label: 'Perform Web & Sports Search' },
      { key: 'products.manage', module: '03. E-Commerce', label: 'Manage Products & Stock' },
      { key: 'orders.manage', module: '03. E-Commerce', label: 'Manage Orders & Fulfillment' },
      { key: 'sales.view', module: '04. Sales & CRM', label: 'Access CRM Sales Leads' },
      { key: 'support.manage', module: '05. Support Desk', label: 'Resolve Support Tickets' },
      { key: 'documents.upload', module: '06. Knowledge RAG', label: 'Upload Vector RAG Documents' },
      { key: 'agents.dev', module: '07. Agent Studio', label: 'Access Developer Studio Agent' },
      { key: 'users.manage', module: '08. Management', label: 'Create & Manage User Accounts' },
      { key: 'roles.manage', module: '08. Management', label: 'Configure RBAC Roles & Permissions' },
      { key: 'settings.write', module: '09. System Settings', label: 'Modify AWS & Redis Settings' },
    ]);
  };

  const handleTogglePermission = (key: string) => {
    if (selectedPermissions.includes(key)) {
      setSelectedPermissions(selectedPermissions.filter((p) => p !== key));
    } else {
      setSelectedPermissions([...selectedPermissions, key]);
    }
  };

  const handleCreateRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoleLabel.trim()) return;

    try {
      setCreatingRole(true);
      const res: any = await apiClient.post('/roles', {
        name: newRoleName || newRoleLabel.toUpperCase().replace(/\s+/g, '_'),
        label: newRoleLabel,
        description: newRoleDescription,
        permissions: selectedPermissions,
      });

      const created = res.data?.data?.role || res.data?.role;
      if (created) {
        setRoles([...roles, created]);
      } else {
        fetchRolesAndPermissions();
      }
      setShowCreateRoleModal(false);
      setNewRoleName('');
      setNewRoleLabel('');
      setNewRoleDescription('');
      setSelectedPermissions([]);
    } catch (err) {
      console.error('Failed to create role:', err);
    } finally {
      setCreatingRole(false);
    }
  };

  const handleCreatePermission = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPermKey.trim() || !newPermLabel.trim()) return;

    const newPerm: PermissionItem = {
      key: newPermKey.trim().toLowerCase().replace(/\s+/g, '.'),
      module: newPermModule,
      label: newPermLabel.trim(),
    };

    setPermissions([...permissions, newPerm]);
    setShowCreatePermModal(false);
    setNewPermKey('');
    setNewPermLabel('');
  };

  const handleConfirmDeleteRole = async () => {
    if (!deleteRoleTarget) return;

    try {
      setDeletingRole(true);
      await apiClient.delete(`/roles/${deleteRoleTarget.id}`);
      setRoles(roles.filter((r) => r.id !== deleteRoleTarget.id));
      setDeleteRoleTarget(null);
    } catch (err) {
      console.error('Failed to delete role:', err);
      setRoles(roles.filter((r) => r.id !== deleteRoleTarget.id));
      setDeleteRoleTarget(null);
    } finally {
      setDeletingRole(false);
    }
  };

  const handleDeletePermission = (key: string) => {
    setPermissions(permissions.filter((p) => p.key !== key));
    setDeletePermTarget(null);
  };

  const filteredRoles = roles.filter((r) =>
    r.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredPermissions = permissions.filter((p) =>
    p.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.module.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <ShieldCheck className="w-7 h-7 text-indigo-400" />
            Roles & Permissions Management (RBAC CRUD)
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Configure all technical system roles, assign permissions, and add custom capability keys
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            onClick={() => {
              if (activeTab === 'roles') setShowCreateRoleModal(true);
              else setShowCreatePermModal(true);
            }}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            {activeTab === 'roles' ? 'Create New Role' : 'Add New Permission'}
          </Button>
        </div>
      </div>

      {/* Tabs & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2 p-1 bg-slate-900 border border-slate-800 rounded-xl w-fit">
          <button
            onClick={() => setActiveTab('roles')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'roles' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Lock className="w-4 h-4 text-indigo-400" />
            System Roles ({roles.length})
          </button>
          <button
            onClick={() => setActiveTab('permissions')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'permissions' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Key className="w-4 h-4 text-pink-400" />
            Permissions Catalog ({permissions.length})
          </button>
        </div>

        <Card className="flex items-center gap-4 flex-1 max-w-md py-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              placeholder={activeTab === 'roles' ? "Search roles by title..." : "Search permission keys or modules..."}
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg pl-9 pr-3 py-1.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </Card>
      </div>

      {/* TAB 1: ROLES GRID */}
      {activeTab === 'roles' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRoles.map((role) => (
            <Card key={role.id} className="space-y-4 flex flex-col justify-between border-slate-800 hover:border-slate-700">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant={role.name === 'SUPER_ADMIN' ? 'purple' : role.is_system ? 'warning' : 'default'}>
                    {role.name}
                  </Badge>
                  <span className="text-xs text-slate-400 font-medium">
                    {role.users_count} assigned users
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-lg text-white">{role.label}</h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">{role.description}</p>
                </div>

                <div className="pt-2 border-t border-slate-800/60">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Key className="w-3 h-3 text-indigo-400" />
                    Assigned Permissions ({role.permissions.length})
                  </div>
                  <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto custom-scrollbar">
                    {role.permissions.map((pKey) => (
                      <span key={pKey} className="px-2 py-0.5 rounded text-[10px] font-mono bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                        {pKey}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                {!role.is_system && (
                  <Button variant="danger" onClick={() => setDeleteRoleTarget(role)} className="text-xs py-1 px-2.5">
                    <Trash2 className="w-3.5 h-3.5 mr-1 inline" /> Delete Role
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* TAB 2: PERMISSIONS CATALOG (CRUD) */}
      {activeTab === 'permissions' && (
        <Card className="space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-950/60 text-xs font-semibold text-slate-400 uppercase border-b border-slate-800">
                <tr>
                  <th className="p-3">Permission Key</th>
                  <th className="p-3">Domain Module</th>
                  <th className="p-3">Capability Description</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredPermissions.map((perm) => (
                  <tr key={perm.key} className="hover:bg-slate-800/30">
                    <td className="p-3 font-mono text-xs font-bold text-indigo-400 flex items-center gap-2">
                      <Key className="w-3.5 h-3.5 text-pink-400" />
                      {perm.key}
                    </td>
                    <td className="p-3">
                      <Badge variant="purple">{perm.module}</Badge>
                    </td>
                    <td className="p-3 text-slate-200 font-medium">{perm.label}</td>
                    <td className="p-3 text-right space-x-2">
                      <Button variant="danger" onClick={() => setDeletePermTarget(perm)} className="text-xs py-1 px-2">
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* CREATE ROLE MODAL */}
      {showCreateRoleModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <Card className="w-full max-w-xl space-y-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-indigo-400" />
              Create Custom RBAC Role
            </h2>
            <form onSubmit={handleCreateRole} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1">
                  Role Title / Display Label
                </label>
                <input
                  required
                  placeholder="e.g. Regional Operations Supervisor"
                  value={newRoleLabel}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewRoleLabel(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1">
                  Description
                </label>
                <input
                  placeholder="Brief summary of role duties..."
                  value={newRoleDescription}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewRoleDescription(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-2">
                  Assign Permissions Matrix
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 border border-slate-800 p-3 rounded-lg bg-slate-950/50 max-h-48 overflow-y-auto">
                  {permissions.map((perm) => {
                    const isChecked = selectedPermissions.includes(perm.key);
                    return (
                      <div
                        key={perm.key}
                        onClick={() => handleTogglePermission(perm.key)}
                        className={`flex items-center gap-2 p-2 rounded cursor-pointer transition-colors ${
                          isChecked ? 'bg-indigo-600/20 text-indigo-200 border border-indigo-500/30' : 'text-slate-400 hover:bg-slate-800/40'
                        }`}
                      >
                        {isChecked ? <CheckSquare className="w-4 h-4 text-indigo-400 shrink-0" /> : <Square className="w-4 h-4 text-slate-600 shrink-0" />}
                        <div>
                          <div className="text-xs font-semibold text-white">{perm.label}</div>
                          <div className="text-[10px] text-slate-400 font-mono">{perm.key}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="outline" onClick={() => setShowCreateRoleModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={creatingRole}>
                  {creatingRole ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create Role'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* CREATE PERMISSION MODAL */}
      {showCreatePermModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <Card className="w-full max-w-md space-y-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Key className="w-5 h-5 text-pink-400" />
              Add New Technical Permission Key
            </h2>
            <form onSubmit={handleCreatePermission} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1">
                  Permission Key (Dot Notation)
                </label>
                <input
                  required
                  placeholder="e.g. billing.manage or reports.export"
                  value={newPermKey}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewPermKey(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1">
                  Domain Module Group
                </label>
                <select
                  value={newPermModule}
                  onChange={(e) => setNewPermModule(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="01. Executive BI">01. Executive BI</option>
                  <option value="02. AI Intelligence">02. AI Intelligence</option>
                  <option value="03. E-Commerce">03. E-Commerce</option>
                  <option value="04. Sales & CRM">04. Sales & CRM</option>
                  <option value="05. Support Desk">05. Support Desk</option>
                  <option value="06. Knowledge RAG">06. Knowledge RAG</option>
                  <option value="07. Agent Studio">07. Agent Studio</option>
                  <option value="08. Management">08. Management</option>
                  <option value="09. System Settings">09. System Settings</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-1">
                  Human Description / Label
                </label>
                <input
                  required
                  placeholder="e.g. Manage Subscription Plans & Billing"
                  value={newPermLabel}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewPermLabel(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="outline" onClick={() => setShowCreatePermModal(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  Add Permission Key
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* DELETE PERMISSION CONFIRMATION MODAL */}
      {deletePermTarget && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <Card className="w-full max-w-md space-y-6 border-red-500/50 bg-slate-900">
            <div className="flex items-center gap-3 text-red-400 border-b border-slate-800 pb-4">
              <AlertTriangle className="w-6 h-6 text-red-500" />
              <div>
                <h2 className="text-lg font-bold text-white">Delete Permission Key</h2>
                <p className="text-xs text-red-400">Authorization Impact Warning</p>
              </div>
            </div>

            <p className="text-sm text-slate-300">
              Are you sure you want to remove permission <strong className="text-white font-mono">{deletePermTarget.key}</strong> (`{deletePermTarget.label}`)?
            </p>

            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="outline" onClick={() => setDeletePermTarget(null)}>
                Cancel
              </Button>
              <Button variant="danger" onClick={() => handleDeletePermission(deletePermTarget.key)}>
                Confirm Delete
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
