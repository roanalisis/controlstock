from pydantic import BaseModel
from datetime import date
from typing import Optional


# ── Auth Schemas ──────────────────────────────────────────────

class LoginRequest(BaseModel):
    username: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


# ── Reporte Schemas ──────────────────────────────────────────

class ReporteOut(BaseModel):
    id: int
    producto: str
    cantidad_vendida: float
    stock_actual: float
    fecha: date
    valor_critico: Optional[float] = None

    class Config:
        from_attributes = True


# ── Stock Crítico Schemas ────────────────────────────────────

class StockCriticoIn(BaseModel):
    producto: str
    valor_critico: float


class StockCriticoOut(BaseModel):
    id: int
    producto: str
    valor_critico: float

    class Config:
        from_attributes = True
