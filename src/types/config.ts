import { UserRole } from './enums';

export interface AppConfig {
  app: {
    name: string;
    version: string;
    environment: string;
  };
  features: Record<string, boolean>;
  user: {
    role: UserRole;
    isSuperAdmin: boolean;
  };
  storage: {
    driver: string;
  };
  ai: {
    defaultProvider: string;
  };
}
