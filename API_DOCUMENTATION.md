# 🚀 AURA AI Business Platform — API Reference Guide

> **Base URL:** `http://127.0.0.1:8000/api/v1` (or `http://localhost/ai-business-platform/public/api/v1`)

---

## 🔑 Required Request Headers

| Header | Value | Description |
| :--- | :--- | :--- |
| `Content-Type` | `application/json` | Required for all POST / PUT requests |
| `Accept` | `application/json` | Required for JSON response output |
| `Authorization` | `Bearer <ACCESS_TOKEN>` | Required for all protected endpoints |
| `X-Tenant-ID` | `<TENANT_UUID>` | Optional: specify tenant context (e.g. `11111111-1111-1111-1111-111111111111`) |

---

## 🔐 1. Authentication APIs

### 1.1 User Registration
- **Method:** `POST`
- **URL:** `/auth/register`
- **Auth:** Public

#### 📥 Request Body Format (JSON)
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password123!",
  "password_confirmation": "Password123!"
}
```

#### 📤 Response Format (201 Created)
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "access_token": "eyJhbGciOiJIUzI1Ni...",
    "token_type": "bearer",
    "expires_in": 86400,
    "user": {
      "id": "98f24a12-8821-4b10-a111-222333444555",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user"
    }
  }
}
```

---

### 1.2 User Login
- **Method:** `POST`
- **URL:** `/auth/login`
- **Auth:** Public

#### 📥 Request Body Format (JSON)
```json
{
  "email": "user@gmail.com",
  "password": "password123"
}
```

#### 📤 Response Format (200 OK)
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "access_token": "eyJhbGciOiJIUzI1Ni...",
    "token_type": "bearer",
    "expires_in": 86400,
    "user": {
      "id": "12f39bce-d975-4a31-b275-a642f1cfb219",
      "name": "Super Admin User",
      "email": "user@gmail.com",
      "role": "superadmin"
    }
  }
}
```

---

### 1.3 Get Current User Profile (`/me`)
- **Method:** `GET`
- **URL:** `/auth/me`
- **Auth:** `Bearer Token`

#### 📤 Response Format (200 OK)
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "12f39bce-d975-4a31-b275-a642f1cfb219",
      "name": "Super Admin User",
      "email": "user@gmail.com",
      "role": "superadmin",
      "tenant_id": "11111111-1111-1111-1111-111111111111"
    }
  }
}
```

---

### 1.4 User Logout
- **Method:** `POST`
- **URL:** `/auth/logout`
- **Auth:** `Bearer Token`

#### 📤 Response Format (200 OK)
```json
{
  "success": true,
  "message": "Successfully logged out"
}
```

---

## 🤖 2. AI Assistant APIs

### 2.1 Send AI Prompt & Get Response (Quick Prompt)
- **Method:** `POST`
- **URL:** `/ai/quick-prompt`
- **Auth:** `Bearer Token`

#### 📥 Request Body Format (JSON)
```json
{
  "message": "ind vs sri next metch",
  "search_type": "WEB",
  "provider": "GEMINI"
}
```

> **Supported `search_type` values:**  
> `WEB` (Live Web Search), `GENERAL` (General AI), `ECOMMERCE` (E-commerce), `NEWS` (Breaking News), `AUTO` (Auto Detect), `PROJECT` (Codebase), `SPORTS` (Cricket & Sports), `FINANCE` (Stocks), `BUSINESS_DATA` (Sales SQL), `WEATHER` (Forecast), `KNOWLEDGE` (RAG Documents).

> **Supported `provider` values:**  
> `GEMINI` (Free), `GROQ` (Fast Free), `OPENROUTER` (Free), `OLLAMA` (Offline), `AURA` (Built-in), `OPENAI` (Pro), `CLAUDE` (Pro).

#### 📤 Response Format (200 OK)
```json
{
  "success": true,
  "data": {
    "conversation": {
      "id": "conv-98f24a12",
      "title": "ind vs sri next metch",
      "provider": "GEMINI"
    },
    "user_message": {
      "id": "msg-1101",
      "role": "user",
      "content": "ind vs sri next metch"
    },
    "agent_response": {
      "agent_name": "SportsAgent",
      "search_type": "SPORTS",
      "content": "### 🏏 Live Sports & Cricket Update\n\nHere is what the latest news sources say...",
      "tokens_used": 3399,
      "source": "Google News - Sports / Cricinfo",
      "is_real_time": true,
      "provider": "GEMINI",
      "model": "gemini-3.7-flash"
    }
  }
}
```

---

### 2.2 Send Message in Existing Conversation
- **Method:** `POST`
- **URL:** `/ai/conversations/{id}/messages`

#### 📥 Request Body Format
```json
{
  "message": "Give me detailed fixture dates for the 2nd Test",
  "search_type": "WEB",
  "provider": "GEMINI"
}
```

---

### 2.3 List Available AI Engines & Models
- **Method:** `GET`
- **URL:** `/ai/providers`

#### 📤 Response Format
```json
{
  "success": true,
  "data": {
    "default_provider": "GEMINI",
    "default_model": "gemini-3.7-flash",
    "providers": {
      "GEMINI": {
        "name": "Google Gemini (Free Tier)",
        "is_free": true,
        "model": "gemini-3.7-flash",
        "description": "Google AI with 60 free queries per minute"
      },
      "GROQ": {
        "name": "Groq LPU (Ultra Fast)",
        "is_free": true,
        "model": "llama-3.3-70b-versatile",
        "description": "Ultra fast open-source Llama 3.3 70B"
      }
    }
  }
}
```

---

### 2.4 List All User AI Conversations
- **Method:** `GET`
- **URL:** `/ai/conversations`

---

### 2.5 Delete AI Conversation Session
- **Method:** `DELETE`
- **URL:** `/ai/conversations/{id}`

---

## 🏢 3. Tenant Management APIs

### 3.1 List Tenants
- **Method:** `GET`
- **URL:** `/tenants`

### 3.2 Switch Active Tenant
- **Method:** `POST`
- **URL:** `/tenant/switch`

#### 📥 Request Body
```json
{
  "tenant_id": "11111111-1111-1111-1111-111111111111"
}
```

---

## 📊 4. Business Data APIs

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/products` | `GET` | List tenant catalog & inventory items |
| `/orders` | `GET` | List sales orders & revenue totals |
| `/customers` | `GET` | List CRM customer database |
| `/support/tickets` | `GET` | List active support ticket queue |
| `/sales/leads` | `GET` | List CRM lead pipeline |

---

## 💻 Code Examples

### 1. Login & Store Access Token (JavaScript)
```javascript
const loginRes = await fetch('http://127.0.0.1:8000/api/v1/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
  body: JSON.stringify({ email: 'user@gmail.com', password: 'password123' })
});

const loginData = await loginRes.json();
const token = loginData.data.access_token;
```

### 2. Send AI Prompt (JavaScript)
```javascript
const aiRes = await fetch('http://127.0.0.1:8000/api/v1/ai/quick-prompt', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    message: 'ind vs sri next metch',
    search_type: 'WEB',
    provider: 'GEMINI'
  })
});

const aiData = await aiRes.json();
console.log(aiData.data.agent_response.content);
```

### 3. cURL Command (Login & Quick Prompt)
```bash
# 1. Login
curl -X POST "http://127.0.0.1:8000/api/v1/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"user@gmail.com","password":"password123"}'

# 2. Quick Prompt
curl -X POST "http://127.0.0.1:8000/api/v1/ai/quick-prompt" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{"message":"ind vs sri next metch","search_type":"WEB","provider":"GEMINI"}'
```