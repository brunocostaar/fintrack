# FinTrack 📈

Welcome to **FinTrack**, your modern, fast, and secure financial manager. This project was developed to provide an exceptional user experience with an elegant design (Next.js) powered by a robust and scalable Java API (Spring Boot).

## 🚀 Technologies and Architecture

FinTrack is divided into two main layers orchestrated in a modular way:

### ⚙️ Backend (RESTful API)
- **Java 17** & **Spring Boot 4.0.5**
- **Spring Security 6 & JWT (JSON Web Tokens)**: Completely *stateless* and secure architecture. API interactions are protected via asynchronous endpoints that validate JWT signatures.
- **Spring Data JPA & Hibernate**: Secure persistence layer mapping relational Entities and relationships.
- **PostgreSQL**: Relational database chosen to house multi-tenant data integrity.
- **Dotenv**: Sensitive environment variables (DB credentials, JWT Keys) are strictly isolated from the source code.

### 🎨 Frontend (SPA)
- **Next.js (App Router)** & **React 18**
- **Tailwind CSS**: For ultra-fast styling with modern *Glassmorphism* design, embracing vibrant colors in native Dark Mode.
- **Lucide React**: Polished and lightweight icon library.
- **Recharts**: Dynamic generation of fluid financial charts directly in the browser.

---

## 🔐 Security Status
Communication between the Frontend and Backend is configured with strict CORS headers:
- Passwords never cross the database in plain text (End-to-end Bcrypt Hashing).
- The system intercepts the Frontend and dynamically injects `Authorization` Headers.
- Each financial transaction is strictly tied to the logged-in token's principal (`user.getEmail()`). 
- Route leakage and local state manipulation are handled: suspicious access to the web interface issues an instant security logout with `HTTP 403 Forbidden`.

---
*Developed with ☕ and focused on UI/UX excellence in finance.*
