from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.auth import get_current_user
from app.database import get_db
from app.models import StockCritico, Usuario
from app.schemas import StockCriticoIn, StockCriticoOut

router = APIRouter(prefix="/api/stock-critico", tags=["Stock Crítico"])


@router.get("/", response_model=list[StockCriticoOut])
def listar_stock_critico(
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user),
):
    """Lista todos los valores de stock crítico configurados."""
    return db.query(StockCritico).order_by(StockCritico.producto).all()


@router.put("/", response_model=StockCriticoOut)
def configurar_stock_critico(
    payload: StockCriticoIn,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user),
):
    """Crea o actualiza el valor de stock crítico para un producto."""
    registro = (
        db.query(StockCritico)
        .filter(StockCritico.producto == payload.producto)
        .first()
    )

    if registro:
        registro.valor_critico = payload.valor_critico
    else:
        registro = StockCritico(
            producto=payload.producto, valor_critico=payload.valor_critico
        )
        db.add(registro)

    db.commit()
    db.refresh(registro)
    return registro
