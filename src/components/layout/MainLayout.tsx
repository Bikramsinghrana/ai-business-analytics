import React from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { UserRole } from '../../types/enums';

interface MainLayoutProps {
  children: React.ReactNode;
  userRole?: UserRole;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children, userRole = UserRole.SUPER_ADMIN }) => {
  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <Sidebar userRole={userRole} />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
