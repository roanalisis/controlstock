"""
Script para inicializar la base de datos con datos de ejemplo.

Uso:
    cd backend
    python seed.py

Requisitos:
    - PostgreSQL corriendo en localhost:5432
    - Base de datos 'controlstock' creada previamente:
        CREATE DATABASE controlstock;
"""

from datetime import date, timedelta

from app.database import engine, SessionLocal, Base
from app.models import Usuario, Reporte, StockCritico
from app.auth import hash_password


def seed():
    # Crear tablas
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()

    try:
        # ── Crear usuario de prueba ──────────────────────────
        existing_user = db.query(Usuario).filter(Usuario.username == "admin").first()
        if not existing_user:
            admin = Usuario(
                username="admin",
                hashed_password=hash_password("admin123"),
            )
            db.add(admin)
            print("✔ Usuario 'admin' creado (contraseña: admin123)")
        else:
            print("ℹ Usuario 'admin' ya existe")

        # ── Crear datos de reporte de ejemplo ────────────────
        if db.query(Reporte).count() == 0:
            hoy = date.today()
            ayer = hoy - timedelta(days=1)

            productos = [
                # (producto, vendida, stock, fecha)
                ("Laptop HP 15", 5, 12, hoy),
                ("Mouse Logitech G203", 25, 80, hoy),
                ("Teclado Mecánico Redragon", 10, 3, hoy),
                ("Monitor Samsung 24\"", 3, 7, hoy),
                ("Auriculares HyperX Cloud", 15, 2, hoy),
                ("Webcam Logitech C920", 8, 45, hoy),
                ("Disco SSD 500GB", 20, 15, hoy),
                ("Memoria RAM 16GB", 12, 8, hoy),
                ("Laptop HP 15", 3, 17, ayer),
                ("Mouse Logitech G203", 18, 105, ayer),
                ("Teclado Mecánico Redragon", 7, 13, ayer),
                ("Monitor Samsung 24\"", 2, 10, ayer),
                ("Auriculares HyperX Cloud", 10, 17, ayer),
                ("Webcam Logitech C920", 5, 53, ayer),
                ("Disco SSD 500GB", 15, 35, ayer),
                ("Memoria RAM 16GB", 8, 20, ayer),
            ]

            for prod, vendida, stock, fecha in productos:
                db.add(
                    Reporte(
                        producto=prod,
                        cantidad_vendida=vendida,
                        stock_actual=stock,
                        fecha=fecha,
                    )
                )
            print(f"✔ {len(productos)} registros de reporte creados")
        else:
            print("ℹ Ya existen registros de reporte")

        # ── Stock crítico de ejemplo ─────────────────────────
        if db.query(StockCritico).count() == 0:
            criticos = [
                ("Laptop HP 15", 5),
                ("Mouse Logitech G203", 20),
                ("Teclado Mecánico Redragon", 5),
                ("Monitor Samsung 24\"", 3),
                ("Auriculares HyperX Cloud", 5),
                ("Webcam Logitech C920", 10),
                ("Disco SSD 500GB", 10),
                ("Memoria RAM 16GB", 5),
            ]
            for prod, valor in criticos:
                db.add(StockCritico(producto=prod, valor_critico=valor))
            print(f"✔ {len(criticos)} configuraciones de stock crítico creadas")
        else:
            print("ℹ Ya existen configuraciones de stock crítico")

        db.commit()
        print("\n✔ Base de datos inicializada correctamente")

    except Exception as e:
        db.rollback()
        print(f"✖ Error: {e}")
    finally:
        db.close()


if __name__ == "__main__":
    seed()
