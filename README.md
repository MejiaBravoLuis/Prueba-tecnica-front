# 💬 Chat App Frontend - Prueba Técnica

Frontend de una aplicación de chat desarrollada con Next.js, que consume una API externa desplegada en Cloudflare Workers.

---

# 🚀 Live Demo

🌐 Producción:
https://prueba-tecnica-front-virid.vercel.app/

---

# 🧱 Backend API

Este frontend consume la siguiente API:

⚡ https://chat-app.lmebravo6.workers.dev

---

# ⚙️ Tecnologías utilizadas

- Next.js
- React
- TypeScript
- React Query (manejo de fetching/caching)
- Fetch API

---

# 📦 Instalación y ejecución en local

## 1. Clonar el repositorio

```bash
git clone https://github.com/MejiaBravoLuis/Prueba-tecnica-front.git
cd Prueba-tecnica-front

## 2. Variables de entorno
Crear archivo .env.local en la raíz del frontend:
NEXT_PUBLIC_API_URL=http://localhost:8787

## 3. Instalar dependencias y correr el programa
npm i
npm run dev

## 4. Abrir en el navegador
http://localhost:3000

