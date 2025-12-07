# Portal CRM

Sistema de gestión de relaciones con clientes desarrollado con Angular y Node.js.

## 🚀 Despliegue en Render

### Prerrequisitos
- Cuenta en [Render](https://render.com)
- Base de datos MySQL (Render, Railway, o externa)
- Dominio (opcional)

### Pasos para deployment

1. **Crear base de datos**:
   - En Render: New > PostgreSQL (gratis)
   - O usar MySQL en Railway, PlanetScale, o tu propio servidor

2. **Desplegar Backend**:
   - New > Web Service
   - Conectar repositorio de GitHub
   - Configuración:
     - **Build Command**: `cd backend && npm install`
     - **Start Command**: `cd backend && npm start`
   
   Variables de entorno requeridas:
   ```env
   PORT=3000
   NODE_ENV=production
   JWT_SECRET=generar_un_secreto_seguro_aqui
   DB_HOST=tu_host_de_bd
   DB_PORT=3306
   DB_NAME=portal_crm
   DB_USER=tu_usuario
   DB_PASSWORD=tu_password
   FRONTEND_URL=https://tu-frontend.render.com