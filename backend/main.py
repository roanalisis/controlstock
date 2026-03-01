from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

from app.database import engine, Base
from app.routers import auth_router, reportes_router, stock_critico_router

# Crear tablas automáticamente (para desarrollo)
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Control de Stock API",
    description="API para gestión de reportes de ventas y control de stock",
    version="1.0.0",
)

# CORS — permitir orígenes configurados o defaults
allowed_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Registrar routers
app.include_router(auth_router.router)
app.include_router(reportes_router.router)
app.include_router(stock_critico_router.router)


@app.get("/")
def root():
    return {"message": "Control de Stock API está funcionando"}
