from datetime import date
from typing import Optional

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.auth import get_current_user
from app.database import get_db
from app.models import Reporte, StockCritico, Usuario
from app.schemas import ReporteOut

router = APIRouter(prefix="/api/reportes", tags=["Reportes"])


@router.get("/", response_model=list[ReporteOut])
def obtener_reportes(
    fecha: Optional[date] = Query(None, description="Filtrar por fecha (YYYY-MM-DD)"),
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user),
):
    """
    Retorna los reportes de ventas y stock.
    Si se proporciona fecha, filtra por ese día; de lo contrario retorna todos.
    Incluye el valor de stock crítico configurado para cada producto.
    """
    query = db.query(Reporte)

    if fecha:
        query = query.filter(Reporte.fecha == fecha)

    query = query.order_by(Reporte.fecha.desc(), Reporte.producto)
    reportes = query.all()

    # Obtener valores de stock crítico
    criticos = {
        sc.producto: float(sc.valor_critico)
        for sc in db.query(StockCritico).all()
    }

    resultado = []
    for r in reportes:
        resultado.append(
            ReporteOut(
                id=r.id,
                producto=r.producto,
                cantidad_vendida=float(r.cantidad_vendida),
                stock_actual=float(r.stock_actual),
                fecha=r.fecha,
                valor_critico=criticos.get(r.producto),
            )
        )

    return resultado
