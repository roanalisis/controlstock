# Control de Stock

Sistema de control de stock con reportes de ventas diarios, alertas de stock crítico y autenticación de usuarios.

## Arquitectura

```
controlstock/
├── backend/                  # API REST (Python + FastAPI)
│   ├── app/
│   │   ├── config.py         # Configuración (env vars)
│   │   ├── database.py       # Conexión a PostgreSQL
│   │   ├── models.py         # Modelos SQLAlchemy
│   │   ├── schemas.py        # Schemas Pydantic
│   │   ├── auth.py           # Lógica JWT + bcrypt
│   │   └── routers/
│   │       ├── auth_router.py
│   │       ├── reportes_router.py
│   │       └── stock_critico_router.py
│   ├── main.py               # Entry point FastAPI
│   ├── seed.py               # Script para datos iniciales
│   └── requirements.txt
│
├── src/                      # Frontend (React + Vite)
│   ├── services/             # Capa de servicios (API calls)
│   ├── context/              # Context API (AuthContext)
│   ├── hooks/                # Custom hooks
│   ├── components/           # Componentes reutilizables
│   └── pages/                # Páginas (Login, Dashboard)
│
└── vite.config.js            # Proxy /api → backend
```

### Patrones de diseño utilizados

- **Repository / Service Layer**: separación de la lógica de acceso a datos en servicios
- **Context + Provider**: gestión de estado global de autenticación
- **Custom Hooks**: encapsulamiento de lógica de negocio (`useReportes`, `useStockCritico`, `useAuth`)
- **Protected Routes**: componente HOC para rutas protegidas
- **Interceptors**: manejo centralizado de tokens y errores HTTP

## Requisitos previos

- **Node.js** >= 18
- **Python** >= 3.10
- **PostgreSQL** >= 14

## Configuración

### 1. Base de datos

```sql
CREATE DATABASE controlstock;
```

### 2. Backend

```bash
cd backend

# Crear entorno virtual
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # Linux/Mac

# Instalar dependencias
pip install -r requirements.txt

# Configurar variables de entorno (editar .env)
# DATABASE_URL=postgresql://usuario:password@localhost:5432/controlstock

# Inicializar datos de ejemplo
python seed.py

# Iniciar servidor
uvicorn main:app --reload --port 8000
```

### 3. Frontend

```bash
# Desde la raíz del proyecto
npm install
npm run dev
```

## Acceso

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **Docs API**: http://localhost:8000/docs

### Credenciales de prueba

| Usuario | Contraseña |
|---------|------------|
| admin   | admin123   |

## Base de datos

### Tabla `reporte`

| Campo             | Tipo         | Descripción            |
|-------------------|--------------|------------------------|
| id                | INTEGER (PK) | Identificador          |
| producto          | VARCHAR(255) | Nombre del producto    |
| cantidad_vendida  | NUMERIC      | Unidades vendidas      |
| stock_actual      | NUMERIC      | Stock actual           |
| fecha             | DATE         | Fecha del reporte      |

### Tabla `stock_critico`

| Campo          | Tipo         | Descripción                        |
|----------------|--------------|-------------------------------------|
| id             | INTEGER (PK) | Identificador                      |
| producto       | VARCHAR(255) | Nombre del producto (único)        |
| valor_critico  | NUMERIC      | Umbral de stock crítico            |

### Tabla `usuarios`

| Campo            | Tipo         | Descripción           |
|------------------|--------------|------------------------|
| id               | INTEGER (PK) | Identificador         |
| username         | VARCHAR(50)  | Nombre de usuario     |
| hashed_password  | VARCHAR(255) | Contraseña hasheada   |
