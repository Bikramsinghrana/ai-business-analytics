Build the frontend for a production-ready multi-tenant SaaS application called:

AURA — AI Business Automation Platform

TECH STACK:
- React
- TypeScript
- Vite
- React Router
- TanStack Query
- Axios
- React Hook Form
- Zod
- Tailwind CSS
- shadcn/ui
- Lucide React
- Zustand only when global client state is actually required

BACKEND:
Laravel REST API

MAIN GOAL:
Create one scalable React frontend containing all AURA modules. The frontend must be fast, clean, responsive, reusable, type-safe, permission-aware, tenant-aware and production-ready.

IMPORTANT:
Do NOT create separate frontend projects for each module.
All modules belong to ONE React application.

==================================================
PROJECT MODULES
==================================================

1. Authentication
2. Dashboard
3. Multi-Tenant Management
4. Users
5. Customers
6. Products
7. Orders
8. Support
9. Sales
10. Analytics
11. AI Chat Assistant
12. AI Tool Calling
13. AI SQL Analyst
14. RAG / Knowledge Base
15. Document Agent
16. Customer Support Agent
17. Sales Agent
18. E-commerce Agent
19. Multi-Agent Supervisor
20. Developer Agent
21. Tester Agent
22. Notifications
23. Messaging
24. Settings
25. Super Admin
26. Billing / Subscription
27. AI Usage / Token Usage
28. Audit Logs

==================================================
FRONTEND FOLDER STRUCTURE
==================================================

resources/js/

├── app/
│   ├── App.tsx
│   ├── router/
│   ├── providers/
│   └── layouts/
│
├── components/
│   ├── ui/
│   ├── form/
│   ├── table/
│   ├── modal/
│   ├── loading/
│   └── feedback/
│
├── modules/
│   ├── auth/
│   ├── dashboard/
│   ├── tenants/
│   ├── users/
│   ├── customers/
│   ├── products/
│   ├── orders/
│   ├── support/
│   ├── sales/
│   ├── analytics/
│   ├── knowledge-base/
│   ├── documents/
│   ├── ai/
│   ├── agents/
│   ├── ecommerce/
│   ├── notifications/
│   ├── messaging/
│   ├── settings/
│   ├── billing/
│   ├── super-admin/
│   └── developer-agent/
│
├── services/
│   ├── api/
│   ├── auth/
│   ├── tenant/
│   └── storage/
│
├── hooks/
│
├── stores/
│
├── types/
│
├── lib/
│
├── config/
│
├── constants/
│
├── assets/
│
└── main.tsx

==================================================
MODULE STRUCTURE
==================================================

Every major module should have its own structure.

Example:

modules/products/

├── api/
│   └── productApi.ts
│
├── components/
│   ├── ProductForm.tsx
│   ├── ProductTable.tsx
│   ├── ProductFilters.tsx
│   ├── ProductImageUpload.tsx
│   └── ProductStatusBadge.tsx
│
├── hooks/
│   ├── useProducts.ts
│   ├── useProduct.ts
│   ├── useCreateProduct.ts
│   └── useUpdateProduct.ts
│
├── pages/
│   ├── ProductListPage.tsx
│   ├── ProductCreatePage.tsx
│   ├── ProductEditPage.tsx
│   └── ProductShowPage.tsx
│
├── types/
│   └── product.ts
│
├── schemas/
│   └── productSchema.ts
│
└── index.ts

Use the same pattern for other modules.

==================================================
COMPONENT RULE
==================================================

Generic UI components go into:

components/ui/

Examples:

Button
Input
Select
Dialog
Modal
Card
Badge
Table
Tabs
Tooltip
Avatar

Business-specific components stay inside their module.

Example:

ProductForm.tsx
→ modules/products/components/

Do NOT put every business component into one global components folder.

==================================================
PAGE NAMING
==================================================

Use clear names:

ProductListPage.tsx
ProductCreatePage.tsx
ProductEditPage.tsx
ProductShowPage.tsx

CustomerListPage.tsx
CustomerCreatePage.tsx
CustomerShowPage.tsx

OrderListPage.tsx
OrderShowPage.tsx

AIChatPage.tsx
ConversationPage.tsx

SQLAnalystPage.tsx

DocumentListPage.tsx
DocumentUploadPage.tsx

Avoid unclear names such as:

Page.tsx
Common.tsx
Helper.tsx
Stuff.tsx
Manage.tsx

==================================================
API ARCHITECTURE
==================================================

Never make Axios/API requests directly inside large UI components.

Use:

Page
↓
Hook
↓
Module API
↓
Shared Axios Client
↓
Laravel API

Example:

ProductListPage
↓
useProducts()
↓
productApi.getProducts()
↓
apiClient
↓
Laravel

Create one reusable API client:

services/api/apiClient.ts

Handle:

- authentication
- 401
- 403
- 422
- 429
- 500
- common error handling

==================================================
SERVER STATE
==================================================

Use TanStack Query for server state.

Examples:

useProducts()
useProduct()
useCustomers()
useOrders()
useTickets()
useNotifications()
useConversations()

Use it for:

- caching
- loading
- errors
- pagination
- mutations
- invalidation
- refetching

Do not put all API data into Zustand.

==================================================
STATE MANAGEMENT
==================================================

Use React state for local component state.

Use TanStack Query for server state.

Use Zustand only for genuinely global client state.

Examples:

- sidebar state
- theme
- selected tenant
- UI preferences

Do NOT put everything into global state.

==================================================
TYPESCRIPT
==================================================

Use TypeScript everywhere.

Do not use "any" unless absolutely necessary.

Create types for:

- User
- Tenant
- Customer
- Product
- Order
- Ticket
- Lead
- Document
- AIConversation
- AIMessage
- Agent
- Notification

Example:

interface Product {
    id: string;
    name: string;
    price: number;
    status: ProductStatus;
    imageUrl?: string;
}

Use proper types for API responses and pagination.

==================================================
AUTHENTICATION
==================================================

Create:

modules/auth/

Support:

- Login
- Register
- Forgot Password
- Reset Password
- Logout
- Current User
- Session/token handling

After login:

User
↓
Permissions
↓
Current Tenant
↓
Features
↓
Dashboard

==================================================
MULTI-TENANCY
==================================================

AURA is a multi-tenant application.

Frontend must support:

- current user
- current tenant
- tenant switching
- tenant branding
- tenant permissions
- tenant features

Create:

useTenant()
TenantProvider

Super Admin may manage multiple tenants.

When tenant changes:

- update tenant context
- clear old tenant-specific cached data
- refetch current tenant data

Never assume frontend tenant_id is trusted.

Laravel must always validate tenant access.

==================================================
PERMISSIONS
==================================================

Frontend must support permission-based UI.

Example:

can("product.create")
can("product.update")
can("product.delete")

Create:

usePermissions()

Create reusable:

<Can permission="product.create">

Frontend permissions only control UI.

Laravel must enforce permissions on the backend.

==================================================
DYNAMIC FEATURE FLAGS
==================================================

Super Admin can enable or disable modules per tenant.

Examples:

AI Chat
SQL Analyst
RAG
Sales Agent
E-commerce Agent
Developer Agent

Backend returns configuration such as:

features:
{
    ai_chat: true,
    sql_analyst: true,
    rag: true,
    sales_agent: false
}

Frontend must dynamically show/hide modules.

Do NOT hard-code feature availability.

==================================================
DYNAMIC NAVIGATION
==================================================

Sidebar/navigation must be based on:

- user role
- permissions
- tenant
- enabled features

Example:

Dashboard

AI
- Assistant
- Conversations
- Agents
- SQL Analyst

Business
- Customers
- Products
- Orders
- Sales
- Support

Knowledge
- Documents
- Knowledge Base

Analytics

Settings

Super Admin gets a separate navigation menu.

==================================================
AI CHAT
==================================================

Create:

modules/ai/

Support:

- conversations
- messages
- streaming
- tool calls
- agents
- token usage
- conversation history

UI:

AIChatPage
ConversationList
ChatWindow
MessageList
MessageBubble
ChatInput
TypingIndicator
ToolCallDisplay
AgentStatus

Flow:

User
↓
React
↓
Laravel
↓
AI Provider
↓
Streaming response
↓
React

Display streaming responses when supported.

==================================================
AI TOOL CALLING
==================================================

Frontend should display AI tool activity safely.

Example:

AI Assistant

Checking customer information...

Customer found.

Do not expose sensitive internal information.

==================================================
AI SQL ANALYST
==================================================

Create:

SQLAnalystPage

Components:

QuestionInput
AnalysisResult
DataTable
Chart
QueryExplanation

Flow:

User question
↓
Laravel AI Agent
↓
Validated SQL
↓
Database
↓
Result
↓
React

Frontend must NEVER execute SQL directly.

==================================================
RAG / DOCUMENTS
==================================================

Create:

modules/documents/
modules/knowledge-base/

Support:

- file upload
- document list
- document preview
- processing status
- search
- citations

Status:

Uploading
Processing
Embedding
Ready
Failed

File upload should support:

- progress
- validation
- preview
- retry
- remove

==================================================
CUSTOMER SUPPORT
==================================================

Create:

modules/support/

Support:

- tickets
- messages
- status
- priority
- customer information
- AI assistance
- human handoff

==================================================
SALES
==================================================

Create:

modules/sales/

Support:

- leads
- lead scoring
- pipeline
- activities
- AI qualification
- customer history

==================================================
E-COMMERCE
==================================================

Create:

modules/ecommerce/

Support:

- product search
- recommendations
- cart
- checkout
- orders
- AI shopping assistant

==================================================
MULTI-AGENT UI
==================================================

Create:

modules/agents/

Support:

- agent list
- agent details
- agent status
- tasks
- executions
- tool calls
- agent handoff
- supervisor activity

Example:

User
↓
Supervisor Agent
↓
Support Agent
OR
Sales Agent
OR
Analytics Agent
OR
E-commerce Agent
↓
Result

==================================================
DEVELOPER AGENT
==================================================

Create:

modules/developer-agent/

Support UI for:

- code analysis
- code review
- test execution
- error analysis
- task progress
- generated changes

Production code changes must require explicit human approval.

==================================================
NOTIFICATIONS
==================================================

Create:

modules/notifications/

Support:

- notification bell
- unread count
- notification list
- mark as read
- notification details

Later support realtime notifications.

==================================================
MESSAGING
==================================================

Create:

modules/messaging/

Support:

- conversations
- messages
- attachments
- customer/support communication
- AI messages

==================================================
IMAGE UPLOAD
==================================================

Create reusable:

components/form/ImageUploader.tsx

Support:

- drag/drop
- preview
- validation
- progress
- retry
- delete

Used by:

- products
- users
- tenant logo
- documents
- attachments

Backend decides whether storage is local or S3.

Frontend only communicates with Laravel API.

==================================================
FORMS
==================================================

Use:

React Hook Form
+
Zod

All important forms should have:

- validation
- loading state
- error state
- success feedback
- disabled submit while processing

Backend validation remains authoritative.

==================================================
TABLES
==================================================

Create reusable DataTable.

Support:

- pagination
- search
- filters
- sorting
- column visibility
- bulk actions where required
- loading
- empty state

Never load thousands of records into the browser unnecessarily.

==================================================
LOADING / ERROR / EMPTY STATES
==================================================

Every API page must support:

Loading
Empty
Error
Success

Never show a blank screen while an API request is loading.

==================================================
RESPONSIVE DESIGN
==================================================

Support:

- mobile
- tablet
- desktop
- large desktop

Dashboard should have:

Desktop:
Sidebar + Content

Mobile:
Drawer + Content

Tables must be responsive.

==================================================
THEME
==================================================

Support:

- light
- dark
- system

Tenant branding:

- logo
- favicon
- primary color
- company name

Branding should come dynamically from backend configuration.

==================================================
PERFORMANCE
==================================================

Optimize for speed.

Use:

- lazy routes
- code splitting
- TanStack Query caching
- pagination
- debounced search
- optimized images
- WebP/AVIF where appropriate
- virtualized large lists
- minimal unnecessary renders

Do not use useMemo/useCallback everywhere without a reason.

Avoid unnecessary API requests.

==================================================
ROUTING
==================================================

Example:

/login

/dashboard

/customers
/customers/create
/customers/:id
/customers/:id/edit

/products
/products/create
/products/:id
/products/:id/edit

/orders
/orders/:id

/support/tickets
/support/tickets/:id

/sales/leads
/sales/leads/:id

/ai/chat
/ai/conversations/:id
/ai/agents

/analytics
/analytics/sql

/documents
/documents/upload

/knowledge-base

/settings

/admin
/admin/tenants
/admin/users
/admin/ai
/admin/features
/admin/settings

==================================================
ROUTE PROTECTION
==================================================

Create:

ProtectedRoute
TenantRoute
PermissionRoute
FeatureRoute
SuperAdminRoute

Route flow:

Authenticated?
↓
Tenant available?
↓
Permission?
↓
Feature enabled?
↓
Page

==================================================
SECURITY
==================================================

Never put private secrets in React.

Never expose:

- database password
- AWS secret key
- AI provider secret key
- private API keys

Frontend is not trusted.

Backend must enforce:

- authentication
- authorization
- tenant isolation
- validation
- file access

==================================================
ENVIRONMENT
==================================================

Frontend environment may contain only public configuration.

Example:

VITE_APP_NAME
VITE_API_URL
VITE_WS_URL
VITE_APP_ENV

Do not expose private secrets through VITE variables.

Local and production URLs must come from environment configuration.

==================================================
TESTING
==================================================

Use:

Vitest
React Testing Library
Playwright

Test:

- login
- permissions
- tenant switching
- feature flags
- forms
- products
- uploads
- AI chat
- critical workflows

Important E2E:

Login
↓
Select Tenant
↓
Products
↓
Create Product
↓
Upload Image
↓
Verify Product

==================================================
CODING RULES
==================================================

1. Use TypeScript.
2. Avoid any.
3. Use module-based architecture.
4. Keep components small and focused.
5. Do not create giant App.tsx.
6. Do not put API requests directly in UI components.
7. Use TanStack Query for server state.
8. Use Zustand only when necessary.
9. Keep business components inside their modules.
10. Keep reusable UI inside components/ui.
11. Do not duplicate code.
12. Do not hard-code tenant IDs.
13. Do not hard-code permissions.
14. Do not hard-code feature flags.
15. Do not expose secrets.
16. Use lazy loading.
17. Use pagination.
18. Optimize images.
19. Handle loading/error/empty states.
20. Keep frontend and backend responsibilities separate.
21. Backend is the final authority for security.
22. Write reusable code only when reuse is real.
23. Prefer simple code over unnecessary abstraction.
24. Keep files focused on one responsibility.
25. Before creating a new component/hook/helper, search the existing project and reuse existing code when appropriate.

==================================================
DEVELOPMENT ORDER
==================================================

Build step-by-step.

PHASE 1:
Project setup
React
TypeScript
Vite
Tailwind
shadcn/ui

PHASE 2:
API client
React Router
layouts
error handling

PHASE 3:
Authentication

PHASE 4:
Tenant system
permissions
feature flags

PHASE 5:
Dashboard

PHASE 6:
Customers
Products
Orders

PHASE 7:
Notifications
Messaging

PHASE 8:
AI Chat

PHASE 9:
Tool Calling

PHASE 10:
SQL Analyst

PHASE 11:
Documents
RAG
Knowledge Base

PHASE 12:
Customer Support Agent

PHASE 13:
Sales Agent

PHASE 14:
E-commerce Agent

PHASE 15:
Multi-Agent Supervisor

PHASE 16:
Developer + Tester Agent

PHASE 17:
Super Admin

PHASE 18:
Billing
AI usage
reports

PHASE 19:
Testing
performance
accessibility
security

PHASE 20:
Production optimization

==================================================
IMPORTANT IMPLEMENTATION RULE
==================================================

Do not build all modules at once.

For every phase:

1. Create folder structure.
2. Create types.
3. Create API layer.
4. Create hooks.
5. Create components.
6. Create pages.
7. Add routes.
8. Add permissions.
9. Add feature flags.
10. Connect Laravel API.
11. Add loading/error/empty states.
12. Add tests.
13. Check performance.
14. Check tenant isolation.
15. Only then move to the next phase.

The final result must be ONE React + TypeScript frontend application for the entire AURA multi-tenant AI SaaS platform.